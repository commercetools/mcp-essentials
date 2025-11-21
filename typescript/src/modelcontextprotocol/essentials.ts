import z from 'zod';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration, Context} from '../types/configuration';
import {scopesToActions} from '../utils/scopes';
import {AuthConfig} from '../types/auth';
import {contextToToolsResourceBasedToolSystem} from '../shared/resource-based-tools-system/tools';
import {Tool} from '../types/tools';
import {contextToBulkTools} from '../shared/bulk/tools';
import {DYNAMIC_TOOL_LOADING_THRESHOLD} from '../shared/constants';
import {transformToolOutput} from './transform';

class CommercetoolsAgentEssentials extends McpServer {
  private authConfig: AuthConfig;
  private configuration: Configuration = {};
  private commercetoolsAPI: CommercetoolsAPI;

  private constructor({
    authConfig,
    configuration,
  }: {
    authConfig: AuthConfig;
    configuration: Configuration;
  }) {
    super({
      name: 'Commercetools',
      version: '0.4.0',
    });

    this.authConfig = authConfig;
    const configurationWithDefaults =
      processConfigurationDefaults(configuration);
    this.configuration = configurationWithDefaults;

    this.commercetoolsAPI = new CommercetoolsAPI(
      this.authConfig,
      configurationWithDefaults.context
    );
  }

  public static async create(option: {
    authConfig: AuthConfig;
    configuration: Configuration;
  }) {
    try {
      const instance = new CommercetoolsAgentEssentials(option);
      await instance.init();

      return instance;
    } catch (err: unknown) {
      throw new Error(
        (err as Error).message ??
          'Unable to initialze `CommercetoolsAgentEssentials`'
      );
    }
  }

  private async init() {
    const configuration = this.configuration;

    if (this.authConfig?.clientId && this.authConfig?.clientSecret) {
      // list of scopes' permissions ['view_cart', 'manage_products', '...']
      const scopes = await this.commercetoolsAPI.introspect();

      // scope based filtering
      const filteredActions = scopesToActions(scopes, configuration);

      this.configuration = {
        ...configuration,
        actions: {
          ...filteredActions,
        },
      };
    }

    this.registerTools();
  }

  private registerTools(): void {
    const {context} = this.configuration;
    const filteredTools = this.getFilteredTools();

    const dynamicToolLoadingThreshold =
      context?.dynamicToolLoadingThreshold || DYNAMIC_TOOL_LOADING_THRESHOLD;

    const shouldRegisterAllTools =
      filteredTools.length <= dynamicToolLoadingThreshold;

    if (shouldRegisterAllTools) {
      this.registerAllTools(filteredTools);
    } else {
      this.registerResourceBasedToolSystem(
        filteredTools,
        dynamicToolLoadingThreshold
      );
    }
  }

  private getFilteredTools() {
    const configuration = this.configuration;
    const customTools = configuration.customTools || [];

    if (!Array.isArray(customTools)) {
      throw new Error(`Tool Error: 'customTools' must be an array of tools`);
    }

    customTools.forEach((tool) => {
      if (!tool.execute || typeof tool.execute != 'function') {
        throw new Error(
          `Tool Error: Please provide an 'execute' function for '${tool.name}' tool.`
        );
      }
    });

    return [
      ...customTools,
      ...contextToTools(configuration).filter((tool) =>
        isToolAllowed(tool, configuration)
      ),
    ];
  }

  private registerAllTools(filteredTools: Tool[]): void {
    filteredTools.forEach((tool) => {
      this.registerSingleTool(tool);
    });
  }

  private registerResourceBasedToolSystem(
    filteredTools: Tool[],
    dynamicToolLoadingThreshold: number
  ): void {
    const {context} = this.configuration;
    const filteredToolsLength = filteredTools.length;

    console.error(
      `Filtered tools (${filteredToolsLength}) > ${dynamicToolLoadingThreshold} - Using resource based tool system`
    );

    const filteredToolsResources = this.filteredResources(filteredTools);

    const {listAvailableTools, injectTools, executeTool} =
      contextToToolsResourceBasedToolSystem(filteredToolsResources);

    this.registerSingleTool(listAvailableTools);
    this.registerInjectToolsTool(injectTools, filteredTools);
    this.registerExecuteTool(executeTool);

    // Bulk tool is not a resource based tool, so we need to register it separately
    contextToBulkTools(context).forEach((tool) => {
      this.registerSingleTool(tool);
    });
  }

  private filteredResources(filteredTools: Tool[]): string[] {
    const actionResources = filteredTools
      .map((tool) => Object.keys(tool.actions)[0])
      .filter(Boolean);

    return Array.from(new Set(actionResources));
  }

  private registerSingleTool(tool: Tool): void {
    const {method, execute} = tool;
    this.tool(
      tool.method,
      tool.description,
      tool.parameters.shape,
      async (args: Record<string, unknown>) => {
        const result = await this.commercetoolsAPI.run(method, args, execute);
        return this.createToolResponse(
          transformToolOutput({
            data: result,
            title: `${tool.method} result`,
            format: this.configuration.context?.toolOutputFormat,
          })
        );
      }
    );
  }

  private registerInjectToolsTool(
    injectTools: Tool,
    filteredTools: Tool[]
  ): void {
    type ToolShape = z.infer<typeof injectTools.parameters.shape>;

    this.tool(
      injectTools.method,
      injectTools.description,
      injectTools.parameters.shape,
      async (arg: ToolShape) => {
        const toolsToInject = filteredTools.filter((tool) =>
          arg.toolMethods.includes(tool.method)
        );

        toolsToInject.forEach((tool) => {
          this.registerSingleTool(tool);
        });

        const injectedTools = this.formatInjectedTools(toolsToInject);

        // eslint-disable-next-line no-return-await -- #tool method signature requires
        return await this.createToolResponse(
          `Relevant tools:\n${injectedTools}`
        );
      }
    );
  }

  private registerExecuteTool(executeTool: Tool): void {
    type ToolShape = z.infer<typeof executeTool.parameters.shape>;

    this.tool(
      executeTool.method,
      executeTool.description,
      executeTool.parameters.shape,
      async (args: ToolShape) => {
        try {
          const result = await this.commercetoolsAPI.run(
            args.toolMethod,
            args.arguments || {}
          );

          return this.createToolResponse(
            transformToolOutput({
              data: result,
              title: `${args.toolMethod} result`,
              format: this.configuration.context?.toolOutputFormat,
            })
          );
        } catch (error) {
          return this.handleToolExecutionError(error, args.toolMethod);
        }
      }
    );
  }

  private createToolResponse(result: string): {
    content: Array<{type: 'text'; text: string}>;
  } {
    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  private formatInjectedTools(toolsToInject: Tool[]): string {
    return toolsToInject
      .map((tool) =>
        [
          `name: ${tool.name}`,
          `description: ${tool.description}`,
          `parameters: ${JSON.stringify(tool.parameters.shape, null, 2)}`,
        ].join('\n')
      )
      .join('\n---\n');
  }

  private handleToolExecutionError(error: unknown, toolMethod: string) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorBody =
      error instanceof Error && 'body' in error
        ? JSON.stringify(error.body, null, 2)
        : String(error);

    console.error('Error executing tool', {
      toolMethod,
      errorMessage,
      errorBody,
    });

    return this.createToolResponse(
      `Error executing tool '${toolMethod}': ${errorMessage} - ${errorBody}`
    );
  }
}

export default CommercetoolsAgentEssentials;

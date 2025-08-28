import z from 'zod';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration, Context} from '../types/configuration';
import {AuthConfig} from '../types/auth';
import {contextToToolsResourceBasedToolSystem} from '../shared/resource-based-tools-system/tools';
import {Tool} from '../types/tools';
import {contextToBulkTools} from '../shared/bulk/tools';
import {DYNAMIC_TOOL_LOADING_THRESHOLD} from '../shared/constants';

class CommercetoolsAgentEssentials extends McpServer {
  private _commercetools: CommercetoolsAPI;
  private _processedConfiguration: Configuration;

  constructor({
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

    this._processedConfiguration = processConfigurationDefaults(configuration);
    this._commercetools = new CommercetoolsAPI(
      authConfig,
      this._processedConfiguration.context
    );

    this.initializeTools(this._processedConfiguration.context);
  }

  private initializeTools(context?: Context): void {
    const filteredTools = this.getFilteredTools();
    const filteredToolsLength = filteredTools.length;
    const dynamicToolLoadingThreshold =
      context?.dynamicToolLoadingThreshold ?? DYNAMIC_TOOL_LOADING_THRESHOLD;
    const shouldReturnAllTools =
      filteredTools.length <= dynamicToolLoadingThreshold;

    if (shouldReturnAllTools) {
      this.registerAllTools(filteredTools);
    } else {
      console.error(
        `Filtered tools (${filteredToolsLength}) > ${DYNAMIC_TOOL_LOADING_THRESHOLD} - Using resource based tool system`
      );

      this.registerResourceBasedToolSystem(filteredTools);
    }
  }

  private getFilteredTools() {
    return contextToTools(this._processedConfiguration.context).filter((tool) =>
      isToolAllowed(tool, this._processedConfiguration)
    );
  }

  private registerAllTools(filteredTools: Tool[]): void {
    filteredTools.forEach((tool) => {
      this.registerSingleTool(tool);
    });
  }

  private registerResourceBasedToolSystem(filteredTools: Tool[]): void {
    const filteredToolsResources = this.filteredResources(filteredTools);

    const {listAvailableTools, injectTools, executeTool} =
      contextToToolsResourceBasedToolSystem(filteredToolsResources);

    this.registerSingleTool(listAvailableTools);
    this.registerInjectToolsTool(injectTools, filteredTools);
    this.registerExecuteTool(executeTool);
    // Bulk tool is not a resource based tool, so we need to register it separately
    contextToBulkTools(this._processedConfiguration.context).forEach((tool) => {
      this.registerSingleTool(tool);
    });
  }

  private filteredResources(filteredTools: Tool[]): string[] {
    return filteredTools
      .map((tool) => Object.keys(tool.actions)[0])
      .filter(Boolean)
      .map((resourceName) => {
        return resourceName.replace(/-([a-z])/g, (_, char) =>
          char.toUpperCase()
        );
      });
  }

  private registerSingleTool(tool: Tool): void {
    this.tool(
      tool.method,
      tool.description,
      tool.parameters.shape,
      async (args: Record<string, unknown>) => {
        const result = await this._commercetools.run(tool.method, args);
        return this.createToolResponse(result);
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

        const injectedTools = await this.formatInjectedTools(toolsToInject);

        return this.createToolResponse(`Relevant tools:\n${injectedTools}`);
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
          const result = await this._commercetools.run(
            args.toolMethod,
            args.arguments || {}
          );

          return this.createToolResponse(result);
        } catch (error) {
          return this.handleToolExecutionError(error, args.toolMethod);
        }
      }
    );
  }

  private createToolResponse(result: unknown) {
    return {
      content: [
        {
          type: 'text' as const,
          text: String(result),
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

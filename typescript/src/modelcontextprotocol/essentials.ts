import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';
import { AuthConfig } from '../types/auth';
import { contextToToolsHierarchyTools } from '../shared/tools-hierarchy/tools';

class CommercetoolsAgentEssentials extends McpServer {
  private _commercetools: CommercetoolsAPI;

  constructor({
    authConfig,
    configuration,
  }: {
    authConfig: AuthConfig;
    configuration: Configuration;
  }) {
    super(
      {
        name: 'Commercetools',
        version: '0.4.0',
      },
      {
        capabilities: {
          tools: {
            listChanged: true,
          },
        },
      }
    );

    // Process configuration to apply smart defaults
    const processedConfiguration = processConfigurationDefaults(configuration);

    this._commercetools = new CommercetoolsAPI(
      authConfig,
      processedConfiguration.context
    );

    const filteredTools = contextToTools(processedConfiguration.context).filter(
      (tool) => isToolAllowed(tool, processedConfiguration)
    );

    const returnAllTools =
      filteredTools.length <= (processedConfiguration.maxTools ?? 2);
    if (returnAllTools) {
      filteredTools.forEach((tool) => {
        this.tool(
          tool.method,
          tool.description,
          tool.parameters.shape,
          async (arg: any) => {
            const result = await this._commercetools.run(tool.method, arg);
            return {
              content: [
                {
                  type: 'text' as const,
                  text: String(result),
                },
              ],
            };
          }
        );
      });
      return;
    }

    const { listAvailableTools, injectTools } = contextToToolsHierarchyTools();

    this.tool(
      listAvailableTools.method,
      listAvailableTools.description,
      listAvailableTools.parameters.shape,
      async (arg: any) => {
        const result = await this._commercetools.run(
          listAvailableTools.method,
          arg
        );
        return {
          content: [
            {
              type: 'text' as const,
              text: String(result),
            },
          ],
        };
      }
    );

    this.tool(
      injectTools.method,
      injectTools.description,
      injectTools.parameters.shape,
      async (arg: any) => {
        const toolsToInject = filteredTools.filter((tool) =>
          arg.toolMethods.includes(tool.method)
        );

        toolsToInject.forEach((tool) => {
          this.tool(
            tool.method,
            tool.description,
            tool.parameters.shape,
            async (arg: any) => {
              const result = await this._commercetools.run(tool.method, arg);
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: String(result),
                  },
                ],
              };
            }
          );
        });

        this.sendToolListChanged();
        await new Promise((resolve) => setTimeout(resolve, 500));
        const injectedToolMethods = toolsToInject
          .map((tool) => tool.method)
          .join(', ');

        // force the MCP client to retry user's request
        throw new Error(`TOOLS_INJECTED: ${injectedToolMethods}`);
      }
    );
  }
}

export default CommercetoolsAgentEssentials;

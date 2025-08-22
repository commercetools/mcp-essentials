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
import z from 'zod';

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

    const { listAvailableTools, injectTools, executeTool } =
      contextToToolsHierarchyTools();

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

        const injectedTools = toolsToInject.map((tool) => ([
          `name: ${tool.name}`,
          `description: ${tool.description}`,
          `parameters: ${JSON.stringify(tool.parameters.shape, null, 2)}`,
        ]).join('\n')).join('\n---\n');

        return {
          content: [
            {
              type: 'text' as const,
              text: `Relevant tools:\n${injectedTools}`,
            },
          ],
        };
      }
    );

    this.tool(
      executeTool.method,
      executeTool.description,
      executeTool.parameters.shape,
      async (args: any) => {
        try {
          const result = await this._commercetools.run(
            args.toolMethod,
            args.arguments || {}
          );

          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        } catch (error) {
          console.error(error);
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          const errorBody =
            error instanceof Error && 'body' in error
              ? JSON.stringify(error.body, null, 2)
              : String(error);

          console.error('Error executing tool', {
            toolMethod: args.toolMethod,
            errorMessage,
            errorBody,
          });

          return {
            content: [
              {
                type: 'text' as const,
                text: `Error executing tool '${args.toolMethod}': ${errorMessage} - ${errorBody}`,
              },
            ],
          };
        }
      }
    );
  }
}

export default CommercetoolsAgentEssentials;

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';

class CommercetoolsAgentEssentials extends McpServer {
  private _commercetools: CommercetoolsAPI;
  private processedConfiguration: Configuration;

  constructor({
    clientId,
    clientSecret,
    authUrl,
    projectKey,
    apiUrl,
    configuration,
  }: {
    clientId: string;
    clientSecret: string;
    authUrl: string;
    projectKey: string;
    apiUrl: string;
    configuration: Configuration;
  }) {
    super({
      name: 'Commercetools',
      version: '0.4.0',
    }, {
      capabilities: {
        tools: {
          listChanged: true,
        },
      },
    });

    // Process configuration to apply smart defaults
    this.processedConfiguration = processConfigurationDefaults(configuration);

    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      this.processedConfiguration.context
    );

    this.tool(
      'list_available_tools',
      'Lists all available tools that can be injected for use.',
      {
        registered_tools: z.array(z.string()).optional().describe('A list of tool names that are already registered.'),
      },
      async ({ registered_tools }) => {
        const availableTools = contextToTools(this.processedConfiguration.context)
          .filter((tool) => isToolAllowed(tool, this.processedConfiguration))
          .map((tool) => tool.method);

        const registeredTools = registered_tools || [];
        const toolsMessage = JSON.stringify({
          available: availableTools.filter(t => !registeredTools.includes(t)),
          registered: registeredTools,
        });


        return {
          content: [
            {
              type: 'text',
              text: `Found ${availableTools.length} available tools. ${registeredTools.length} are already registered.\n\n${toolsMessage}`
            }
          ]
        };
      }
    );

    this.tool(
      'inject_tools',
      'Injects a list of tools to make them available to the user.',
      {
        tools: z.array(z.string()).describe('An array of tool names to inject.'),
      },
      async ({ tools }) => {
        const results = tools.map(toolName => {
          const success = this.registerToolIfNeeded(toolName);
          return {
            tool: toolName,
            injected: success,
            status: success ? 'Successfully injected' : 'Failed to inject',
          };
        });

        const toolsMessage = JSON.stringify(results);

        this.sendToolListChanged();

        return {
          content: [
            {
              type: 'text',
              text: `Processed ${tools.length} tools for injection.\n\n${toolsMessage}`,
            },
          ],
        };
      }
    );
  }

  private registerToolIfNeeded(toolName: string): boolean {
    console.error(`Registering tool: ${toolName}`);
    const allTools = contextToTools(this.processedConfiguration.context);
    const tool = allTools.find((t: any) => t.method === toolName);

    if (!tool || !isToolAllowed(tool, this.processedConfiguration)) {
      return false;
    }

    // try to register the tool, if already registered, return true
    try {

      // Register the tool dynamically (no need to check if already registered)
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
    } catch (error) {
      if (error instanceof Error && error.message.includes("already registered")) {
        return true;
      }
      console.error(`Error registering tool: ${toolName}`, error);
      return false;
    }

    return true;
  }
}

export default CommercetoolsAgentEssentials;

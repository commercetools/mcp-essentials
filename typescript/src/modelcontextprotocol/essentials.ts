import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
import {Tool} from 'ai';
import CommercetoolsTool from '../ai-sdk/tool';
import {Tool as U} from '../types/tools';

type Nullable<T> = T;

class CommercetoolsAgentEssentials extends McpServer {
  private clientId: Nullable<string>;
  private clientSecret: Nullable<string>;
  private authUrl: Nullable<string>;
  private projectKey: Nullable<string>;
  private apiUrl: Nullable<string>;
  private configuration: Configuration;
  private tools: Record<string, Tool> = {};

  private _commercetools!: CommercetoolsAPI;

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
    });

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authUrl = authUrl;
    this.projectKey = projectKey;
    this.apiUrl = apiUrl;
    this.configuration = configuration;

    // initialize
    this.init();
  }

  getTools(): {[key: string]: Tool} {
    return this.tools;
  }

  // setTools(tools: {[key: string]: Tool}) {
  //   this.tools = {
  //     ...this.tools,
  //     ...tools,
  //   };

  //   // re-initialize
  //   this.init();
  // }

  private init() {
    // Process configuration to apply smart defaults
    const processedConfiguration = processConfigurationDefaults(
      this.configuration
    );

    this._commercetools = new CommercetoolsAPI(
      this.clientId,
      this.clientSecret,
      this.authUrl,
      this.projectKey,
      this.apiUrl,
      processedConfiguration.context
    );

    const filteredTools = contextToTools(processedConfiguration.context).filter(
      (tool) => isToolAllowed(tool, processedConfiguration)
    );

    // validate and decorate the custom tools here
    [...(this.configuration.tools ?? []), ...filteredTools].forEach((tool) => {
      this.registerTools(tool);
      const {method, execute} = tool;
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any) => {
          const result = await this._commercetools.run(method, arg, execute);
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
  }

  private registerTools<T extends U>(tool: T) {
    this.tools[tool.method] = CommercetoolsTool(
      this._commercetools,
      tool.method,
      tool.description!,
      tool.parameters
    );
  }
}

export default CommercetoolsAgentEssentials;

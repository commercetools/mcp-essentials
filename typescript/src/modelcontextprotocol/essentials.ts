import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
import {scopesToActions} from '../utils/scopes';
import {AuthConfig} from '../types/auth';

class CommercetoolsAgentEssentials extends McpServer {
  private authConfig: AuthConfig;
  private configuration: Configuration;
  private filteredConfig: Configuration = {};

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
    this.configuration = configuration;
  }

  private async init() {
    // Process configuration to apply smart defaults
    let processedConfiguration = processConfigurationDefaults(
      this.configuration
    );

    const _commercetools = new CommercetoolsAPI(
      this.authConfig,
      processedConfiguration.context
    );

    // list of scopes' permissions ['view_cart', 'manage_products', '...']
    const scopes = await _commercetools.introspect();

    // scope based filtering
    const filteredActions = scopesToActions(scopes, processedConfiguration);

    processedConfiguration = {
      ...processedConfiguration,
      actions: {
        ...filteredActions,
      },
    };

    // merge the actions here
    const filteredTools = contextToTools(processedConfiguration.context).filter(
      (tool) => isToolAllowed(tool, processedConfiguration)
    );

    this.setConfig(processedConfiguration);
    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any) => {
          const result = await _commercetools.run(tool.method, arg);
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

  getConfig(): Configuration {
    return this.filteredConfig;
  }

  setConfig(config: Configuration): void {
    this.filteredConfig = config;
  }
}

export default CommercetoolsAgentEssentials;

import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
import {AuthConfig} from '../types/auth';
import {scopesToActions} from '../utils/scopes';

class CommercetoolsAgentEssentials extends McpServer {
  private authConfig: AuthConfig;
  private configuration: Configuration;
  private filteredConfig: Configuration = {};

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

    this.authConfig = authConfig;
    this.configuration = configuration;
    this.init().catch((err) => {
      console.error(err);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
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

  getConfig(): Configuration {
    return this.filteredConfig;
  }

  setConfig(config: Configuration): void {
    this.filteredConfig = config;
  }
}

export default CommercetoolsAgentEssentials;

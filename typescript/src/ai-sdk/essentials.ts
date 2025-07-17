import type {Tool} from 'ai';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import {contextToTools} from '../shared/tools';
import type {Configuration} from '../types/configuration';
import {AuthConfig} from '../types/auth';
import CommercetoolsTool from './tool';

class CommercetoolsAgentEssentials {
  private _commercetools: CommercetoolsAPI;
  tools: {[key: string]: Tool};

  constructor({
    authConfig,
    configuration,
  }: {
    authConfig: AuthConfig;
    configuration: Configuration;
  }) {
    // Process configuration to apply smart defaults
    const processedConfiguration = processConfigurationDefaults(configuration);

    this._commercetools = new CommercetoolsAPI(
      authConfig,
      processedConfiguration.context
    );
    this.tools = {};

    const filteredTools = contextToTools(processedConfiguration.context).filter(
      (tool) => isToolAllowed(tool, processedConfiguration)
    );

    filteredTools.forEach((tool) => {
      this.tools[tool.method] = CommercetoolsTool(
        this._commercetools,
        tool.method,
        tool.description,
        tool.parameters
      );
    });
  }

  getTools(): {[key: string]: Tool} {
    return this.tools;
  }
}

export default CommercetoolsAgentEssentials;

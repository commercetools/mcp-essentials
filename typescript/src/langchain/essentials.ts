import {BaseToolkit, DynamicStructuredTool} from '@langchain/core/tools';
import CommercetoolsTool from './tool';
import CommercetoolsAPI from '../shared/api';
import {contextToTools} from '../shared/tools';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import type {Configuration} from '../types/configuration';
import {z} from 'zod';

interface ToolDefinition {
  method: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  name: string;
  actions: any;
}

class CommercetoolsAgentEssentials implements BaseToolkit {
  private _commercetools: CommercetoolsAPI;

  tools: DynamicStructuredTool[];

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
    // Process configuration to apply smart defaults
    const processedConfiguration = processConfigurationDefaults(configuration);

    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      processedConfiguration.context
    );

    const filteredToolDefinitions = contextToTools(
      processedConfiguration.context
    ).filter((tool: ToolDefinition) =>
      isToolAllowed(tool, processedConfiguration)
    );

    this.tools = filteredToolDefinitions.map((toolDef: ToolDefinition) =>
      CommercetoolsTool(
        this._commercetools,
        toolDef.method,
        toolDef.description,
        toolDef.parameters
      )
    );
  }

  getTools(): DynamicStructuredTool[] {
    return this.tools;
  }
}

export default CommercetoolsAgentEssentials;

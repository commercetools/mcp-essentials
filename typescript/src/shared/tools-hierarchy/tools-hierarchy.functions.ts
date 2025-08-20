import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {
  listAvailableToolsParameters,
  injectToolsParameters,
} from './parameters';
import {contextToResourceTools, contextToTools} from '../tools';
import {ApiRoot} from '@commercetools/platform-sdk';

// Helper function to verify that a customer can read their own profile
export const listAvailableTools = async (
  _apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof listAvailableToolsParameters>
) => {
  const toolsHierarchy = contextToResourceTools(context);
  const availableTools = toolsHierarchy[params.resourceType];
  const bulkTools = params.isBulk ? toolsHierarchy.bulk : [];
  const tools = [...availableTools, ...bulkTools];

  // eslint-disable-next-line no-return-await
  return await tools.map((tool) => {
    return {
      method: tool.method,
      name: tool.name,
      description: tool.description,
    };
  });
};

export const injectTools = async (
  _apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof injectToolsParameters>
) => {
  const allTools = contextToTools(context);
  const toolsToInject = allTools.filter((tool) =>
    params.toolMethods.includes(tool.method)
  );

  // eslint-disable-next-line no-return-await
  return await toolsToInject.map((tool) => {
    return {
      method: tool.method,
      name: tool.name,
      description: tool.description,
    };
  });
};

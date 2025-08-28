import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {
  listAvailableToolsParameters,
  injectToolsParameters,
  executeToolParameters,
} from './parameters';
import {contextToResourceTools, contextToTools} from '../tools';
import {ApiRoot} from '@commercetools/platform-sdk';

export const listAvailableTools = async (
  _apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<ReturnType<typeof listAvailableToolsParameters>>
) => {
  const resourceBasedTools = contextToResourceTools(context);
  const resourceType = params.resourceType as keyof typeof resourceBasedTools;

  const availableTools = resourceBasedTools[resourceType];
  // eslint-disable-next-line no-return-await
  return await availableTools.map((tool) => {
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

export const executeTool = async (
  _apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof executeToolParameters>
) => {
  const allTools = contextToTools(context);
  const tool = await allTools.find((tool) => tool.method === params.toolMethod);
  if (!tool) {
    throw new Error(`Tool ${params.toolMethod} not found`);
  }

  return tool;
};

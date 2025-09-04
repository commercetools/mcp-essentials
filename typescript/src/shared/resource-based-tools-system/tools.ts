import {
  listAvailableToolsPrompt,
  injectToolsPrompt,
  executeToolPrompt,
} from './prompts';

import {
  listAvailableToolsParameters,
  injectToolsParameters,
  executeToolParameters,
} from './parameters';
import {Tool} from '../../types/tools';

const getTools = (resources: string[]): Record<string, Tool> => {
  return {
    list_available_tools: {
      method: 'list_available_tools',
      name: 'List Available Tools',
      description: listAvailableToolsPrompt(resources),
      parameters: listAvailableToolsParameters(resources),
      actions: {},
    },
    inject_tools: {
      method: 'inject_tools',
      name: 'Inject Tools',
      description: injectToolsPrompt,
      parameters: injectToolsParameters,
      actions: {},
    },
    execute_tool: {
      method: 'execute_tool',
      name: 'Execute Tool',
      description: executeToolPrompt,
      parameters: executeToolParameters,
      actions: {},
    },
  };
};

export const contextToToolsResourceBasedToolSystem = (resources: string[]) => {
  const tools = getTools(resources);

  return {
    listAvailableTools: tools.list_available_tools,
    injectTools: tools.inject_tools,
    executeTool: tools.execute_tool,
  };
};

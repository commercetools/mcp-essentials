import {listAvailableToolsPrompt, injectToolsPrompt} from './prompts';

import {
  listAvailableToolsParameters,
  injectToolsParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  list_available_tools: {
    method: 'list_available_tools',
    name: 'List Available Tools',
    description: listAvailableToolsPrompt,
    parameters: listAvailableToolsParameters,
    actions: {},
  },
  inject_tools: {
    method: 'inject_tools',
    name: 'Inject Tools',
    description: injectToolsPrompt,
    parameters: injectToolsParameters,
    actions: {},
  },
};

export const contextToToolsHierarchyTools = () => {
  return {
    listAvailableTools: tools.list_available_tools,
    injectTools: tools.inject_tools,
  };
};

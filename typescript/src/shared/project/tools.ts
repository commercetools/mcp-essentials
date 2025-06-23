import {readProjectPrompt, updateProjectPrompt} from './prompts';
import {readProjectParameters, updateProjectParameters} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_project: {
    method: 'read_project',
    name: 'Read Project',
    description: readProjectPrompt,
    parameters: readProjectParameters,
    actions: {
      project: {
        read: true,
      },
    },
  },
  update_project: {
    method: 'update_project',
    name: 'Update Project',
    description: updateProjectPrompt,
    parameters: updateProjectParameters,
    actions: {
      project: {
        update: true,
      },
    },
  },
};

export const contextToProjectTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [tools.read_project, tools.update_project];
  }
  return [tools.read_project];
};

import {readProjectPrompt, updateProjectPrompt} from './prompts';
import {readProjectParameters, updateProjectParameters} from './parameters';
import {
  readProjectOutputSchema,
  updateProjectOutputSchema,
} from './output-schema';
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
    outputSchema: readProjectOutputSchema,
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
    outputSchema: updateProjectOutputSchema,
  },
};

export const contextToProjectTools = (context?: Context) => {
  return [tools.read_project, tools.update_project];
};

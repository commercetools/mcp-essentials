import {
  createCustomObjectParameters,
  readCustomObjectParameters,
  updateCustomObjectParameters,
} from './parameters';
import {
  readCustomObjectOutputSchema,
  createCustomObjectOutputSchema,
  updateCustomObjectOutputSchema,
} from './output-schema';
import {
  readCustomObjectPrompt,
  createCustomObjectPrompt,
  updateCustomObjectPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_custom_object: {
    name: 'Read Custom Object',
    method: 'read_custom_object',
    parameters: readCustomObjectParameters,
    description: readCustomObjectPrompt,
    actions: {
      'custom-objects': {
        read: true,
      },
    },
    outputSchema: readCustomObjectOutputSchema,
  },
  create_custom_object: {
    name: 'Create Custom Object',
    method: 'create_custom_object',
    parameters: createCustomObjectParameters,
    description: createCustomObjectPrompt,
    actions: {
      'custom-objects': {
        create: true,
      },
    },
    outputSchema: createCustomObjectOutputSchema,
  },
  update_custom_object: {
    name: 'Update Custom Object',
    method: 'update_custom_object',
    parameters: updateCustomObjectParameters,
    description: updateCustomObjectPrompt,
    actions: {
      'custom-objects': {
        update: true,
      },
    },
    outputSchema: updateCustomObjectOutputSchema,
  },
};

export const contextToCustomObjectTools = (context?: Context) => {
  return [
    tools.read_custom_object,
    tools.create_custom_object,
    tools.update_custom_object,
  ];
};

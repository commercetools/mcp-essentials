import {
  createCustomObjectParameters,
  readCustomObjectParameters,
  updateCustomObjectParameters,
} from './parameters';
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
  },
};

export const contextToCustomObjectTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_custom_object,
      tools.create_custom_object,
      tools.update_custom_object,
    ];
  }
  return [];
};

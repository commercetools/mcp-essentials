import {
  createTypeParameters,
  readTypeParameters,
  updateTypeParameters,
} from './parameters';
import {
  readTypePrompt,
  createTypePrompt,
  updateTypePrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_type: {
    name: 'Read Type',
    method: 'read_type',
    parameters: readTypeParameters,
    description: readTypePrompt,
    actions: {
      types: {
        read: true,
      },
    },
  },
  create_type: {
    name: 'Create Type',
    method: 'create_type',
    parameters: createTypeParameters,
    description: createTypePrompt,
    actions: {
      types: {
        create: true,
      },
    },
  },
  update_type: {
    name: 'Update Type',
    method: 'update_type',
    parameters: updateTypeParameters,
    description: updateTypePrompt,
    actions: {
      types: {
        update: true,
      },
    },
  },
};

export const contextToTypeTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_type,
      tools.create_type,
      tools.update_type,
    ];
  }
  return [];
};

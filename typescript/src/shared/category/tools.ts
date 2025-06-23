import {
  readCategoryPrompt,
  createCategoryPrompt,
  updateCategoryPrompt,
} from './prompts';

import {
  readCategoryParameters,
  createCategoryParameters,
  updateCategoryParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_category: {
    method: 'read_category',
    name: 'Read Category',
    description: readCategoryPrompt,
    parameters: readCategoryParameters,
    actions: {
      category: {
        read: true,
      },
    },
  },
  create_category: {
    method: 'create_category',
    name: 'Create Category',
    description: createCategoryPrompt,
    parameters: createCategoryParameters,
    actions: {
      category: {
        create: true,
      },
    },
  },
  update_category: {
    method: 'update_category',
    name: 'Update Category',
    description: updateCategoryPrompt,
    parameters: updateCategoryParameters,
    actions: {
      category: {
        update: true,
      },
    },
  },
};

export const contextToCategoryTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [tools.read_category, tools.create_category, tools.update_category];
  }
  return [tools.read_category];
};

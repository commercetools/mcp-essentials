import {
  createShoppingListParameters,
  readShoppingListParameters,
  updateShoppingListParameters,
} from './parameters';
import {
  readShoppingListPrompt,
  createShoppingListPrompt,
  updateShoppingListPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_shopping_list: {
    name: 'Read Shopping List',
    method: 'read_shopping_list',
    parameters: readShoppingListParameters,
    description: readShoppingListPrompt,
    actions: {
      'shopping-lists': {
        read: true,
      },
    },
  },
  create_shopping_list: {
    name: 'Create Shopping List',
    method: 'create_shopping_list',
    parameters: createShoppingListParameters,
    description: createShoppingListPrompt,
    actions: {
      'shopping-lists': {
        create: true,
      },
    },
  },
  update_shopping_list: {
    name: 'Update Shopping List',
    method: 'update_shopping_list',
    parameters: updateShoppingListParameters,
    description: updateShoppingListPrompt,
    actions: {
      'shopping-lists': {
        update: true,
      },
    },
  },
};

export const contextToShoppingListTools = (context?: Context) => {
  if (context?.customerId) {
    return [
      tools.read_shopping_list,
      tools.create_shopping_list,
      tools.update_shopping_list,
    ];
  }
  if (context?.storeKey) {
    return [
      tools.read_shopping_list,
      tools.create_shopping_list,
      tools.update_shopping_list,
    ];
  }
  if (context?.isAdmin) {
    return [
      tools.read_shopping_list,
      tools.create_shopping_list,
      tools.update_shopping_list,
    ];
  }
  return [];
};

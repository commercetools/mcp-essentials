import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import {
  readInventoryPrompt,
  createInventoryPrompt,
  updateInventoryPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_inventory: {
    name: 'Read Inventory',
    method: 'read_inventory',
    parameters: readInventoryParameters,
    description: readInventoryPrompt,
    actions: {
      inventory: {
        read: true,
      },
    },
  },
  create_inventory: {
    name: 'Create Inventory',
    method: 'create_inventory',
    parameters: createInventoryParameters,
    description: createInventoryPrompt,
    actions: {
      inventory: {
        create: true,
      },
    },
  },
  update_inventory: {
    name: 'Update Inventory',
    method: 'update_inventory',
    parameters: updateInventoryParameters,
    description: updateInventoryPrompt,
    actions: {
      inventory: {
        update: true,
      },
    },
  },
};

export const contextToInventoryTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_inventory,
      tools.create_inventory,
      tools.update_inventory,
    ];
  }
  return [];
};

import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import {
  readInventoryOutputSchema,
  createInventoryOutputSchema,
  updateInventoryOutputSchema,
} from './output-schema';
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
    outputSchema: readInventoryOutputSchema,
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
    outputSchema: createInventoryOutputSchema,
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
    outputSchema: updateInventoryOutputSchema,
  },
};

export const contextToInventoryTools = (context?: Context) => {
  return [tools.read_inventory, tools.create_inventory, tools.update_inventory];
};

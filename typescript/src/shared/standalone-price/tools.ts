import {
  readStandalonePricePrompt,
  createStandalonePricePrompt,
  updateStandalonePricePrompt,
} from './prompts';

import {
  readStandalonePriceParameters,
  createStandalonePriceParameters,
  updateStandalonePriceParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_standalone_price: {
    method: 'read_standalone_price',
    name: 'Read Standalone Price',
    description: readStandalonePricePrompt,
    parameters: readStandalonePriceParameters,
    actions: {
      'standalone-price': {
        read: true,
      },
    },
  },
  create_standalone_price: {
    method: 'create_standalone_price',
    name: 'Create Standalone Price',
    description: createStandalonePricePrompt,
    parameters: createStandalonePriceParameters,
    actions: {
      'standalone-price': {
        create: true,
      },
    },
  },
  update_standalone_price: {
    method: 'update_standalone_price',
    name: 'Update Standalone Price',
    description: updateStandalonePricePrompt,
    parameters: updateStandalonePriceParameters,
    actions: {
      'standalone-price': {
        update: true,
      },
    },
  },
};

export const contextToStandalonePriceTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_standalone_price,
      tools.create_standalone_price,
      tools.update_standalone_price,
    ];
  }
  return [];
};

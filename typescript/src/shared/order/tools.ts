import {readOrderPrompt, createOrderPrompt, updateOrderPrompt} from './prompts';

import {
  readOrderParameters,
  createOrderParameters,
  updateOrderParameters,
} from './parameters';
import {
  readOrderOutputSchema,
  createOrderOutputSchema,
  updateOrderOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_order: {
    method: 'read_order',
    name: 'Read Order',
    description: readOrderPrompt,
    parameters: readOrderParameters,
    actions: {
      order: {
        read: true,
      },
    },
    outputSchema: readOrderOutputSchema,
  },
  create_order: {
    method: 'create_order',
    name: 'Create Order',
    description: createOrderPrompt,
    parameters: createOrderParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      order: {
        create: true,
      },
    },
    outputSchema: createOrderOutputSchema,
  },
  update_order: {
    method: 'update_order',
    name: 'Update Order',
    description: updateOrderPrompt,
    parameters: updateOrderParameters,
    actions: {
      order: {
        update: true,
      },
    },
    outputSchema: updateOrderOutputSchema,
  },
};

export const contextToOrderTools = (context?: Context) => {
  if (context?.customerId && context?.businessUnitKey) {
    return [tools.read_order, tools.create_order, tools.update_order];
  }
  if (context?.customerId) {
    return [tools.read_order];
  }
  if (context?.storeKey) {
    return [tools.read_order, tools.create_order, tools.update_order];
  }
  return [tools.read_order, tools.create_order, tools.update_order];
};

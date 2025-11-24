import {
  readCartPrompt,
  createCartPrompt,
  replicateCartPrompt,
  updateCartPrompt,
} from './prompts';

import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_cart: {
    method: 'read_cart',
    name: 'Read Cart',
    description: readCartPrompt,
    parameters: readCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        read: true,
      },
    },
  },
  create_cart: {
    method: 'create_cart',
    name: 'Create Cart',
    description: createCartPrompt,
    parameters: createCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        create: true,
      },
    },
  },
  replicate_cart: {
    method: 'replicate_cart',
    name: 'Replicate Cart',
    description: replicateCartPrompt,
    parameters: replicateCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        create: true,
      },
    },
  },
  update_cart: {
    method: 'update_cart',
    name: 'Update Cart',
    description: updateCartPrompt,
    parameters: updateCartParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      cart: {
        update: true,
      },
    },
  },
};

export const contextToCartTools = (context?: Context) => {
  // Associate cart tools when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return [
      tools.read_cart,
      tools.create_cart,
      tools.update_cart,
      tools.replicate_cart,
    ];
  }
  if (context?.customerId) {
    return [
      tools.read_cart,
      tools.update_cart,
      tools.replicate_cart,
      tools.create_cart,
    ];
  }
  if (context?.storeKey) {
    return [
      tools.read_cart,
      tools.create_cart,
      tools.update_cart,
      tools.replicate_cart,
    ];
  }

  return [
    tools.read_cart,
    tools.create_cart,
    tools.replicate_cart,
    tools.update_cart,
  ];
};

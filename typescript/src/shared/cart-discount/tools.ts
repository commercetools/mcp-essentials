import {
  readCartDiscountPrompt,
  createCartDiscountPrompt,
  updateCartDiscountPrompt,
} from './prompts';

import {
  readCartDiscountParameters,
  createCartDiscountParameters,
  updateCartDiscountParameters,
} from './parameters';
import {
  readCartDiscountOutputSchema,
  createCartDiscountOutputSchema,
  updateCartDiscountOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_cart_discount: {
    method: 'read_cart_discount',
    name: 'Read Cart Discount',
    description: readCartDiscountPrompt,
    parameters: readCartDiscountParameters,
    actions: {
      'cart-discount': {
        read: true,
      },
    },
    outputSchema: readCartDiscountOutputSchema,
  },
  create_cart_discount: {
    method: 'create_cart_discount',
    name: 'Create Cart Discount',
    description: createCartDiscountPrompt,
    parameters: createCartDiscountParameters,
    actions: {
      'cart-discount': {
        create: true,
      },
    },
    outputSchema: createCartDiscountOutputSchema,
  },
  update_cart_discount: {
    method: 'update_cart_discount',
    name: 'Update Cart Discount',
    description: updateCartDiscountPrompt,
    parameters: updateCartDiscountParameters,
    actions: {
      'cart-discount': {
        update: true,
      },
    },
    outputSchema: updateCartDiscountOutputSchema,
  },
};

export const contextToCartDiscountTools = (context?: Context) => {
  return [
    tools.read_cart_discount,
    tools.create_cart_discount,
    tools.update_cart_discount,
  ];
};

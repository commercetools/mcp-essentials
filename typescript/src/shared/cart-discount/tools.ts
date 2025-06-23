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
  },
};

export const contextToCartDiscountTools = (context?: Context) => {
  if (context?.isAdmin || context?.storeKey) {
    return [
      tools.read_cart_discount,
      tools.create_cart_discount,
      tools.update_cart_discount,
    ];
  }
  return [];
};

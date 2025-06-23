import {
  readProductDiscountPrompt,
  createProductDiscountPrompt,
  updateProductDiscountPrompt,
} from './prompts';

import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_product_discount: {
    method: 'read_product_discount',
    name: 'Read Product Discount',
    description: readProductDiscountPrompt,
    parameters: readProductDiscountParameters,
    actions: {
      'product-discount': {
        read: true,
      },
    },
  },
  create_product_discount: {
    method: 'create_product_discount',
    name: 'Create Product Discount',
    description: createProductDiscountPrompt,
    parameters: createProductDiscountParameters,
    actions: {
      'product-discount': {
        create: true,
      },
    },
  },
  update_product_discount: {
    method: 'update_product_discount',
    name: 'Update Product Discount',
    description: updateProductDiscountPrompt,
    parameters: updateProductDiscountParameters,
    actions: {
      'product-discount': {
        update: true,
      },
    },
  },
};

export const contextToProductDiscountTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_product_discount,
      tools.create_product_discount,
      tools.update_product_discount,
    ];
  }
  return [];
};

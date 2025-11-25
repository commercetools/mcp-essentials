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
import {
  readProductDiscountOutputSchema,
  createProductDiscountOutputSchema,
  updateProductDiscountOutputSchema,
} from './output-schema';
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
    outputSchema: readProductDiscountOutputSchema,
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
    outputSchema: createProductDiscountOutputSchema,
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
    outputSchema: updateProductDiscountOutputSchema,
  },
};

export const contextToProductDiscountTools = (context?: Context) => {
  return [
    tools.read_product_discount,
    tools.create_product_discount,
    tools.update_product_discount,
  ];
};

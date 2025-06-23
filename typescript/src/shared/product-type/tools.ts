import {
  readProductTypePrompt,
  createProductTypePrompt,
  updateProductTypePrompt,
} from './prompts';

import {
  readProductTypeParameters,
  createProductTypeParameters,
  updateProductTypeParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_product_type: {
    method: 'read_product_type',
    name: 'Read Product Type',
    description: readProductTypePrompt,
    parameters: readProductTypeParameters,
    actions: {
      'product-type': {
        read: true,
      },
    },
  },
  create_product_type: {
    method: 'create_product_type',
    name: 'Create Product Type',
    description: createProductTypePrompt,
    parameters: createProductTypeParameters,
    actions: {
      'product-type': {
        create: true,
      },
    },
  },
  update_product_type: {
    method: 'update_product_type',
    name: 'Update Product Type',
    description: updateProductTypePrompt,
    parameters: updateProductTypeParameters,
    actions: {
      'product-type': {
        update: true,
      },
    },
  },
};

export const contextToProductTypeTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_product_type,
      tools.create_product_type,
      tools.update_product_type,
    ];
  }
  return [tools.read_product_type];
};

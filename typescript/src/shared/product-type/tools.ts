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
import {
  readProductTypeOutputSchema,
  createProductTypeOutputSchema,
  updateProductTypeOutputSchema,
} from './output-schema';
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
    outputSchema: readProductTypeOutputSchema,
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
    outputSchema: createProductTypeOutputSchema,
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
    outputSchema: updateProductTypeOutputSchema,
  },
};

export const contextToProductTypeTools = (context?: Context) => {
  return [
    tools.read_product_type,
    tools.create_product_type,
    tools.update_product_type,
  ];
};

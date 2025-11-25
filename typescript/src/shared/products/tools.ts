import {
  createProductPrompt,
  listProductsPrompt,
  updateProductPrompt,
} from './prompts';

import {
  createProductParameters,
  listProductsParameters,
  updateProductParameters,
} from './parameters';
import {
  listProductsOutputSchema,
  createProductOutputSchema,
  updateProductOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  list_products: {
    method: 'list_products',
    name: 'List Products',
    description: listProductsPrompt,
    parameters: listProductsParameters,
    actions: {
      products: {
        read: true,
      },
    },
    outputSchema: listProductsOutputSchema,
  },
  create_product: {
    method: 'create_product',
    name: 'Create Product',
    description: createProductPrompt,
    parameters: createProductParameters,
    actions: {
      products: {
        create: true,
      },
    },
    outputSchema: createProductOutputSchema,
  },
  update_product: {
    method: 'update_product',
    name: 'Update Product',
    description: updateProductPrompt,
    parameters: updateProductParameters,
    actions: {
      products: {
        update: true,
      },
    },
    outputSchema: updateProductOutputSchema,
  },
};

export const contextToProductsTools = (context?: Context) => {
  return [tools.list_products, tools.create_product, tools.update_product];
};

import {
  readProductSelectionPrompt,
  createProductSelectionPrompt,
  updateProductSelectionPrompt,
} from './prompts';

import {
  readProductSelectionParameters,
  createProductSelectionParameters,
  updateProductSelectionParameters,
} from './parameters';
import {
  readProductSelectionOutputSchema,
  createProductSelectionOutputSchema,
  updateProductSelectionOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_product_selection: {
    method: 'read_product_selection',
    name: 'Read Product Selection',
    description: readProductSelectionPrompt,
    parameters: readProductSelectionParameters,
    actions: {
      'product-selection': {
        read: true,
      },
    },
    outputSchema: readProductSelectionOutputSchema,
  },
  create_product_selection: {
    method: 'create_product_selection',
    name: 'Create Product Selection',
    description: createProductSelectionPrompt,
    parameters: createProductSelectionParameters,
    actions: {
      'product-selection': {
        create: true,
      },
    },
    outputSchema: createProductSelectionOutputSchema,
  },
  update_product_selection: {
    method: 'update_product_selection',
    name: 'Update Product Selection',
    description: updateProductSelectionPrompt,
    parameters: updateProductSelectionParameters,
    actions: {
      'product-selection': {
        update: true,
      },
    },
    outputSchema: updateProductSelectionOutputSchema,
  },
};

export const contextToProductSelectionTools = (context?: Context) => {
  return [
    tools.read_product_selection,
    tools.create_product_selection,
    tools.update_product_selection,
  ];
};

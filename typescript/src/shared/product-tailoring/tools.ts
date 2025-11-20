import {
  readProductTailoringParameters,
  createProductTailoringParameters,
  updateProductTailoringParameters,
} from './parameters';
import {
  readProductTailoringPrompt,
  createProductTailoringPrompt,
  updateProductTailoringPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

/**
 * Context-based tool mapping for product tailoring
 */
const tools: Record<string, Tool> = {
  read_product_tailoring: {
    name: 'Read product tailoring',
    method: 'read_product_tailoring',
    description: readProductTailoringPrompt,
    parameters: readProductTailoringParameters,
    actions: {
      'product-tailoring': {
        read: true,
      },
    },
  },
  create_product_tailoring: {
    name: 'Create product tailoring',
    method: 'create_product_tailoring',
    description: createProductTailoringPrompt,
    parameters: createProductTailoringParameters,
    actions: {
      'product-tailoring': {
        create: true,
      },
    },
  },
  update_product_tailoring: {
    name: 'Update product tailoring',
    method: 'update_product_tailoring',
    description: updateProductTailoringPrompt,
    parameters: updateProductTailoringParameters,
    actions: {
      'product-tailoring': {
        update: true,
      },
    },
  },
};

export const contextToProductTailoringTools = (context?: Context) => {
  return [
    tools.read_product_tailoring,
    tools.create_product_tailoring,
    tools.update_product_tailoring,
  ];
};

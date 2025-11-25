import {
  createTaxCategoryParameters,
  readTaxCategoryParameters,
  updateTaxCategoryParameters,
} from './parameters';
import {
  readTaxCategoryOutputSchema,
  createTaxCategoryOutputSchema,
  updateTaxCategoryOutputSchema,
} from './output-schema';
import {
  readTaxCategoryPrompt,
  createTaxCategoryPrompt,
  updateTaxCategoryPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_tax_category: {
    name: 'Read Tax Category',
    method: 'read_tax_category',
    parameters: readTaxCategoryParameters,
    description: readTaxCategoryPrompt,
    actions: {
      'tax-category': {
        read: true,
      },
    },
    outputSchema: readTaxCategoryOutputSchema,
  },
  create_tax_category: {
    name: 'Create Tax Category',
    method: 'create_tax_category',
    parameters: createTaxCategoryParameters,
    description: createTaxCategoryPrompt,
    actions: {
      'tax-category': {
        create: true,
      },
    },
    outputSchema: createTaxCategoryOutputSchema,
  },
  update_tax_category: {
    name: 'Update Tax Category',
    method: 'update_tax_category',
    parameters: updateTaxCategoryParameters,
    description: updateTaxCategoryPrompt,
    actions: {
      'tax-category': {
        update: true,
      },
    },
    outputSchema: updateTaxCategoryOutputSchema,
  },
};

export const contextToTaxCategoryTools = (context?: Context) => {
  return [
    tools.read_tax_category,
    tools.create_tax_category,
    tools.update_tax_category,
  ];
};

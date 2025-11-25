import {
  readDiscountCodePrompt,
  createDiscountCodePrompt,
  updateDiscountCodePrompt,
} from './prompts';

import {
  readDiscountCodeParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {
  readDiscountCodeOutputSchema,
  createDiscountCodeOutputSchema,
  updateDiscountCodeOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_discount_code: {
    method: 'read_discount_code',
    name: 'Read Discount Code',
    description: readDiscountCodePrompt,
    parameters: readDiscountCodeParameters,
    actions: {
      'discount-code': {
        read: true,
      },
    },
    outputSchema: readDiscountCodeOutputSchema,
  },
  create_discount_code: {
    method: 'create_discount_code',
    name: 'Create Discount Code',
    description: createDiscountCodePrompt,
    parameters: createDiscountCodeParameters,
    actions: {
      'discount-code': {
        create: true,
      },
    },
    outputSchema: createDiscountCodeOutputSchema,
  },
  update_discount_code: {
    method: 'update_discount_code',
    name: 'Update Discount Code',
    description: updateDiscountCodePrompt,
    parameters: updateDiscountCodeParameters,
    actions: {
      'discount-code': {
        update: true,
      },
    },
    outputSchema: updateDiscountCodeOutputSchema,
  },
};

export const contextToDiscountCodeTools = (context?: Context) => {
  return [
    tools.read_discount_code,
    tools.create_discount_code,
    tools.update_discount_code,
  ];
};

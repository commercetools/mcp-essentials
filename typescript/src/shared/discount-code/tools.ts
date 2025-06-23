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
  },
};

export const contextToDiscountCodeTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_discount_code,
      tools.create_discount_code,
      tools.update_discount_code,
    ];
  }
  return [];
};

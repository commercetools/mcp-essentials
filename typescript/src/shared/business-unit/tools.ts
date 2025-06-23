import {
  readBusinessUnitPrompt,
  createBusinessUnitPrompt,
  updateBusinessUnitPrompt,
} from './prompts';

import {
  readBusinessUnitParameters,
  createBusinessUnitParameters,
  updateBusinessUnitParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_business_unit: {
    method: 'read_business_unit',
    name: 'Read Business Unit',
    description: readBusinessUnitPrompt,
    parameters: readBusinessUnitParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'business-unit': {
        read: true,
      },
    },
  },
  create_business_unit: {
    method: 'create_business_unit',
    name: 'Create Business Unit',
    description: createBusinessUnitPrompt,
    parameters: createBusinessUnitParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'business-unit': {
        create: true,
      },
    },
  },
  update_business_unit: {
    method: 'update_business_unit',
    name: 'Update Business Unit',
    description: updateBusinessUnitPrompt,
    parameters: updateBusinessUnitParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'business-unit': {
        update: true,
      },
    },
  },
};

export const contextToBusinessUnitTools = (context?: Context) => {
  if (context?.storeKey) {
    return [
      tools.read_business_unit,
      tools.create_business_unit,
      tools.update_business_unit,
    ];
  }
  if (context?.isAdmin) {
    return [
      tools.read_business_unit,
      tools.create_business_unit,
      tools.update_business_unit,
    ];
  }
  return [];
};

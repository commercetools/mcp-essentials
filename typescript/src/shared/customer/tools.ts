import {
  createCustomerPrompt,
  readCustomerPrompt,
  updateCustomerPrompt,
} from './prompts';

import {
  createCustomerParameters,
  readCustomerParameters,
  updateCustomerParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  create_customer: {
    method: 'create_customer',
    name: 'Create Customer',
    description: createCustomerPrompt,
    parameters: createCustomerParameters,
    actions: {
      customer: {
        create: true,
      },
    },
  },
  read_customer: {
    method: 'read_customer',
    name: 'Read Customer',
    description: readCustomerPrompt,
    parameters: readCustomerParameters,
    actions: {
      customer: {
        read: true,
      },
    },
  },
  update_customer: {
    method: 'update_customer',
    name: 'Update Customer',
    description: updateCustomerPrompt,
    parameters: updateCustomerParameters,
    actions: {
      customer: {
        update: true,
      },
    },
  },
};

export const contextToCustomerTools = (context?: Context) => {
  if (context?.customerId) {
    return [tools.read_customer];
  }
  if (context?.isAdmin) {
    return [tools.create_customer, tools.read_customer, tools.update_customer];
  }
  if (context?.storeKey) {
    return [tools.create_customer, tools.read_customer];
  }
  return [];
};

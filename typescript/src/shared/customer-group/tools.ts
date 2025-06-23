import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

import {
  CREATE_CUSTOMER_GROUP_PROMPT,
  READ_CUSTOMER_GROUP_PROMPT,
  UPDATE_CUSTOMER_GROUP_PROMPT,
} from './prompts';
import {
  createCustomerGroupParametersSchema,
  readCustomerGroupParameters,
  updateCustomerGroupParameters,
} from './parameters';

const tools: Record<string, Tool> = {
  read_customer_group: {
    method: 'read_customer_group',
    name: 'Read Customer Group',
    description: READ_CUSTOMER_GROUP_PROMPT,
    parameters: readCustomerGroupParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        read: true,
      },
    },
  },
  create_customer_group: {
    method: 'create_customer_group',
    name: 'Create Customer Group',
    description: CREATE_CUSTOMER_GROUP_PROMPT,
    parameters: createCustomerGroupParametersSchema as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        create: true,
      },
    },
  },
  update_customer_group: {
    method: 'update_customer_group',
    name: 'Update Customer Group',
    description: UPDATE_CUSTOMER_GROUP_PROMPT,
    parameters: updateCustomerGroupParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'customer-group': {
        update: true,
      },
    },
  },
};

export const contextToCustomerGroupTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_customer_group,
      tools.create_customer_group,
      tools.update_customer_group,
    ];
  }
  return [];
};

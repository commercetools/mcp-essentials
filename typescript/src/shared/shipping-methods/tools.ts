import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
} from './parameters';
import {
  readShippingMethodPrompt,
  createShippingMethodPrompt,
  updateShippingMethodPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_shipping_methods: {
    name: 'Read Shipping Method',
    method: 'read_shipping_methods',
    description: readShippingMethodPrompt,
    parameters: readShippingMethodParameters,
    actions: {
      'shipping-methods': {
        read: true,
      },
    },
  },
  create_shipping_methods: {
    name: 'Create Shipping Method',
    method: 'create_shipping_methods',
    description: createShippingMethodPrompt,
    parameters: createShippingMethodParameters,
    actions: {
      'shipping-methods': {
        create: true,
      },
    },
  },
  update_shipping_methods: {
    name: 'Update Shipping Method',
    method: 'update_shipping_methods',
    description: updateShippingMethodPrompt,
    parameters: updateShippingMethodParameters,
    actions: {
      'shipping-methods': {
        update: true,
      },
    },
  },
};

export const contextToShippingMethodTools = (context?: Context) => {
  if (context?.customerId) {
    return [tools.read_shipping_methods];
  }

  return [
    tools.read_shipping_methods,
    tools.create_shipping_methods,
    tools.update_shipping_methods,
  ];
};

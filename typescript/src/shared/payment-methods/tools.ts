import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';
import {
  readPaymentMethodParameters,
  createPaymentMethodParameters,
  updatePaymentMethodParameters,
} from './parameters';
import {
  readPaymentMethodPrompt,
  createPaymentMethodPrompt,
  updatePaymentMethodPrompt,
} from './prompts';

const tools: Record<string, Tool> = {
  read_payment_methods: {
    method: 'read_payment_methods',
    name: 'Read Payment Method',
    description: readPaymentMethodPrompt,
    parameters: readPaymentMethodParameters,
    actions: {
      'payment-methods': {
        read: true,
      },
    },
  },
  create_payment_methods: {
    method: 'create_payment_methods',
    name: 'Create Payment Method',
    description: createPaymentMethodPrompt,
    parameters: createPaymentMethodParameters,
    actions: {
      'payment-methods': {
        create: true,
      },
    },
  },
  update_payment_methods: {
    method: 'update_payment_methods',
    name: 'Update Payment Method',
    description: updatePaymentMethodPrompt,
    parameters: updatePaymentMethodParameters,
    actions: {
      'payment-methods': {
        update: true,
      },
    },
  },
};

export const contextToPaymentMethodTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_payment_methods,
      tools.create_payment_methods,
      tools.update_payment_methods,
    ];
  }
  return [];
};

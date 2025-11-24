import {
  readPaymentParameters,
  createPaymentParameters,
  updatePaymentParameters,
} from './parameters';
import {
  readPaymentPrompt,
  createPaymentPrompt,
  updatePaymentPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_payments: {
    name: 'Read Payment',
    method: 'read_payments',
    description: readPaymentPrompt,
    parameters: readPaymentParameters,
    actions: {
      payments: {
        read: true,
      },
    },
  },
  create_payments: {
    name: 'Create Payment',
    method: 'create_payments',
    description: createPaymentPrompt,
    parameters: createPaymentParameters,
    actions: {
      payments: {
        create: true,
      },
    },
  },
  update_payments: {
    name: 'Update Payment',
    method: 'update_payments',
    description: updatePaymentPrompt,
    parameters: updatePaymentParameters,
    actions: {
      payments: {
        update: true,
      },
    },
  },
};

export const contextToPaymentTools = (context?: Context) => {
  return [tools.read_payments, tools.create_payments, tools.update_payments];
};

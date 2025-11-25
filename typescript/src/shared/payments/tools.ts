import {
  readPaymentParameters,
  createPaymentParameters,
  updatePaymentParameters,
} from './parameters';
import {
  readPaymentsOutputSchema,
  createPaymentsOutputSchema,
  updatePaymentsOutputSchema,
} from './output-schema';
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
    outputSchema: readPaymentsOutputSchema,
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
    outputSchema: createPaymentsOutputSchema,
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
    outputSchema: updatePaymentsOutputSchema,
  },
};

export const contextToPaymentTools = (context?: Context) => {
  return [tools.read_payments, tools.create_payments, tools.update_payments];
};

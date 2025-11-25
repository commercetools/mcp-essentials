import {
  createRecurringOrderParameters,
  readRecurringOrderParameters,
  updateRecurringOrderParameters,
} from './parameters';
import {
  readRecurringOrdersOutputSchema,
  createRecurringOrdersOutputSchema,
  updateRecurringOrdersOutputSchema,
} from './output-schema';
import {
  readRecurringOrderPrompt,
  createRecurringOrderPrompt,
  updateRecurringOrderPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_recurring_orders: {
    name: 'Read Recurring Orders',
    method: 'read_recurring_orders',
    parameters: readRecurringOrderParameters,
    description: readRecurringOrderPrompt,
    actions: {
      'recurring-orders': {
        read: true,
      },
    },
    outputSchema: readRecurringOrdersOutputSchema,
  },
  create_recurring_orders: {
    name: 'Create Recurring Orders',
    method: 'create_recurring_orders',
    parameters: createRecurringOrderParameters,
    description: createRecurringOrderPrompt,
    actions: {
      'recurring-orders': {
        create: true,
      },
    },
    outputSchema: createRecurringOrdersOutputSchema,
  },
  update_recurring_orders: {
    name: 'Update Recurring Orders',
    method: 'update_recurring_orders',
    parameters: updateRecurringOrderParameters,
    description: updateRecurringOrderPrompt,
    actions: {
      'recurring-orders': {
        update: true,
      },
    },
    outputSchema: updateRecurringOrdersOutputSchema,
  },
};

export const contextToRecurringOrderTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_recurring_orders,
      tools.create_recurring_orders,
      tools.update_recurring_orders,
    ];
  }
  return [tools.read_recurring_orders];
};

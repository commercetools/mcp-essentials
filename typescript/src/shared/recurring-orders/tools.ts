import {
  createRecurringOrderParameters,
  readRecurringOrderParameters,
  updateRecurringOrderParameters,
} from './parameters';
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
  return [];
};

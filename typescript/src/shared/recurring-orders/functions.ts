import * as customer from './customer.functions';
import * as admin from './admin.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createRecurringOrderParameters,
  readRecurringOrderParameters,
  updateRecurringOrderParameters,
} from './parameters';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToRecurringOrderFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.customerId) {
    return {
      read_recurring_orders: customer.readCustomerRecurringOrder,
    };
  }
  if (context?.isAdmin) {
    return {
      read_recurring_orders: admin.readRecurringOrder,
      create_recurring_orders: admin.createRecurringOrder,
      update_recurring_orders: admin.updateRecurringOrder,
    };
  }

  return {};
};

/**
 * Reads recurring orders based on provided parameters:
 * - If 'id' is provided, retrieves a specific recurring order by ID
 * - If 'key' is provided, retrieves a specific recurring order by key
 * - If neither 'id' nor 'key' is provided, lists recurring orders with optional filtering
 */
export function readRecurringOrder(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readRecurringOrderParameters>
) {
  if (context?.customerId) {
    return customer.readCustomerRecurringOrder(apiRoot, context, params);
  }
  return admin.readRecurringOrder(apiRoot, context, params);
}

/**
 * Creates a new recurring order
 */
export function createRecurringOrder(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createRecurringOrderParameters>
) {
  return admin.createRecurringOrder(apiRoot, context, params);
}

/**
 * Updates a recurring order based on provided parameters:
 * - If 'id' is provided, updates the recurring order by ID
 * - If 'key' is provided, updates the recurring order by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateRecurringOrder(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateRecurringOrderParameters>
) {
  return admin.updateRecurringOrder(apiRoot, context, params);
}

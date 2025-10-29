import * as customer from './customer.functions';
import * as admin from './admin.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
} from './parameters';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToShippingMethodFunctionMapping = (
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
      read_shipping_methods: customer.readCustomerShippingMethod,
    };
  }
  if (context?.isAdmin) {
    return {
      read_shipping_methods: admin.readShippingMethod,
      create_shipping_methods: admin.createShippingMethod,
      update_shipping_methods: admin.updateShippingMethod,
    };
  } else if (context?.customerId) {
    return {
      read_shipping_methods: customer.readCustomerShippingMethod,
    };
  } else {
    return {};
  }
};

/**
 * Reads shipping methods based on provided parameters:
 * - If 'id' is provided, retrieves a specific shipping method by ID
 * - If 'key' is provided, retrieves a specific shipping method by key
 * - If neither 'id' nor 'key' is provided, lists shipping methods with optional filtering
 */
export function readShippingMethod(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readShippingMethodParameters>
) {
  if (context?.customerId) {
    return customer.readCustomerShippingMethod(apiRoot, context, params);
  }
  return admin.readShippingMethod(apiRoot, context, params);
}

/**
 * Creates a new shipping method
 */
export function createShippingMethod(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createShippingMethodParameters>
) {
  return admin.createShippingMethod(apiRoot, context, params);
}

/**
 * Updates a shipping method based on provided parameters:
 * - If 'id' is provided, updates the shipping method by ID
 * - If 'key' is provided, updates the shipping method by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateShippingMethod(
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateShippingMethodParameters>
) {
  return admin.updateShippingMethod(apiRoot, context, params);
}

import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToShippingMethodFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: z.infer<any>
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_shipping_methods: admin.readShippingMethod,
      create_shipping_methods: admin.createShippingMethod,
      update_shipping_methods: admin.updateShippingMethod,
    };
  }

  return {};
};

/**
 * Reads shipping methods based on provided parameters:
 * - If 'id' is provided, retrieves a specific shipping method by ID
 * - If 'key' is provided, retrieves a specific shipping method by key
 * - If neither 'id' nor 'key' is provided, lists shipping methods with optional filtering
 */
export function readShippingMethod(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readShippingMethodParameters>
) {
  return admin.readShippingMethod(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new shipping method
 */
export function createShippingMethod(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createShippingMethodParameters>
) {
  return admin.createShippingMethod(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates a shipping method based on provided parameters:
 * - If 'id' is provided, updates the shipping method by ID
 * - If 'key' is provided, updates the shipping method by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateShippingMethod(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateShippingMethodParameters>
) {
  return admin.updateShippingMethod(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

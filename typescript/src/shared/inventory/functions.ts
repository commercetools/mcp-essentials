import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToInventoryFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_inventory: admin.readInventory,
      create_inventory: admin.createInventory,
      update_inventory: admin.updateInventory,
    };
  }

  return {};
};

/**
 * Reads inventory entries based on provided parameters:
 * - If 'id' is provided, retrieves a specific inventory entry by ID
 * - If 'key' is provided, retrieves a specific inventory entry by key
 * - If neither 'id' nor 'key' is provided, lists inventory entries with optional filtering
 */
export function readInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readInventoryParameters>
) {
  return admin.readInventory(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new inventory entry
 */
export function createInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createInventoryParameters>
) {
  return admin.createInventory(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates or deletes an inventory entry based on provided parameters:
 * - If 'id' is provided, updates/deletes the inventory entry by ID
 * - If 'key' is provided, updates/deletes the inventory entry by key
 * - One of either 'id' or 'key' must be provided
 * - If an action with type 'delete' is included, the entry will be deleted
 */
export function updateInventory(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateInventoryParameters>
) {
  return admin.updateInventory(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

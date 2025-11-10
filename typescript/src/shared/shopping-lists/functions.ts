/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShoppingListParameters,
  readShoppingListParameters,
  updateShoppingListParameters,
} from './parameters';
import * as admin from './admin.functions';
import * as customer from './customer.functions';
import * as store from './store.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToShoppingListFunctionMapping = (
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
      read_shopping_list: customer.readShoppingList,
      create_shopping_list: customer.createShoppingList,
      update_shopping_list: customer.updateShoppingList,
    };
  }
  if (context?.storeKey) {
    return {
      read_shopping_list: store.readShoppingList,
      create_shopping_list: store.createShoppingList,
      update_shopping_list: store.updateShoppingList,
    };
  }
  if (context?.isAdmin) {
    return {
      read_shopping_list: admin.readShoppingList,
      create_shopping_list: admin.createShoppingList,
      update_shopping_list: admin.updateShoppingList,
    };
  }

  return {};
};

/**
 * Reads shopping lists based on provided parameters:
 * - If 'id' is provided, retrieves a specific shopping list by ID
 * - If 'key' is provided, retrieves a specific shopping list by key
 * - If neither is provided, lists shopping lists with optional filtering, sorting, and pagination
 */
export async function readShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShoppingListParameters>
) {
  return admin.readShoppingList(apiRoot, context, params);
}

/**
 * Creates a new shopping list in the commercetools platform
 */
export async function createShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createShoppingListParameters>
) {
  return admin.createShoppingList(apiRoot, context, params);
}

/**
 * Updates an existing shopping list in the commercetools platform
 */
export async function updateShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateShoppingListParameters>
) {
  return admin.updateShoppingList(apiRoot, context, params);
}

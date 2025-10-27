/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShoppingListParameters,
  readShoppingListParameters,
  updateShoppingListParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads shopping lists based on provided parameters (store-specific)
 */
export async function readShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const {id, key} = params;

    // Always use store-specific operations for store context
    if (id) {
      return await readShoppingListByIdInStore(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      return await readShoppingListByKeyInStore(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      return await queryShoppingListsInStore(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to read shopping list', error);
  }
}

/**
 * Lists shopping lists in store
 */
export function queryShoppingListsInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  return base.queryShoppingListsInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

/**
 * Reads a shopping list by ID in store
 */
export function readShoppingListByIdInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  return base.readShoppingListByIdInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

/**
 * Reads a shopping list by key in store
 */
export function readShoppingListByKeyInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  return base.readShoppingListByKeyInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

/**
 * Creates a new shopping list in store
 */
export async function createShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createShoppingListParameters>
) {
  try {
    if (!context.storeKey) {
      throw new Error('Store key is required for store-specific operations');
    }

    // Ensure store is set for store operations
    const storeParams = {
      ...params,
      store: params.store || {
        key: context.storeKey,
        typeId: 'store' as const,
      },
    };

    return await base.createShoppingListInStore(
      apiRoot,
      context.projectKey,
      context.storeKey,
      storeParams
    );
  } catch (error: any) {
    throw new SDKError('Failed to create shopping list', error);
  }
}

/**
 * Updates a shopping list based on provided parameters (store-specific)
 */
export async function updateShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (!context.storeKey) {
      throw new Error('Store key is required for store-specific operations');
    }

    if (id) {
      return await base.updateShoppingListByIdInStore(
        apiRoot,
        context.projectKey,
        context.storeKey,
        {
          id,
          version,
          actions,
        }
      );
    } else if (key) {
      return await base.updateShoppingListByKeyInStore(
        apiRoot,
        context.projectKey,
        context.storeKey,
        {
          key,
          version,
          actions,
        }
      );
    } else {
      throw new Error(
        'Either id or key must be provided for updating a shopping list'
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update shopping list', error);
  }
}

/**
 * Updates a shopping list by ID in store
 */
export async function updateShoppingListByIdInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  return base.updateShoppingListByIdInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

/**
 * Updates a shopping list by key in store
 */
export async function updateShoppingListByKeyInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  return base.updateShoppingListByKeyInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

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
 * Reads shopping lists based on provided parameters
 */
export async function readShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const {id, key, storeKey} = params;

    if (storeKey) {
      // Store-specific operations
      if (id) {
        return await base.readShoppingListByIdInStore(
          apiRoot,
          context.projectKey,
          storeKey,
          {
            id,
            expand: params.expand,
          }
        );
      } else if (key) {
        return await base.readShoppingListByKeyInStore(
          apiRoot,
          context.projectKey,
          storeKey,
          {
            key,
            expand: params.expand,
          }
        );
      } else {
        return await base.queryShoppingListsInStore(
          apiRoot,
          context.projectKey,
          storeKey,
          {
            limit: params.limit,
            offset: params.offset,
            sort: params.sort,
            where: params.where,
            expand: params.expand,
          }
        );
      }
    } else if (id) {
      return await base.readShoppingListById(apiRoot, context.projectKey, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      return await base.readShoppingListByKey(apiRoot, context.projectKey, {
        key,
        expand: params.expand,
      });
    } else {
      return await base.queryShoppingLists(apiRoot, context.projectKey, {
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
 * Reads a shopping list by ID
 */
export function readShoppingListById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readShoppingListById(apiRoot, context.projectKey, params);
}

/**
 * Reads a shopping list by key
 */
export function readShoppingListByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readShoppingListByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists shopping lists
 */
export function queryShoppingLists(
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
  return base.queryShoppingLists(apiRoot, context.projectKey, params);
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
 * Creates a new shopping list
 */
export async function createShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createShoppingListParameters>
) {
  try {
    if (params.storeKey || context.storeKey) {
      return await base.createShoppingListInStore(
        apiRoot,
        context.projectKey,
        params.storeKey || context.storeKey!,
        params
      );
    }
    return await base.createShoppingList(apiRoot, context.projectKey, params);
  } catch (error: any) {
    throw new SDKError('Failed to create shopping list', error);
  }
}

/**
 * Updates a shopping list based on provided parameters
 */
export async function updateShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const {id, key, version, actions, storeKey} = params;
    const targetStoreKey = storeKey || context.storeKey;

    if (targetStoreKey) {
      // Store-specific operations
      if (id) {
        return await base.updateShoppingListByIdInStore(
          apiRoot,
          context.projectKey,
          targetStoreKey,
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
          targetStoreKey,
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
    } else if (id) {
      return await base.updateShoppingListById(apiRoot, context.projectKey, {
        id,
        version,
        actions,
      });
    } else if (key) {
      return await base.updateShoppingListByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
      });
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
 * Updates a shopping list by ID
 */
export async function updateShoppingListById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateShoppingListById(apiRoot, context.projectKey, params);
}

/**
 * Updates a shopping list by key
 */
export async function updateShoppingListByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateShoppingListByKey(apiRoot, context.projectKey, params);
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

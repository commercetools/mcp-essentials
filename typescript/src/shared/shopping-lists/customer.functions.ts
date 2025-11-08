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
 * Reads shopping lists based on provided parameters (customer-specific)
 */
export async function readShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const {id, key, storeKey} = params;

    // customerId is required - only from context
    if (!context.customerId) {
      throw new SDKError(
        'Customer ID is required to access shopping lists',
        new Error('Missing customerId in context')
      );
    }

    // Build customer filter - always filter by customerId from context
    const customerWhere = [`customer(id="${context.customerId}")`];
    const combinedWhere = params.where
      ? [...customerWhere, ...params.where]
      : customerWhere;

    if (storeKey) {
      // Store-specific operations
      if (id) {
        return await readShoppingListByIdInStore(apiRoot, context, {
          id,
          expand: params.expand,
          customerId: context.customerId,
        });
      } else if (key) {
        return await readShoppingListByKeyInStore(apiRoot, context, {
          key,
          expand: params.expand,
          customerId: context.customerId,
        });
      } else {
        return await queryShoppingListsInStore(apiRoot, context, {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: combinedWhere,
          expand: params.expand,
          customerId: context.customerId,
        });
      }
    } else if (id) {
      return await readShoppingListById(apiRoot, context, {
        id,
        expand: params.expand,
        customerId: context.customerId,
      });
    } else if (key) {
      return await readShoppingListByKey(apiRoot, context, {
        key,
        expand: params.expand,
        customerId: context.customerId,
      });
    } else {
      return await queryShoppingLists(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: combinedWhere,
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
  params: {id: string; expand?: string[]; customerId: string}
) {
  // customerId is required for customer operations
  return base.readShoppingListById(apiRoot, context.projectKey, params);
}

/**
 * Reads a shopping list by key
 */
export function readShoppingListByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]; customerId: string}
) {
  // customerId is required for customer operations
  return base.readShoppingListByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists shopping lists (customer-specific)
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
  // Note: customerId filtering is handled via where clause
  return base.queryShoppingLists(apiRoot, context.projectKey, params as any);
}

/**
 * Lists shopping lists in store (customer-specific)
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
    customerId: string;
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
  params: {
    id: string;
    expand?: string[];
    customerId: string;
  }
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  // customerId is required for customer operations
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
  params: {
    key: string;
    expand?: string[];
    customerId: string;
  }
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  // customerId is required for customer operations
  return base.readShoppingListByKeyInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

/**
 * Creates a new shopping list (customer-specific)
 */
export async function createShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createShoppingListParameters>
) {
  try {
    // customerId is required - only from context
    if (!context.customerId) {
      throw new SDKError(
        'Customer ID is required to create shopping lists',
        new Error('Missing customerId in context')
      );
    }

    // Ensure customer is set for customer operations
    const customerParams = {
      ...params,
      customer: params.customer || {
        id: context.customerId,
        typeId: 'customer' as const,
      },
    };

    if (params.storeKey || context.storeKey) {
      return await base.createShoppingListInStore(
        apiRoot,
        context.projectKey,
        params.storeKey || context.storeKey!,
        customerParams
      );
    }
    return await base.createShoppingList(
      apiRoot,
      context.projectKey,
      customerParams
    );
  } catch (error: any) {
    throw new SDKError('Failed to create shopping list', error);
  }
}

/**
 * Updates a shopping list based on provided parameters (customer-specific)
 */
export async function updateShoppingList(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const {id, key, version, actions, storeKey} = params;
    const targetStoreKey = storeKey || context.storeKey;

    // customerId is required - only from context
    if (!context.customerId) {
      throw new SDKError(
        'Customer ID is required to update shopping lists',
        new Error('Missing customerId in context')
      );
    }

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
            customerId: context.customerId,
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
            customerId: context.customerId,
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
        customerId: context.customerId,
      });
    } else if (key) {
      return await base.updateShoppingListByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
        customerId: context.customerId,
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
  params: {id: string; version: number; actions: any[]; customerId: string}
) {
  // customerId is required for customer operations
  return base.updateShoppingListById(apiRoot, context.projectKey, params);
}

/**
 * Updates a shopping list by key
 */
export async function updateShoppingListByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]; customerId: string}
) {
  // customerId is required for customer operations
  return base.updateShoppingListByKey(apiRoot, context.projectKey, params);
}

/**
 * Updates a shopping list by ID in store
 */
export async function updateShoppingListByIdInStore(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    id: string;
    version: number;
    actions: any[];
    customerId: string;
  }
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  // customerId is required for customer operations
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
  params: {
    key: string;
    version: number;
    actions: any[];
    customerId: string;
  }
) {
  if (!context.storeKey) {
    throw new Error('Store key is required for store-specific operations');
  }
  // customerId is required for customer operations
  return base.updateShoppingListByKeyInStore(
    apiRoot,
    context.projectKey,
    context.storeKey,
    params
  );
}

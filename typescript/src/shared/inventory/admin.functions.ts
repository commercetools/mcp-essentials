import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads inventory entries based on provided parameters
 */
export function readInventory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readInventoryParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get inventory entry by ID
      return readInventoryById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get inventory entry by key
      return readInventoryByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List inventory entries
      return queryInventory(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading inventory', error);
  }
}

/**
 * Reads an inventory entry by ID
 */
export function readInventoryById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readInventoryById(apiRoot, context.projectKey, params);
}

/**
 * Reads an inventory entry by key
 */
export function readInventoryByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readInventoryByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists inventory entries
 */
export function queryInventory(
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
  return base.queryInventory(apiRoot, context.projectKey, params);
}

/**
 * Creates a new inventory entry
 */
export function createInventory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createInventoryParameters>
) {
  return base.createInventory(apiRoot, context.projectKey, params);
}

/**
 * Updates or deletes an inventory entry based on provided parameters
 */
export function updateInventory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateInventoryParameters>
) {
  try {
    const {id, key, version, actions} = params;

    // Check if we're deleting the inventory entry

    if (id) {
      // Update by ID
      return updateInventoryById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateInventoryByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating an inventory entry'
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating inventory', error);
  }
}

/**
 * Updates an inventory entry by ID
 */
export function updateInventoryById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateInventoryById(apiRoot, context.projectKey, params);
}

/**
 * Updates an inventory entry by key
 */
export function updateInventoryByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateInventoryByKey(apiRoot, context.projectKey, params);
}

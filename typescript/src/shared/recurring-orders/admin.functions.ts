import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createRecurringOrderParameters,
  readRecurringOrderParameters,
  updateRecurringOrderParameters,
} from './parameters';
import * as base from './base.functions';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';

/**
 * Reads recurring orders based on provided parameters
 */
export function readRecurringOrder(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readRecurringOrderParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get recurring order by ID
      return readRecurringOrderById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get recurring order by key
      return readRecurringOrderByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List recurring orders
      return queryRecurringOrders(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading recurring order', error);
  }
}

/**
 * Reads a recurring order by ID
 */
export function readRecurringOrderById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readRecurringOrderById(apiRoot, context.projectKey, params);
}

/**
 * Reads a recurring order by key
 */
export function readRecurringOrderByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readRecurringOrderByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists recurring orders
 */
export function queryRecurringOrders(
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
  return base.queryRecurringOrders(apiRoot, context.projectKey, params);
}

/**
 * Creates a new recurring order
 */
export function createRecurringOrder(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createRecurringOrderParameters>
) {
  return base.createRecurringOrder(apiRoot, context.projectKey, params);
}

/**
 * Updates or deletes a recurring order based on provided parameters
 */
export function updateRecurringOrder(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateRecurringOrderParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateRecurringOrderById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateRecurringOrderByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a recurring order'
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating recurring order', error);
  }
}

/**
 * Updates a recurring order by ID
 */
export function updateRecurringOrderById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateRecurringOrderById(apiRoot, context.projectKey, params);
}

/**
 * Updates a recurring order by key
 */
export function updateRecurringOrderByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateRecurringOrderByKey(apiRoot, context.projectKey, params);
}

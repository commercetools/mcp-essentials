/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads shipping methods based on provided parameters
 */
export async function readShippingMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShippingMethodParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get shipping method by ID
      return await readShippingMethodById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get shipping method by key
      return await readShippingMethodByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List shipping methods
      return await queryShippingMethods(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Error reading shipping method', error);
  }
}

/**
 * Reads a shipping method by ID
 */
export async function readShippingMethodById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShippingMethodParameters>
) {
  return base.readShippingMethodById(
    apiRoot,
    context.projectKey,
    params as any
  );
}

/**
 * Reads a shipping method by key
 */
export async function readShippingMethodByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShippingMethodParameters>
) {
  return base.readShippingMethodByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists shipping methods
 */
export async function queryShippingMethods(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readShippingMethodParameters>
) {
  return base.queryShippingMethods(apiRoot, context.projectKey, params);
}

/**
 * Creates a new shipping method
 */
export async function createShippingMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createShippingMethodParameters>
) {
  return base.createShippingMethod(apiRoot, context.projectKey, params);
}

/**
 * Updates a shipping method based on provided parameters
 */
export async function updateShippingMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateShippingMethodParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateShippingMethodById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateShippingMethodByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a shipping method'
      );
    }
  } catch (error) {
    // If the error is already an SDKError, rethrow it
    if (error instanceof SDKError) {
      throw new SDKError('Error updating shipping method', error);
    }
    // If the error is already properly formatted, rethrow it
    throw error;
  }
}

/**
 * Updates a shipping method by ID
 */
export async function updateShippingMethodById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateShippingMethodById(apiRoot, context.projectKey, params);
}

/**
 * Updates a shipping method by key
 */
export async function updateShippingMethodByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateShippingMethodByKey(apiRoot, context.projectKey, params);
}

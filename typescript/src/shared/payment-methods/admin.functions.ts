import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createPaymentMethodParameters,
  readPaymentMethodParameters,
  updatePaymentMethodParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads payment methods based on provided parameters
 */
export function readPaymentMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readPaymentMethodParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get payment method by ID
      return readPaymentMethodById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get payment method by key
      return readPaymentMethodByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List payment methods
      return queryPaymentMethods(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading payment method', error);
  }
}

/**
 * Reads a payment method by ID
 */
export function readPaymentMethodById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readPaymentMethodById(apiRoot, context.projectKey, params);
}

/**
 * Reads a payment method by key
 */
export function readPaymentMethodByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readPaymentMethodByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists payment methods
 */
export function queryPaymentMethods(
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
  return base.queryPaymentMethods(apiRoot, context.projectKey, params);
}

/**
 * Creates a new payment method
 */
export function createPaymentMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createPaymentMethodParameters>
) {
  return base.createPaymentMethod(apiRoot, context.projectKey, params);
}

/**
 * Updates or deletes a payment method based on provided parameters
 */
export function updatePaymentMethod(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updatePaymentMethodParameters>
) {
  try {
    const {id, key, version, actions} = params;

    // Check if we're deleting the payment method

    if (id) {
      // Update by ID
      return updatePaymentMethodById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updatePaymentMethodByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      return Promise.reject(
        new Error(
          'Either id or key must be provided for updating a payment method'
        )
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating payment method', error);
  }
}

/**
 * Updates a payment method by ID
 */
export function updatePaymentMethodById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updatePaymentMethodById(apiRoot, context.projectKey, params);
}

/**
 * Updates a payment method by key
 */
export function updatePaymentMethodByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updatePaymentMethodByKey(apiRoot, context.projectKey, params);
}

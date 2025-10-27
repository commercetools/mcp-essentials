import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createSubscriptionParameters,
  readSubscriptionParameters,
  updateSubscriptionParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads subscriptions based on provided parameters
 */
export function readSubscription(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readSubscriptionParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get subscription by ID
      return readSubscriptionById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get subscription by key
      return readSubscriptionByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List subscriptions
      return querySubscriptions(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Error reading subscription', error);
  }
}

/**
 * Reads a subscription by ID
 */
export function readSubscriptionById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readSubscriptionById(apiRoot, context.projectKey, params);
}

/**
 * Reads a subscription by key
 */
export function readSubscriptionByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readSubscriptionByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists subscriptions
 */
export function querySubscriptions(
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
  return base.querySubscriptions(apiRoot, context.projectKey, params);
}

/**
 * Creates a new subscription
 */
export function createSubscription(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createSubscriptionParameters>
) {
  return base.createSubscription(apiRoot, context.projectKey, params);
}

/**
 * Updates a subscription based on provided parameters
 */
export function updateSubscription(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateSubscriptionParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateSubscriptionById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateSubscriptionByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a subscription'
      );
    }
  } catch (error: any) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating subscription', error);
  }
}

/**
 * Updates a subscription by ID
 */
export function updateSubscriptionById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateSubscriptionById(apiRoot, context.projectKey, params);
}

/**
 * Updates a subscription by key
 */
export function updateSubscriptionByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateSubscriptionByKey(apiRoot, context.projectKey, params);
}

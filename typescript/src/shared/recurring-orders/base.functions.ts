import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createRecurringOrderParameters,
  readRecurringOrderParameters,
  updateRecurringOrderParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a recurring order by ID
 */
export async function readRecurringOrderById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const recurringOrderRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await recurringOrderRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading recurring order by ID', error);
  }
}

/**
 * Reads a recurring order by key
 */
export async function readRecurringOrderByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const recurringOrderRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await recurringOrderRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading recurring order by key', error);
  }
}

/**
 * Lists recurring orders
 */
export async function queryRecurringOrders(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  try {
    const recurringOrdersRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await recurringOrdersRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying recurring orders:', error);
    throw error;
  }
}

/**
 * Creates a new recurring order
 */
export async function createRecurringOrder(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createRecurringOrderParameters>
) {
  try {
    const recurringOrderDraft: any = {
      ...(params.key && {key: params.key}),
      ...(params.cart && {cart: params.cart}),
      ...(params.cartVersion && {cartVersion: params.cartVersion}),
      ...(params.schedule && {schedule: params.schedule}),
      ...(params.startsAt && {startsAt: params.startsAt}),
      ...(params.expiresAt && {expiresAt: params.expiresAt}),
      ...(params.state && {state: params.state}),
      ...(params.custom && {custom: params.custom}),
    };

    const recurringOrderRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .post({
        body: recurringOrderDraft,
      });

    const response = await recurringOrderRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating recurring order', error);
  }
}

/**
 * Updates a recurring order by ID
 */
export async function updateRecurringOrderById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating recurring order by ID', error);
  }
}

/**
 * Updates a recurring order by key
 */
export async function updateRecurringOrderByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .recurringOrders()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating recurring order by key', error);
  }
}

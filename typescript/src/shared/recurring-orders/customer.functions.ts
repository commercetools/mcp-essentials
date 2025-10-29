import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {queryRecurringOrders} from './base.functions';
import {readRecurringOrderParameters} from './parameters';

// Helper function to handle reading a recurring order by ID for a specific customer
export const readRecurringOrderByIdForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    id: string;
    expand?: string[];
  }
) => {
  // Use the base queryRecurringOrders function with customer ID filter
  const whereConditions = [
    `id="${params.id}"`,
    `customerId="${context.customerId}"`,
  ];

  const response = await queryRecurringOrders(apiRoot, context.projectKey, {
    where: whereConditions,
    limit: 1,
    expand: params.expand,
  });

  if (response.count === 0) {
    throw new Error(
      `Recurring order with ID ${params.id} not found for customer ${context.customerId}`
    );
  }

  return response.results[0];
};

// Helper function to handle reading a recurring order by key for a specific customer
export const readRecurringOrderByKeyForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    key: string;
    expand?: string[];
  }
) => {
  // Use the base queryRecurringOrders function with customer ID filter
  const whereConditions = [
    `key="${params.key}"`,
    `customerId="${context.customerId}"`,
  ];

  const response = await queryRecurringOrders(apiRoot, context.projectKey, {
    where: whereConditions,
    limit: 1,
    expand: params.expand,
  });

  if (response.count === 0) {
    throw new Error(
      `Recurring order with key ${params.key} not found for customer ${context.customerId}`
    );
  }
  return response.results[0];
};

// Helper function to handle querying recurring orders for a specific customer
export const queryRecurringOrdersForCustomer = (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    where: string[];
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) => {
  // Create a copy of the where conditions and add customerId
  const whereConditions = [...params.where];
  whereConditions.push(`customerId="${context.customerId}"`);

  // Use the base queryRecurringOrders function
  return queryRecurringOrders(apiRoot, context.projectKey, {
    where: whereConditions,
    limit: params.limit,
    offset: params.offset,
    sort: params.sort,
    expand: params.expand,
  });
};

export const readCustomerRecurringOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: z.infer<typeof readRecurringOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readRecurringOrderByIdForCustomer(apiRoot, context, {
        id: params.id,
        expand: params.expand,
      });
    }

    // If key is provided, get by key
    if (params.key) {
      return await readRecurringOrderByKeyForCustomer(apiRoot, context, {
        key: params.key,
        expand: params.expand,
      });
    }

    // If where is provided, query recurring orders
    return await queryRecurringOrdersForCustomer(apiRoot, context, {
      where: params.where || [],
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read customer recurring order', error);
  }
};

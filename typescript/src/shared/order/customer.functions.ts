import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {queryOrders} from './base.functions';
import {readOrderParameters} from './parameters';

// Helper function to handle reading an order by ID for a specific customer
export const readOrderByIdForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    id: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  // Use the base queryOrders function with customer ID filter
  const whereConditions = [
    `id="${params.id}"`,
    `customerId="${context.customerId}"`,
  ];

  const response = await queryOrders(
    apiRoot,
    context.projectKey,
    whereConditions,
    1, // limit to 1
    undefined,
    undefined,
    params.expand,
    params.storeKey
  );

  if (response.count === 0) {
    throw new Error(
      `Order with ID ${params.id} not found for customer ${context.customerId}`
    );
  }
  return response.results[0];
};

// Helper function to handle reading an order by orderNumber for a specific customer
export const readOrderByOrderNumberForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    orderNumber: string;
    storeKey?: string;
    expand?: string[];
  }
) => {
  // Use the base queryOrders function with customer ID filter
  const whereConditions = [
    `orderNumber="${params.orderNumber}"`,
    `customerId="${context.customerId}"`,
  ];

  const response = await queryOrders(
    apiRoot,
    context.projectKey,
    whereConditions,
    1, // limit to 1
    undefined,
    undefined,
    params.expand,
    params.storeKey
  );

  if (response.count === 0) {
    throw new Error(
      `Order with number ${params.orderNumber} not found for customer ${context.customerId}`
    );
  }
  return response.results[0];
};

// Helper function to handle querying orders for a specific customer
export const queryOrdersForCustomer = (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    where: string[];
    storeKey?: string;
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) => {
  // Create a copy of the where conditions and add customerId
  const whereConditions = [...params.where];
  whereConditions.push(`customerId="${context.customerId}"`);

  // Use the base queryOrders function
  return queryOrders(
    apiRoot,
    context.projectKey,
    whereConditions,
    params.limit,
    params.offset,
    params.sort,
    params.expand,
    params.storeKey
  );
};

export const readCustomerOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: z.infer<typeof readOrderParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readOrderByIdForCustomer(apiRoot, context, {
        id: params.id,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
      return await readOrderByOrderNumberForCustomer(apiRoot, context, {
        orderNumber: params.orderNumber,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If where is provided, query orders
    return await queryOrdersForCustomer(apiRoot, context, {
      where: params.where || [],
      storeKey: params.storeKey,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read customer order', error);
  }
};

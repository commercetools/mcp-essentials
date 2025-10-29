import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {queryShippingMethods} from './base.functions';
import {readShippingMethodParameters} from './parameters';

// Helper function to handle reading a shipping method by ID for a specific customer
export const readShippingMethodByIdForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    id: string;
    expand?: string[];
  }
) => {
  // Use the base queryShippingMethods function
  // Note: Shipping methods don't have a customerId filter, but we can filter by zones
  // For customer context, we typically want to get shipping methods available to their location
  const response = await queryShippingMethods(apiRoot, context.projectKey, {
    where: [`id="${params.id}"`],
    limit: 1,
    expand: params.expand,
  });

  return response.results[0];
};

// Helper function to handle reading a shipping method by key for a specific customer
export const readShippingMethodByKeyForCustomer = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: {
    key: string;
    expand?: string[];
  }
) => {
  // Use the base queryShippingMethods function
  const response = await queryShippingMethods(apiRoot, context.projectKey, {
    where: [`key="${params.key}"`],
    limit: 1,
    expand: params.expand,
  });

  return response.results[0];
};

// Helper function to handle querying shipping methods for a specific customer
export const queryShippingMethodsForCustomer = (
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
  // Use the base queryShippingMethods function
  // Shipping methods can be filtered by zone, which is typically related to customer location
  return queryShippingMethods(apiRoot, context.projectKey, {
    where: params.where,
    limit: params.limit,
    offset: params.offset,
    sort: params.sort,
    expand: params.expand,
  });
};

export const readCustomerShippingMethod = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; customerId?: string},
  params: z.infer<typeof readShippingMethodParameters>
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readShippingMethodByIdForCustomer(apiRoot, context, {
        id: params.id,
        expand: params.expand,
      });
    }

    // If key is provided, get by key
    if (params.key) {
      return await readShippingMethodByKeyForCustomer(apiRoot, context, {
        key: params.key,
        expand: params.expand,
      });
    }

    // If where is provided, query shipping methods
    return await queryShippingMethodsForCustomer(apiRoot, context, {
      where: params.where || [],
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read customer shipping method', error);
  }
};

import {ApiRoot, ShippingMethodUpdateAction} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a shipping method by ID
 */
export async function readShippingMethodById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shippingMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shipping method by ID', error);
  }
}

/**
 * Reads a shipping method by key
 */
export async function readShippingMethodByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shippingMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shipping method by key', error);
  }
}

/**
 * Lists shipping methods
 */
export async function queryShippingMethods(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    where?: string[];
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) {
  try {
    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await shippingMethodRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying shipping methods:', error);
    throw error;
  }
}

/**
 * Creates a new shipping method
 */
export async function createShippingMethod(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createShippingMethodParameters>
) {
  try {
    const shippingMethodDraft: any = {
      name: params.name,
      ...(params.key && {key: params.key}),
      ...(params.description && {description: params.description}),
      ...(params.zoneRates && {zoneRates: params.zoneRates}),
      ...(params.isDefault !== undefined && {isDefault: params.isDefault}),
      ...(params.taxCategory && {taxCategory: params.taxCategory}),
      ...(params.custom && {custom: params.custom}),
    };

    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .post({
        body: shippingMethodDraft,
      } as any);

    const response = await shippingMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating shipping method', error);
  }
}

/**
 * Updates a shipping method by ID
 */
export async function updateShippingMethodById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateShippingMethodParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .withId({ID: params.id as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any[],
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating shipping method by ID', error);
  }
}

/**
 * Updates a shipping method by key
 */
export async function updateShippingMethodByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
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
    throw new SDKError('Error updating shipping method by key', error);
  }
}

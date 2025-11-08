import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShippingMethodParameters,
  readShippingMethodParameters,
  updateShippingMethodParameters,
  getMatchingShippingMethodsForCartParameters,
  checkMatchingShippingMethodsForCartParameters,
  getMatchingShippingMethodsForLocationParameters,
  checkMatchingShippingMethodsForLocationParameters,
  getMatchingShippingMethodsForCartAndLocationParameters,
  checkMatchingShippingMethodsForCartAndLocationParameters,
  getMatchingShippingMethodsForCartInStoreParameters,
  checkMatchingShippingMethodsForCartInStoreParameters,
  getMatchingShippingMethodsForOrderEditParameters,
  checkMatchingShippingMethodsForOrderEditParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a shipping method by ID
 */
export async function readShippingMethodById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShippingMethodParameters>
) {
  try {
    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .withId({ID: params.id!})
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
  params: z.infer<typeof readShippingMethodParameters>
) {
  try {
    const shippingMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .withKey({key: params.key!})
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

/**
 * Gets matching shipping methods for a cart
 */
export async function getMatchingShippingMethodsForCart(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof getMatchingShippingMethodsForCartParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          cartId: params.cartId,
          ...(params.expand && {expand: params.expand}),
        },
      });

    const response = await request.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError(
      'Error getting matching shipping methods for cart',
      error
    );
  }
}

/**
 * Checks if matching shipping methods exist for a cart
 */
export async function checkMatchingShippingMethodsForCart(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof checkMatchingShippingMethodsForCartParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingCart()
      .head({
        queryArgs: {
          cartId: params.cartId,
        },
      });

    const response = await request.execute();
    return {exists: response.statusCode === 200};
  } catch (error: any) {
    throw new SDKError(
      'Error checking matching shipping methods for cart',
      error
    );
  }
}

/**
 * Gets matching shipping methods for a location
 */
export async function getMatchingShippingMethodsForLocation(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof getMatchingShippingMethodsForLocationParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingLocation()
      .get({
        queryArgs: {
          country: params.country,
          ...(params.state && {state: params.state}),
          ...(params.expand && {expand: params.expand}),
        },
      });

    const response = await request.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError(
      'Error getting matching shipping methods for location',
      error
    );
  }
}

/**
 * Checks if matching shipping methods exist for a location
 */
export async function checkMatchingShippingMethodsForLocation(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof checkMatchingShippingMethodsForLocationParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingLocation()
      .head({
        queryArgs: {
          country: params.country,
          ...(params.state && {state: params.state}),
        },
      });

    const response = await request.execute();
    return {exists: response.statusCode === 200};
  } catch (error: any) {
    throw new SDKError(
      'Error checking matching shipping methods for location',
      error
    );
  }
}

/**
 * Gets matching shipping methods for a cart and location
 */
export async function getMatchingShippingMethodsForCartAndLocation(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof getMatchingShippingMethodsForCartAndLocationParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          cartId: params.cartId,
          country: params.country,
          ...(params.state && {state: params.state}),
          ...(params.expand && {expand: params.expand}),
        },
      });

    const response = await request.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError(
      'Error getting matching shipping methods for cart and location',
      error
    );
  }
}

/**
 * Checks if matching shipping methods exist for a cart and location
 */
export async function checkMatchingShippingMethodsForCartAndLocation(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<
    typeof checkMatchingShippingMethodsForCartAndLocationParameters
  >
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingCart()
      .head({
        queryArgs: {
          cartId: params.cartId,
          country: params.country,
          ...(params.state && {state: params.state}),
        },
      });

    const response = await request.execute();
    return {exists: response.statusCode === 200};
  } catch (error: any) {
    throw new SDKError(
      'Error checking matching shipping methods for cart and location',
      error
    );
  }
}

/**
 * Gets matching shipping methods for a cart in store
 */
export async function getMatchingShippingMethodsForCartInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof getMatchingShippingMethodsForCartInStoreParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          cartId: params.cartId,
          ...(params.expand && {expand: params.expand}),
        },
      });

    const response = await request.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError(
      'Error getting matching shipping methods for cart in store',
      error
    );
  }
}

/**
 * Checks if matching shipping methods exist for a cart in store
 */
export async function checkMatchingShippingMethodsForCartInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof checkMatchingShippingMethodsForCartInStoreParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .shippingMethods()
      .matchingCart()
      .head({
        queryArgs: {
          cartId: params.cartId,
        },
      });

    const response = await request.execute();
    return {exists: response.statusCode === 200};
  } catch (error: any) {
    throw new SDKError(
      'Error checking matching shipping methods for cart in store',
      error
    );
  }
}

/**
 * Gets matching shipping methods for an order edit
 */
export async function getMatchingShippingMethodsForOrderEdit(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof getMatchingShippingMethodsForOrderEditParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingOrderedit()
      .get({
        queryArgs: {
          orderEditId: params.orderEditId,
          ...(params.expand && {expand: params.expand}),
        } as any,
      });

    const response = await request.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError(
      'Error getting matching shipping methods for order edit',
      error
    );
  }
}

/**
 * Checks if matching shipping methods exist for an order edit
 */
export async function checkMatchingShippingMethodsForOrderEdit(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof checkMatchingShippingMethodsForOrderEditParameters>
) {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .shippingMethods()
      .matchingOrderedit()
      .head({
        queryArgs: {
          orderEditId: params.orderEditId,
        } as any,
      });

    const response = await request.execute();
    return {exists: response.statusCode === 200};
  } catch (error: any) {
    throw new SDKError(
      'Error checking matching shipping methods for order edit',
      error
    );
  }
}

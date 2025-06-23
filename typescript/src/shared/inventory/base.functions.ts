import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createInventoryParameters,
  readInventoryParameters,
  updateInventoryParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads an inventory entry by ID
 */
export async function readInventoryById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const inventoryRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await inventoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading inventory by ID', error);
  }
}

/**
 * Reads an inventory entry by key
 */
export async function readInventoryByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const inventoryRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await inventoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading inventory by key', error);
  }
}

/**
 * Lists inventory entries
 */
export async function queryInventory(
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
    const inventoryRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await inventoryRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying inventory:', error);
    throw error;
  }
}

/**
 * Creates a new inventory entry
 */
export async function createInventory(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createInventoryParameters>
) {
  try {
    const inventoryDraft = {
      key: params.key,
      sku: params.sku,
      supplyChannel: params.supplyChannel,
      quantityOnStock: params.quantityOnStock,
      restockableInDays: params.restockableInDays,
      expectedDelivery: params.expectedDelivery,
      custom: params.custom,
    };

    const inventoryRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .post({
        body: inventoryDraft,
      });

    const response = await inventoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating inventory entry', error);
  }
}

/**
 * Updates an inventory entry by ID
 */
export async function updateInventoryById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    // Filter out any 'delete' actions
    const updateActions = params.actions.filter(
      (action) => action.action !== 'delete'
    );

    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: updateActions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating inventory by ID', error);
  }
}

/**
 * Updates an inventory entry by key
 */
export async function updateInventoryByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    // Filter out any 'delete' actions
    const updateActions = params.actions.filter(
      (action) => action.action !== 'delete'
    );

    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .inventory()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: updateActions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating inventory by key', error);
  }
}

import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShoppingListParameters,
  readShoppingListParameters,
  updateShoppingListParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a shopping list by ID
 */
export async function readShoppingListById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .withId({ID: params.id as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shopping list by ID', error);
  }
}

/**
 * Reads a shopping list by key
 */
export async function readShoppingListByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .withKey({key: params.key as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shopping list by key', error);
  }
}

/**
 * Lists shopping lists
 */
export async function queryShoppingLists(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error querying shopping lists', error);
  }
}

/**
 * Lists shopping lists in store
 */
export async function queryShoppingListsInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error querying shopping lists in store', error);
  }
}

/**
 * Reads a shopping list by ID in store
 */
export async function readShoppingListByIdInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .withId({ID: params.id as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shopping list by ID in store', error);
  }
}

/**
 * Reads a shopping list by key in store
 */
export async function readShoppingListByKeyInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof readShoppingListParameters>
) {
  try {
    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .withKey({key: params.key as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading shopping list by key in store', error);
  }
}

/**
 * Creates a new shopping list
 */
export async function createShoppingList(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createShoppingListParameters>
) {
  try {
    const shoppingListDraft = {
      key: params.key,
      name: params.name,
      slug: params.slug,
      description: params.description,
      customer: params.customer,
      store: params.store,
      businessUnit: params.businessUnit,
      lineItems: params.lineItems,
      textLineItems: params.textLineItems,
      deleteDaysAfterLastModification: params.deleteDaysAfterLastModification,
      anonymousId: params.anonymousId,
      custom: params.custom,
    };

    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .post({
        body: shoppingListDraft as any,
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating shopping list', error);
  }
}

/**
 * Creates a new shopping list in store
 */
export async function createShoppingListInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof createShoppingListParameters>
) {
  try {
    const shoppingListDraft = {
      key: params.key,
      name: params.name,
      slug: params.slug,
      description: params.description,
      customer: params.customer,
      store: params.store,
      businessUnit: params.businessUnit,
      lineItems: params.lineItems,
      textLineItems: params.textLineItems,
      deleteDaysAfterLastModification: params.deleteDaysAfterLastModification,
      anonymousId: params.anonymousId,
      custom: params.custom,
    };

    const shoppingListRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .post({
        body: shoppingListDraft as any,
      });

    const response = await shoppingListRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating shopping list in store', error);
  }
}

/**
 * Updates a shopping list by ID
 */
export async function updateShoppingListById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .withId({ID: params.id as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating shopping list by ID', error);
  }
}

/**
 * Updates a shopping list by key
 */
export async function updateShoppingListByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .shoppingLists()
      .withKey({key: params.key as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating shopping list by key', error);
  }
}

/**
 * Updates a shopping list by ID in store
 */
export async function updateShoppingListByIdInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .withId({ID: params.id as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating shopping list by ID in store', error);
  }
}

/**
 * Updates a shopping list by key in store
 */
export async function updateShoppingListByKeyInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  params: z.infer<typeof updateShoppingListParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .shoppingLists()
      .withKey({key: params.key as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating shopping list by key in store', error);
  }
}

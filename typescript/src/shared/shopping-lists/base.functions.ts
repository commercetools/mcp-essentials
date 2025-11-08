import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createShoppingListParameters,
  readShoppingListParameters,
  updateShoppingListParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Validates that a shopping list belongs to the specified customer
 */
async function validateCustomerOwnership(
  apiRoot: ApiRoot,
  projectKey: string,
  shoppingListId: string,
  customerId: string,
  storeKey?: string
): Promise<void> {
  try {
    const shoppingListRequest = storeKey
      ? apiRoot
          .withProjectKey({projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey})
          .shoppingLists()
          .withId({ID: shoppingListId})
          .get()
      : apiRoot
          .withProjectKey({projectKey})
          .shoppingLists()
          .withId({ID: shoppingListId})
          .get();

    const response = await shoppingListRequest.execute();
    const shoppingList = response.body;

    if (!shoppingList.customer || shoppingList.customer.id !== customerId) {
      throw new SDKError(
        'Access denied: Shopping list does not belong to the specified customer',
        new Error('Customer ownership validation failed')
      );
    }
  } catch (error: any) {
    if (error instanceof SDKError) {
      throw error;
    }
    throw new SDKError('Error validating customer ownership', error);
  }
}

/**
 * Validates that a shopping list (by key) belongs to the specified customer
 */
async function validateCustomerOwnershipByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  shoppingListKey: string,
  customerId: string,
  storeKey?: string
): Promise<void> {
  try {
    const shoppingListRequest = storeKey
      ? apiRoot
          .withProjectKey({projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey})
          .shoppingLists()
          .withKey({key: shoppingListKey})
          .get()
      : apiRoot
          .withProjectKey({projectKey})
          .shoppingLists()
          .withKey({key: shoppingListKey})
          .get();

    const response = await shoppingListRequest.execute();
    const shoppingList = response.body;

    if (!shoppingList.customer || shoppingList.customer.id !== customerId) {
      throw new SDKError(
        'Access denied: Shopping list does not belong to the specified customer',
        new Error('Customer ownership validation failed')
      );
    }
  } catch (error: any) {
    if (error instanceof SDKError) {
      throw error;
    }
    throw new SDKError('Error validating customer ownership', error);
  }
}

/**
 * Reads a shopping list by ID
 */
export async function readShoppingListById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnership(
        apiRoot,
        projectKey,
        params.id as string,
        params.customerId
      );
    }

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
  } catch (error: any) {
    throw new SDKError('Error reading shopping list by ID', error);
  }
}

/**
 * Reads a shopping list by key
 */
export async function readShoppingListByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnershipByKey(
        apiRoot,
        projectKey,
        params.key as string,
        params.customerId
      );
    }

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
  } catch (error: any) {
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
  params: z.infer<typeof readShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnership(
        apiRoot,
        projectKey,
        params.id as string,
        params.customerId,
        storeKey
      );
    }

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
  } catch (error: any) {
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
  params: z.infer<typeof readShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnershipByKey(
        apiRoot,
        projectKey,
        params.key as string,
        params.customerId,
        storeKey
      );
    }

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
  } catch (error: any) {
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
  params: z.infer<typeof updateShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnership(
        apiRoot,
        projectKey,
        params.id as string,
        params.customerId
      );
    }

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
  } catch (error: any) {
    throw new SDKError('Error updating shopping list by ID', error);
  }
}

/**
 * Updates a shopping list by key
 */
export async function updateShoppingListByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnershipByKey(
        apiRoot,
        projectKey,
        params.key as string,
        params.customerId
      );
    }

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
  } catch (error: any) {
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
  params: z.infer<typeof updateShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnership(
        apiRoot,
        projectKey,
        params.id as string,
        params.customerId,
        storeKey
      );
    }

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
  } catch (error: any) {
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
  params: z.infer<typeof updateShoppingListParameters> & {customerId?: string}
) {
  try {
    // Validate customer ownership if customerId is provided
    if (params.customerId) {
      await validateCustomerOwnershipByKey(
        apiRoot,
        projectKey,
        params.key as string,
        params.customerId,
        storeKey
      );
    }

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
  } catch (error: any) {
    throw new SDKError('Error updating shopping list by key in store', error);
  }
}

import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readCustomerById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[],
  storeKey?: string
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .customers();
    } else {
      apiRequest = projectApiRoot.customers();
    }

    const customer = await apiRequest
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to read customer by ID', error);
  }
};

export const queryCustomers = async (
  apiRoot: ApiRoot,
  projectKey: string,
  limit?: number,
  offset?: number,
  sort?: string[],
  where?: string[],
  expand?: string[],
  storeKey?: string
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .customers();
    } else {
      apiRequest = projectApiRoot.customers();
    }

    const customers = await apiRequest
      .get({
        queryArgs: {
          limit: limit || 10,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(where && {where}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return customers.body;
  } catch (error: any) {
    throw new SDKError('Failed to query customers', error);
  }
};

export const createCustomer = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerDraft: CustomerDraft,
  storeKey?: string
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .customers();
    } else {
      apiRequest = projectApiRoot.customers();
    }

    const customer = await apiRequest
      .post({
        body: customerDraft,
      })
      .execute();

    return customer.body;
  } catch (error: any) {
    throw new SDKError('Failed to create customer', error);
  }
};

export const updateCustomer = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: CustomerUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the customer to get the latest version
    const customer = await readCustomerById(
      apiRoot,
      projectKey,
      id,
      undefined,
      storeKey
    );
    const currentVersion = customer.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .customers();
    } else {
      apiRequest = projectApiRoot.customers();
    }

    const updatedCustomer = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCustomer.body;
  } catch (error: any) {
    throw new SDKError('Failed to update customer', error);
  }
};

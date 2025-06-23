import {
  ApiRoot,
  StoreDraft,
  StoreUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readStoreById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const store = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();
    return store.body;
  } catch (error: any) {
    throw new SDKError('Failed to read store by ID', error);
  }
};

export const readStoreByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  try {
    const store = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();
    return store.body;
  } catch (error: any) {
    throw new SDKError('Failed to read store by key', error);
  }
};

// Helper function to query stores
export const queryStores = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[]
) => {
  try {
    const queryArgs = {
      ...(where && {where}),
      limit: limit || 10,
      ...(offset && {offset}),
      ...(sort && {sort}),
      ...(expand && {expand}),
    };

    const stores = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .get({queryArgs})
      .execute();
    return stores.body;
  } catch (error: any) {
    throw new SDKError('Failed to query stores', error);
  }
};

export const updateStoreById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  actions: StoreUpdateAction[]
) => {
  try {
    // First fetch the store to get the latest version
    const store = await readStoreById(apiRoot, projectKey, id);
    const currentVersion = store.version;

    const updatedStore = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedStore.body;
  } catch (error: any) {
    throw new SDKError('Failed to update store by ID', error);
  }
};

export const updateStoreByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  actions: StoreUpdateAction[]
) => {
  try {
    // First fetch the store to get the latest version
    const store = await readStoreByKey(apiRoot, projectKey, key);
    const currentVersion = store.version;

    const updatedStore = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedStore.body;
  } catch (error: any) {
    throw new SDKError('Failed to update store by key', error);
  }
};

export const createStore = async (
  apiRoot: ApiRoot,
  projectKey: string,
  storeDraft: StoreDraft
) => {
  try {
    const store = await apiRoot
      .withProjectKey({projectKey})
      .stores()
      .post({
        body: storeDraft,
      })
      .execute();

    return store.body;
  } catch (error: any) {
    throw new SDKError('Failed to create store', error);
  }
};

/* eslint-disable no-nested-ternary */
import {z} from 'zod';
import {
  ApiRoot,
  ProductTailoringDraft,
  ProductTailoringInStoreDraft,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  readProductTailoringParameters,
  createProductTailoringParameters,
  updateProductTailoringParameters,
} from './parameters';

/**
 * Read a product tailoring entry by ID
 */
export async function readProductTailoringById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: any
) {
  try {
    const validatedParams = readProductTailoringParameters.parse(params);
    const {id, expand} = validatedParams;

    if (!id) {
      throw new Error('Product tailoring ID is required');
    }

    const response = await apiRoot
      .withProjectKey({projectKey: projectKey})
      .productTailoring()
      .withId({ID: id})
      .get({
        queryArgs: {
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error reading product tailoring by ID', error);
  }
}

/**
 * Read a product tailoring entry by key
 */
export async function readProductTailoringByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: any
) {
  try {
    const validatedParams = readProductTailoringParameters.parse(params);
    const {key, expand} = validatedParams;

    if (!key) {
      throw new SDKError('Product tailoring key is required');
    }

    const response = await apiRoot
      .withProjectKey({projectKey: projectKey})
      .productTailoring()
      .withKey({key})
      .get({
        queryArgs: {
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error reading product tailoring by key', error);
  }
}

/**
 * Read product tailoring for a product in a store by product ID
 */
export async function readProductTailoringByProductId(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readProductTailoringParameters>
) {
  try {
    const {storeKey, productId, expand} = params;

    if (!storeKey) {
      throw new SDKError('Store key is required for product-specific queries');
    }

    if (!productId) {
      throw new SDKError('Product ID is required for product-specific queries');
    }

    const response = await apiRoot
      .withProjectKey({projectKey: projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .products()
      .withProductId({productID: productId})
      .productTailoring()
      .get({
        queryArgs: {
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error reading product tailoring by product ID', error);
  }
}

/**
 * Read product tailoring for a product in a store by product key
 */
export async function readProductTailoringByProductKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readProductTailoringParameters>
) {
  try {
    const {storeKey, productKey, expand} = params;

    if (!storeKey) {
      throw new SDKError('Store key is required for product-specific queries');
    }

    if (!productKey) {
      throw new SDKError(
        'Product key is required for product-specific queries'
      );
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .products()
      .withProductKey({productKey})
      .productTailoring()
      .get({
        queryArgs: {
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error reading product tailoring by product key', error);
  }
}

/**
 * Query product tailoring entries
 */
export async function queryProductTailoring(
  apiRoot: ApiRoot,
  projectKey: string,
  params: any
) {
  try {
    const validatedParams = readProductTailoringParameters.parse(params);
    const {limit, offset, sort, where, expand} = validatedParams;

    const response = await apiRoot
      .withProjectKey({projectKey: projectKey})
      .productTailoring()
      .get({
        queryArgs: {
          limit,
          offset,
          sort,
          where,
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error querying product tailoring', error);
  }
}

/**
 * Query product tailoring entries in a store
 */
export async function queryProductTailoringInStore(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readProductTailoringParameters>
) {
  try {
    const {storeKey, limit, offset, sort, where, expand} = params;

    if (!storeKey) {
      throw new SDKError('Store key is required for store-specific queries');
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .productTailoring()
      .get({
        queryArgs: {
          limit,
          offset,
          sort,
          where,
          expand,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error querying product tailoring in store', error);
  }
}

/**
 * Create a product tailoring entry
 */
export async function createProductTailoring(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createProductTailoringParameters>
) {
  try {
    const {store, product, storeKey, productKey, productId, ...rest} = params;

    if (!(store || storeKey)) {
      throw new Error('Either store or storeKey is required');
    }

    if (!(product || productKey || productId)) {
      throw new Error('Either product or productKey or productId is required');
    }

    const productTailoringDraft = {
      product: productId
        ? {typeId: 'product' as const, id: productId}
        : productKey
          ? {typeId: 'product' as const, key: productKey!}
          : product,
      store: storeKey ? {typeId: 'store' as const, key: storeKey} : store,
      ...rest,
    };

    let response;
    if (store || storeKey) {
      response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: store?.key || storeKey!})
        .productTailoring()
        .post({
          body: productTailoringDraft as ProductTailoringInStoreDraft,
        })
        .execute();
    } else {
      response = await apiRoot
        .withProjectKey({projectKey})
        .productTailoring()
        .post({
          body: {
            ...productTailoringDraft,
            ...params,
          } as ProductTailoringDraft,
        })
        .execute();
    }

    console.log('response', response);
    return response?.body ?? null;
  } catch (error) {
    throw new SDKError('Error creating product tailoring', error);
  }
}

/**
 * Update a product tailoring entry by ID
 */
export async function updateProductTailoringById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateProductTailoringParameters>
) {
  try {
    const {id, version, actions} = params;
    const updateActions = actions.filter(
      (action: any) => action.action !== 'delete'
    );

    if (!id) {
      throw new SDKError('Product tailoring ID is required');
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .productTailoring()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions: updateActions as any[],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error updating product tailoring by ID', error);
  }
}

/**
 * Update product tailoring by key
 */
export const updateProductTailoringByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    key: string;
    version: number;
    actions: any[];
  }
) => {
  try {
    const {key, version, actions} = params;

    const response = await apiRoot
      .withProjectKey({projectKey})
      .productTailoring()
      .withKey({key})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    throw new SDKError('Error updating product tailoring by key', error);
  }
};

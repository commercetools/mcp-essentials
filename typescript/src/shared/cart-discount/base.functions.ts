import {
  ApiRoot,
  CartDiscountDraft,
  CartDiscountUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readCartDiscountById = async (
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
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const cartDiscount = await apiRequest
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return cartDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to read cart discount by ID', error);
  }
};

export const readCartDiscountByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
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
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const cartDiscount = await apiRequest
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return cartDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to read cart discount by key', error);
  }
};

export const queryCartDiscounts = async (
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
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const cartDiscounts = await apiRequest
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

    return cartDiscounts.body;
  } catch (error: any) {
    throw new SDKError('Failed to query cart discounts', error);
  }
};

export const createCartDiscount = async (
  apiRoot: ApiRoot,
  projectKey: string,
  cartDiscountDraft: CartDiscountDraft,
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
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const cartDiscount = await apiRequest
      .post({
        body: cartDiscountDraft,
      })
      .execute();

    return cartDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to create cart discount', error);
  }
};

export const updateCartDiscountById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: CartDiscountUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the cart discount to get the latest version
    const cartDiscount = await readCartDiscountById(
      apiRoot,
      projectKey,
      id,
      undefined,
      storeKey
    );
    const currentVersion = cartDiscount.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const updatedCartDiscount = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCartDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to update cart discount by ID', error);
  }
};

export const updateCartDiscountByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  version: number,
  actions: CartDiscountUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the cart discount to get the latest version
    const cartDiscount = await readCartDiscountByKey(
      apiRoot,
      projectKey,
      key,
      undefined,
      storeKey
    );
    const currentVersion = cartDiscount.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .cartDiscounts();
    } else {
      apiRequest = projectApiRoot.cartDiscounts();
    }

    const updatedCartDiscount = await apiRequest
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCartDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to update cart discount by key', error);
  }
};

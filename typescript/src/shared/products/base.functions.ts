import {
  ApiRoot,
  ProductDraft,
  ProductUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const queryProducts = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any
) => {
  try {
    const products = await apiRoot
      .withProjectKey({projectKey})
      .products()
      .get({queryArgs})
      .execute();

    return products.body;
  } catch (error: any) {
    throw new SDKError('Failed to list products', error);
  }
};

export const readProductById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const product = await apiRoot
      .withProjectKey({projectKey})
      .products()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return product.body;
  } catch (error: any) {
    throw new SDKError('Failed to read product', error);
  }
};

export const createProductBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  productDraft: ProductDraft
) => {
  try {
    const product = await apiRoot
      .withProjectKey({projectKey})
      .products()
      .post({
        body: productDraft,
      })
      .execute();

    return product.body;
  } catch (error: any) {
    throw new SDKError('Failed to create product', error);
  }
};

export const updateProductBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: ProductUpdateAction[]
) => {
  try {
    const product = await apiRoot
      .withProjectKey({projectKey})
      .products()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return product.body;
  } catch (error: any) {
    throw new SDKError('Failed to update product', error);
  }
};

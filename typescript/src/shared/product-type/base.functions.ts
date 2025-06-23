import {
  ApiRoot,
  ProductTypeUpdateAction,
  ProductTypeDraft,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readProductTypeById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey})
      .productTypes()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to read product type', error);
  }
};

export const queryProductTypes = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any
) => {
  try {
    const productTypes = await apiRoot
      .withProjectKey({projectKey})
      .productTypes()
      .get({queryArgs})
      .execute();

    return productTypes.body;
  } catch (error: any) {
    throw new SDKError('Failed to list product types', error);
  }
};

export const createProductTypeBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  productTypeDraft: ProductTypeDraft
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey})
      .productTypes()
      .post({
        body: productTypeDraft,
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to create product type', error);
  }
};

export const updateProductTypeBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: ProductTypeUpdateAction[]
) => {
  try {
    const productType = await apiRoot
      .withProjectKey({projectKey})
      .productTypes()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return productType.body;
  } catch (error: any) {
    throw new SDKError('Failed to update product type', error);
  }
};

import {z} from 'zod';
import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {
  ApiRoot,
  ProductDiscountDraft,
  ProductDiscountUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a product discount by ID
 */
export async function readProductDiscountById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to read product discount by ID', error);
  }
}

/**
 * Reads a product discount by key
 */
export async function readProductDiscountByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to read product discount by key', error);
  }
}

/**
 * Queries product discounts based on provided parameters
 */
export async function queryProductDiscounts(
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
    const productDiscounts = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .get({
        queryArgs: {
          limit: params.limit || 10,
          ...(params.offset && {offset: params.offset}),
          ...(params.sort && {sort: params.sort}),
          ...(params.where && {where: params.where}),
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return productDiscounts.body;
  } catch (error: any) {
    throw new SDKError('Failed to query product discounts', error);
  }
}

/**
 * Creates a new product discount
 */
export async function createProductDiscount(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createProductDiscountParameters>
) {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .post({
        body: params as ProductDiscountDraft,
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to create product discount', error);
  }
}

/**
 * Updates a product discount by ID
 */
export async function updateProductDiscountById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: ProductDiscountUpdateAction[]}
) {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to update product discount by ID', error);
  }
}

/**
 * Updates a product discount by key
 */
export async function updateProductDiscountByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: ProductDiscountUpdateAction[]}
) {
  try {
    const productDiscount = await apiRoot
      .withProjectKey({projectKey})
      .productDiscounts()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      })
      .execute();

    return productDiscount.body;
  } catch (error: any) {
    throw new SDKError('Failed to update product discount by key', error);
  }
}

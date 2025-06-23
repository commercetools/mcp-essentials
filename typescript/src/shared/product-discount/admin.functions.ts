import {z} from 'zod';
import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {
  ApiRoot,
  ProductDiscountUpdateAction,
} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a product discount based on provided parameters
 */
export function readProductDiscount(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readProductDiscountParameters>
) {
  try {
    // If ID is provided, fetch by ID
    if (params.id) {
      return readProductDiscountById(apiRoot, context, {
        id: params.id,
        expand: params.expand,
      });
    }

    // If key is provided, fetch by key
    if (params.key) {
      return readProductDiscountByKey(apiRoot, context, {
        key: params.key,
        expand: params.expand,
      });
    }

    // Otherwise, fetch a list of product discounts based on query parameters
    return queryProductDiscounts(apiRoot, context, {
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      where: params.where,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read product discount', error);
  }
}

/**
 * Reads a product discount by ID
 */
export function readProductDiscountById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readProductDiscountById(apiRoot, context.projectKey, params);
}

/**
 * Reads a product discount by key
 */
export function readProductDiscountByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readProductDiscountByKey(apiRoot, context.projectKey, params);
}

/**
 * Queries product discounts based on provided parameters
 */
export function queryProductDiscounts(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  return base.queryProductDiscounts(apiRoot, context.projectKey, params);
}

/**
 * Creates a new product discount
 */
export function createProductDiscount(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductDiscountParameters>
) {
  return base.createProductDiscount(apiRoot, context.projectKey, params);
}

/**
 * Updates a product discount based on provided parameters
 */
export function updateProductDiscount(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductDiscountParameters>
) {
  try {
    if (params.id) {
      return updateProductDiscountById(apiRoot, context, {
        id: params.id,
        version: params.version,
        actions: params.actions as ProductDiscountUpdateAction[],
      });
    }

    if (params.key) {
      return updateProductDiscountByKey(apiRoot, context, {
        key: params.key,
        version: params.version,
        actions: params.actions as ProductDiscountUpdateAction[],
      });
    }

    throw new SDKError(
      'Failed to update product discount',
      new Error(
        'Either id or key must be provided to update a product discount'
      )
    );
  } catch (error: any) {
    if (error instanceof SDKError) {
      throw error;
    }
    throw new SDKError('Failed to update product discount', error);
  }
}

/**
 * Updates a product discount by ID
 */
export function updateProductDiscountById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: ProductDiscountUpdateAction[]}
) {
  return base.updateProductDiscountById(apiRoot, context.projectKey, params);
}

/**
 * Updates a product discount by key
 */
export function updateProductDiscountByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: ProductDiscountUpdateAction[]}
) {
  return base.updateProductDiscountByKey(apiRoot, context.projectKey, params);
}

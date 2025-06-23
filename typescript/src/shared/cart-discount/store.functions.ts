import {z} from 'zod';
import {
  readCartDiscountParameters,
  createCartDiscountParameters,
  updateCartDiscountParameters,
} from './parameters';
import {
  ApiRoot,
  CartDiscountDraft,
  CartDiscountUpdateAction,
} from '@commercetools/platform-sdk';
import {
  readCartDiscountById,
  readCartDiscountByKey,
  queryCartDiscounts,
  createCartDiscount as createBaseCartDiscount,
  updateCartDiscountById,
  updateCartDiscountByKey,
} from './base.functions';
import {SDKError} from '../errors/sdkError';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readCartDiscount = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCartDiscountParameters>
) => {
  try {
    // Ensure we always use the store from context
    const storeKey = context.storeKey;

    // If ID is provided, fetch by ID
    if (params.id) {
      return await readCartDiscountById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand,
        storeKey
      );
    }

    // If key is provided, fetch by key
    if (params.key) {
      return await readCartDiscountByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand,
        storeKey
      );
    }

    // Otherwise, fetch a list of cart discounts based on query parameters
    return await queryCartDiscounts(
      apiRoot,
      context.projectKey,
      params.limit,
      params.offset,
      params.sort,
      params.where,
      params.expand,
      storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read cart discount', error);
  }
};

export const createCartDiscount = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCartDiscountParameters>
) => {
  try {
    // Use storeKey from context, ignore storeKey from params if any
    const {storeKey: _, ...cartDiscountDraft} = params;

    return await createBaseCartDiscount(
      apiRoot,
      context.projectKey,
      cartDiscountDraft as CartDiscountDraft,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to create cart discount', error);
  }
};

export const updateCartDiscount = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCartDiscountParameters>
) => {
  try {
    // Use storeKey from context, ignore storeKey from params if any
    const {storeKey: _, ...updateParams} = params;

    if (updateParams.id) {
      return await updateCartDiscountById(
        apiRoot,
        context.projectKey,
        updateParams.id,
        updateParams.version,
        updateParams.actions as CartDiscountUpdateAction[],
        context.storeKey
      );
    }

    if (updateParams.key) {
      return await updateCartDiscountByKey(
        apiRoot,
        context.projectKey,
        updateParams.key,
        updateParams.version,
        updateParams.actions as CartDiscountUpdateAction[],
        context.storeKey
      );
    }

    throw new Error(
      'Either id or key must be provided to update a cart discount'
    );
  } catch (error: any) {
    throw new SDKError('Failed to update cart discount', error);
  }
};

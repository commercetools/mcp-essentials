import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {
  queryCarts,
  readCartById,
  readCartByKey,
  updateCartById,
  updateCartByKey,
  verifyCartBelongsToCustomer,
  createCart as baseCreateCart,
  replicateCart as baseReplicateCart,
} from './base.functions';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }
    // Case 0: If context.cartId is provided, always return that cart
    if (context.cartId) {
      const cart = await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        params.expand
      );
      if (cart.customerId === context.customerId) {
        return cart;
      } else {
        throw new SDKError('Cart not found', {});
      }
    }

    // Case 1: When context.customerId is present but no cartId
    if (params.where) {
      const whereWithCustomerId = [...params.where];
      whereWithCustomerId.push(`customerId="${context.customerId}"`);

      return await queryCarts(
        apiRoot,
        context.projectKey,
        whereWithCustomerId,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }
    const whereWithCustomerId = [`customerId="${context.customerId}"`];
    // Default to querying by customerId if no specific query method was provided
    return await queryCarts(
      apiRoot,
      context.projectKey,
      whereWithCustomerId,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read cart', error);
  }
};

export const createCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    // Ensure customerId is set to the context's customerId
    const cartDraft = {
      ...params,
      customerId: context.customerId,
    } as CartDraft;

    // Use base function to create cart
    return await baseCreateCart(
      apiRoot,
      context.projectKey,
      cartDraft,
      params.store?.key
    );
  } catch (error: any) {
    throw new SDKError('Failed to create cart', error);
  }
};

export const replicateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    // Verify that the cart to be replicated belongs to the customer
    const isCustomerCart = await verifyCartBelongsToCustomer(
      apiRoot,
      context.projectKey,
      context.customerId,
      params.reference.id
    );

    if (!isCustomerCart) {
      throw new SDKError('Cannot replicate cart: not owned by customer', {
        statusCode: 403,
      });
    }

    // Use base function to replicate cart
    return await baseReplicateCart(
      apiRoot,
      context.projectKey,
      params.reference,
      params.key,
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to replicate cart', error);
  }
};

export const updateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    const cartId = context.cartId || params.id;
    const cartKey = params.key;

    // Verify the cart belongs to the customer if we have an ID or key
    if (cartId || cartKey) {
      const isCustomerCart = await verifyCartBelongsToCustomer(
        apiRoot,
        context.projectKey,
        context.customerId,
        cartId,
        cartKey
      );

      if (!isCustomerCart) {
        throw new SDKError('Cannot update cart: not owned by customer', {});
      }
    } else {
      throw new SDKError('Either cart ID or key must be provided', {});
    }

    // Handle the different combinations of id/key and store/no-store
    if (cartId) {
      return await updateCartById(
        apiRoot,
        context.projectKey,
        cartId,
        params.actions as CartUpdateAction[],
        params.storeKey
      );
    } else if (cartKey) {
      return await updateCartByKey(
        apiRoot,
        context.projectKey,
        cartKey,
        params.actions as CartUpdateAction[],
        params.storeKey
      );
    }

    throw new SDKError('Failed to update cart', {});
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};

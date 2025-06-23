import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  queryCarts,
  readCartById,
  readCartByKey,
  updateCartById,
  updateCartByKey,
  verifyCartBelongsToStore,
  createCart as baseCreateCart,
  replicateCart as baseReplicateCart,
} from './base.functions';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from './parameters';

export const readCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCartParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }
    // Case 0: If context.cartId is provided, always return that cart
    if (context.cartId) {
      const cart = await readCartById(
        apiRoot,
        context.projectKey,
        context.cartId,
        params.expand
      );
      if (cart.store?.key !== context.storeKey) {
        throw new SDKError('Cart not found', {});
      }
      return cart;
    }

    if (params.id) {
      const cart = await readCartById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
      if (cart.store?.key !== context.storeKey) {
        throw new SDKError('Cart not found', {});
      }
      return cart;
    }

    // Case 2b: Read cart by key
    if (params.key) {
      const cart = await readCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
      if (cart.store?.key !== context.storeKey) {
        throw new SDKError('Cart not found', {
          statusCode: 404,
        });
      }
      return cart;
    }

    // Case 2c: Read cart by customer ID
    if (params.customerId) {
      const whereWithCustomerId = [`customerId="${params.customerId}"`];
      return await queryCarts(
        apiRoot,
        context.projectKey,
        whereWithCustomerId,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        context.storeKey
      );
    }

    // Case 2d: Query carts with provided where conditions
    if (params.where) {
      return await queryCarts(
        apiRoot,
        context.projectKey,
        params.where,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        context.storeKey
      );
    }
    return await queryCarts(
      apiRoot,
      context.projectKey,
      undefined,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      context.storeKey
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
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Ensure the store key is set
    const cartDraft = {
      ...params,
      store: {
        key: context.storeKey,
        typeId: 'store',
      },
    } as CartDraft;

    // Use base function with store context
    return await baseCreateCart(
      apiRoot,
      context.projectKey,
      cartDraft,
      context.storeKey
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
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Verify that the cart to be replicated belongs to the store
    const isStoreCart = await verifyCartBelongsToStore(
      apiRoot,
      context.projectKey,
      context.storeKey,
      params.reference.id
    );

    if (!isStoreCart) {
      throw new SDKError('Cannot replicate cart: not from this store', {
        statusCode: 403,
      });
    }

    // Use base function to replicate cart
    return await baseReplicateCart(
      apiRoot,
      context.projectKey,
      params.reference,
      params.key,
      context.storeKey
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
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    const cartId = context.cartId || params.id;
    const cartKey = params.key;

    // Verify the cart belongs to the store if we have an ID or key
    if (cartId || cartKey) {
      const isStoreCart = await verifyCartBelongsToStore(
        apiRoot,
        context.projectKey,
        context.storeKey,
        cartId,
        cartKey
      );

      if (!isStoreCart) {
        throw new SDKError('Cannot update cart: not from this store', {
          statusCode: 403,
        });
      }
    } else {
      throw new SDKError('Either cart ID or key must be provided', {});
    }

    // Always use in-store endpoint when we have store context
    if (cartId) {
      return await updateCartById(
        apiRoot,
        context.projectKey,
        cartId,
        params.actions as CartUpdateAction[],
        context.storeKey
      );
    } else if (cartKey) {
      return await updateCartByKey(
        apiRoot,
        context.projectKey,
        cartKey,
        params.actions as CartUpdateAction[],
        context.storeKey
      );
    }

    throw new SDKError('Failed to update cart', {});
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};

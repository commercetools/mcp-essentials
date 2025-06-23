import {z} from 'zod';
import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from './parameters';
import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
  CartReference,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  queryCarts,
  readCartById,
  readCartByKey,
  updateCartById,
  updateCartByKey,
} from './base.functions';

export const readCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string; cartId?: string; customerId?: string},
  params: z.infer<typeof readCartParameters>
) => {
  try {
    // Case 2a: Read cart by ID
    if (params.id) {
      return await readCartById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // Case 2b: Read cart by key
    if (params.key) {
      const cart = await readCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
      return cart;
    }

    const whereWithCustomerId = [`customerId="${params.customerId}"`];

    // Case 2c: Read cart by customer ID
    if (params.customerId) {
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
        params.storeKey
      );
    }

    throw new Error(
      'Invalid parameters: At least one of id, key, customerId, or where must be provided'
    );
  } catch (error: any) {
    throw new SDKError('Failed to read cart', error);
  }
};

export const createCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCartParameters>
) => {
  try {
    let cart;

    if (params.store?.key) {
      // Using in-store endpoint
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.store.key})
        .carts()
        .post({
          body: params as CartDraft,
        })
        .execute();
    } else {
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .post({
          body: params as CartDraft,
        })
        .execute();
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to create cart', error);
  }
};

export const replicateCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    let cart;

    if (params.storeKey) {
      // Using in-store endpoint
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .carts()
        .replicate()
        .post({
          body: {
            reference: params.reference,
            ...(params.key && {key: params.key}),
          },
        })
        .execute();
    } else {
      cart = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .carts()
        .replicate()
        .post({
          body: {
            reference: params.reference,
            ...(params.key && {key: params.key}),
          },
        })
        .execute();
    }

    return cart.body;
  } catch (error: any) {
    throw new SDKError('Failed to replicate cart', error);
  }
};

export const updateCart = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    // Handle the different combinations of id/key and store/no-store
    if (params.id) {
      return await updateCartById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as CartUpdateAction[],
        params.storeKey
      );
    } else if (params.key) {
      return await updateCartByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as CartUpdateAction[],
        params.storeKey
      );
    } else {
      throw new Error('Either id or key must be provided');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update cart', error);
  }
};

import {
  ApiRoot,
  OrderFromCartDraft,
  OrderFromQuoteDraft,
  OrderUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {updateOrderById, updateOrderByOrderNumber} from './base.functions';
import {
  createOrderParameters,
  readOrderParameters,
  updateOrderParameters,
} from './parameters';

// Helper function to handle reading an order by ID in a specific store
export const readOrderByIdInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    id: string;
    storeKey: string;
    expand?: string[];
  }
) => {
  const orderInStore = apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
    .orders()
    .withId({ID: params.id});

  if (params.expand) {
    const response = await orderInStore
      .get({
        queryArgs: {
          expand: params.expand,
        },
      })
      .execute();
    return response.body;
  } else {
    const response = await orderInStore.get().execute();
    return response.body;
  }
};

// Helper function to handle reading an order by orderNumber in a specific store
export const readOrderByOrderNumberInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    orderNumber: string;
    storeKey: string;
    expand?: string[];
  }
) => {
  const orderInStore = apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
    .orders()
    .withOrderNumber({orderNumber: params.orderNumber});

  if (params.expand) {
    const response = await orderInStore
      .get({
        queryArgs: {
          expand: params.expand,
        },
      })
      .execute();
    return response.body;
  } else {
    const response = await orderInStore.get().execute();
    return response.body;
  }
};

// Helper function to handle querying orders within a specific store
export const queryOrdersInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: {
    where: string[];
    storeKey: string;
    limit?: number;
    offset?: number;
    sort?: string[];
    expand?: string[];
  }
) => {
  const ordersInStore = await apiRoot
    .withProjectKey({projectKey: context.projectKey})
    .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
    .orders()
    .get({
      queryArgs: {
        where: params.where,
        limit: params.limit || 10,
        ...(params.offset && {offset: params.offset}),
        ...(params.sort && {sort: params.sort}),
        ...(params.expand && {expand: params.expand}),
      },
    })
    .execute();
  return ordersInStore.body;
};

// Main function to read orders in a store context
export const readStoreOrder = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readOrderParameters> & {storeKey: string}
) => {
  try {
    // If id is provided, get by ID
    if (params.id) {
      return await readOrderByIdInStore(apiRoot, context, {
        id: params.id,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // If orderNumber is provided, get by orderNumber
    if (params.orderNumber) {
      return await readOrderByOrderNumberInStore(apiRoot, context, {
        orderNumber: params.orderNumber,
        storeKey: params.storeKey,
        expand: params.expand,
      });
    }

    // Otherwise, query orders
    return await queryOrdersInStore(apiRoot, context, {
      where: params.where || [],
      storeKey: params.storeKey,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      expand: params.expand,
    });
  } catch (error: any) {
    throw new SDKError('Failed to read order in store', error);
  }
};

// Create order from cart in a specific store
export const createOrderInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createOrderParameters> & {storeKey: string}
) => {
  try {
    if (params.quoteId) {
      const orderDraft: OrderFromQuoteDraft = {
        quote: {
          id: params.quoteId,
          typeId: 'quote',
        },
        version: params.version,
        ...(params.orderNumber && {orderNumber: params.orderNumber}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
        .orders()
        .post({
          body: orderDraft,
        })
        .execute();

      return response.body;
    }
    const orderDraft: OrderFromCartDraft = {
      cart: {
        id: params.id || '',
        typeId: 'cart',
      },
      version: params.version,
      ...(params.orderNumber && {orderNumber: params.orderNumber}),
    };

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey: params.storeKey})
      .orders()
      .post({
        body: orderDraft,
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to create order in store', error);
  }
};

// Update order by ID in a specific store
export const updateOrderByIdInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateOrderParameters> & {
    id: string;
    storeKey: string;
  }
) => {
  try {
    return await updateOrderById(
      apiRoot,
      context.projectKey,
      params.id,
      params.actions as OrderUpdateAction[],
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to update order by ID in store', error);
  }
};

// Update order by orderNumber in a specific store
export const updateOrderByOrderNumberInStore = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateOrderParameters> & {
    orderNumber: string;
    storeKey: string;
  }
) => {
  try {
    return await updateOrderByOrderNumber(
      apiRoot,
      context.projectKey,
      params.orderNumber,
      params.actions as OrderUpdateAction[],
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError(
      'Failed to update order by order number in store',
      error
    );
  }
};

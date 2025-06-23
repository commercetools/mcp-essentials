import {ApiRoot, OrderUpdateAction} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readOrderById = async (
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
        .orders();
    } else {
      apiRequest = projectApiRoot.orders();
    }

    const order = await apiRequest
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError('Failed to read order by ID', error);
  }
};

export const readOrderByOrderNumber = async (
  apiRoot: ApiRoot,
  projectKey: string,
  orderNumber: string,
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
        .orders();
    } else {
      apiRequest = projectApiRoot.orders();
    }

    const order = await apiRequest
      .withOrderNumber({orderNumber})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError('Failed to read order by order number', error);
  }
};

export const updateOrderById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  actions: OrderUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the order to get the latest version
    const order = await readOrderById(
      apiRoot,
      projectKey,
      id,
      undefined,
      storeKey
    );
    const currentVersion = order.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .orders();
    } else {
      apiRequest = projectApiRoot.orders();
    }

    const updatedOrder = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedOrder.body;
  } catch (error: any) {
    throw new SDKError('Failed to update order by ID', error);
  }
};

export const updateOrderByOrderNumber = async (
  apiRoot: ApiRoot,
  projectKey: string,
  orderNumber: string,
  actions: OrderUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the order to get the latest version
    const order = await readOrderByOrderNumber(
      apiRoot,
      projectKey,
      orderNumber,
      undefined,
      storeKey
    );
    const currentVersion = order.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .orders();
    } else {
      apiRequest = projectApiRoot.orders();
    }

    const updatedOrder = await apiRequest
      .withOrderNumber({orderNumber})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedOrder.body;
  } catch (error: any) {
    throw new SDKError('Failed to update order by order number', error);
  }
};

// New function to query orders with where conditions
export const queryOrders = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
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
        .orders();
    } else {
      apiRequest = projectApiRoot.orders();
    }

    const orders = await apiRequest
      .get({
        queryArgs: {
          where,
          limit: limit || 10,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return orders.body;
  } catch (error: any) {
    throw new SDKError('Failed to query orders', error);
  }
};

// Function to verify order belongs to a customer
export const verifyOrderBelongsToCustomer = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerId: string,
  id?: string,
  orderNumber?: string,
  storeKey?: string
) => {
  try {
    // Build where conditions
    const whereConditions = [`customerId="${customerId}"`];

    if (id) {
      whereConditions.push(`id="${id}"`);
    } else if (orderNumber) {
      whereConditions.push(`orderNumber="${orderNumber}"`);
    } else {
      throw new Error('Either order ID or order number must be provided');
    }

    // Query using the conditions
    const result = await queryOrders(
      apiRoot,
      projectKey,
      whereConditions,
      1, // limit to 1 result
      undefined,
      undefined,
      undefined,
      storeKey
    );

    // If we found a matching order, it belongs to the customer
    return result.count > 0;
  } catch (error: any) {
    throw new SDKError('Failed to verify order ownership', error);
  }
};

// Associate Orders functions
export const readOrderByIdAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const order = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError('Failed to read order by ID as associate', error);
  }
};

export const readOrderByOrderNumberAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  orderNumber: string,
  expand?: string[]
) => {
  try {
    const order = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .withOrderNumber({orderNumber})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError(
      'Failed to read order by order number as associate',
      error
    );
  }
};

export const queryOrdersAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[]
) => {
  try {
    const orders = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .get({
        queryArgs: {
          ...(where && {where}),
          limit: limit || 10,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return orders.body;
  } catch (error: any) {
    throw new SDKError('Failed to query orders as associate', error);
  }
};

export const createOrderFromCartAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  cartId: string,
  version: number,
  orderNumber?: string
) => {
  try {
    const order = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .post({
        body: {
          id: cartId,
          version,
          ...(orderNumber && {orderNumber}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError('Failed to create order from cart as associate', error);
  }
};

export const createOrderFromQuoteAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  quoteId: string,
  version: number,
  orderNumber?: string
) => {
  try {
    const order = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .orderQuote()
      .post({
        body: {
          quote: {
            typeId: 'quote',
            id: quoteId,
          },
          version,
          ...(orderNumber && {orderNumber}),
        },
      })
      .execute();

    return order.body;
  } catch (error: any) {
    throw new SDKError('Failed to create order from quote as associate', error);
  }
};

export const updateOrderByIdAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  actions: OrderUpdateAction[]
) => {
  try {
    // First fetch the order to get the latest version
    const order = await readOrderByIdAsAssociate(
      apiRoot,
      projectKey,
      associateId,
      businessUnitKey,
      id
    );
    const currentVersion = order.version;

    const updatedOrder = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedOrder.body;
  } catch (error: any) {
    throw new SDKError('Failed to update order by ID as associate', error);
  }
};

export const updateOrderByOrderNumberAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  orderNumber: string,
  actions: OrderUpdateAction[]
) => {
  try {
    // First fetch the order to get the latest version
    const order = await readOrderByOrderNumberAsAssociate(
      apiRoot,
      projectKey,
      associateId,
      businessUnitKey,
      orderNumber
    );
    const currentVersion = order.version;

    const updatedOrder = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .orders()
      .withOrderNumber({orderNumber})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedOrder.body;
  } catch (error: any) {
    throw new SDKError(
      'Failed to update order by order number as associate',
      error
    );
  }
};

import {
  ApiRoot,
  CartDraft,
  CartUpdateAction,
  CartReference,
} from '@commercetools/platform-sdk';

export const readCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .withId({ID: id})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};
export const readCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .withKey({key})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

const queryCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  if (storeKey) {
    const carts = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .carts()
      .get({queryArgs})
      .execute();
    return carts.body;
  }
  const carts = await apiRoot
    .withProjectKey({projectKey})
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

// Helper function to query carts
export const queryCarts = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    ...(where && {where}),
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const carts = await queryCart(apiRoot, projectKey, queryArgs, storeKey);
    return carts;
  } else {
    const carts = await queryCart(apiRoot, projectKey, queryArgs);
    return carts;
  }
};

export const updateCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  actions: CartUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the cart to get the latest version
    const cart = await readCartById(apiRoot, projectKey, id);
    const currentVersion = cart.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .carts();
    } else {
      apiRequest = projectApiRoot.carts();
    }

    const updatedCart = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to update cart by ID: ${error.message}`);
  }
};

export const updateCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  actions: CartUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the cart to get the latest version
    const cart = await readCartByKey(apiRoot, projectKey, key);
    const currentVersion = cart.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .carts();
    } else {
      apiRequest = projectApiRoot.carts();
    }

    const updatedCart = await apiRequest
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to update cart by key: ${error.message}`);
  }
};

// New function for verifying cart ownership by customer
export const verifyCartBelongsToCustomer = async (
  apiRoot: ApiRoot,
  projectKey: string,
  customerId: string,
  cartId?: string,
  cartKey?: string
) => {
  let cart;

  if (cartId) {
    cart = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .withId({ID: cartId})
      .get()
      .execute();
  } else if (cartKey) {
    cart = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .withKey({key: cartKey})
      .get()
      .execute();
  } else {
    throw new Error('Either cart ID or key must be provided');
  }

  return cart.body.customerId === customerId;
};

// New function for verifying cart belongs to store
export const verifyCartBelongsToStore = async (
  apiRoot: ApiRoot,
  projectKey: string,
  storeKey: string,
  cartId?: string,
  cartKey?: string
) => {
  let cart;

  if (cartId) {
    cart = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .withId({ID: cartId})
      .get()
      .execute();
  } else if (cartKey) {
    cart = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .withKey({key: cartKey})
      .get()
      .execute();
  } else {
    throw new Error('Either cart ID or key must be provided');
  }

  return cart.body.store?.key === storeKey;
};

// New function for creating a cart
export const createCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  cartDraft: CartDraft,
  storeKey?: string
) => {
  if (storeKey) {
    // Using in-store endpoint
    const cart = await apiRoot
      .withProjectKey({projectKey})
      .inStoreKeyWithStoreKeyValue({storeKey})
      .carts()
      .post({
        body: cartDraft,
      })
      .execute();
    return cart.body;
  } else {
    const cart = await apiRoot
      .withProjectKey({projectKey})
      .carts()
      .post({
        body: cartDraft,
      })
      .execute();
    return cart.body;
  }
};

// New function for replicating a cart
export const replicateCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  reference: CartReference,
  key?: string,
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
        .carts();
    } else {
      apiRequest = projectApiRoot.carts();
    }

    const replicatedCart = await apiRequest
      .replicate()
      .post({
        body: {
          reference,
          ...(key && {key}),
        },
      })
      .execute();

    return replicatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to replicate cart: ${error.message}`);
  }
};

// Associate Cart Functions
export const readAssociateCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .asAssociate()
    .withAssociateIdValue({associateId})
    .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
    .carts()
    .withId({ID: id})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

export const readAssociateCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  key: string,
  expand?: string[]
) => {
  const cart = await apiRoot
    .withProjectKey({projectKey})
    .asAssociate()
    .withAssociateIdValue({associateId})
    .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
    .carts()
    .withKey({key})
    .get({
      queryArgs: {
        ...(expand && {expand}),
      },
    })
    .execute();
  return cart.body;
};

export const queryAssociateCarts = async (
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
  const queryArgs = {
    ...(where && {where}),
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  const carts = await apiRoot
    .withProjectKey({projectKey})
    .asAssociate()
    .withAssociateIdValue({associateId})
    .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
    .carts()
    .get({queryArgs})
    .execute();
  return carts.body;
};

export const createAssociateCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  cartDraft: CartDraft
) => {
  try {
    const cart = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .carts()
      .post({
        body: cartDraft,
      })
      .execute();
    return cart.body;
  } catch (error: any) {
    throw new Error(`Failed to create associate cart: ${error.message}`);
  }
};

export const updateAssociateCartById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  actions: CartUpdateAction[]
) => {
  try {
    // First fetch the cart to get the latest version
    const cart = await readAssociateCartById(
      apiRoot,
      projectKey,
      associateId,
      businessUnitKey,
      id
    );
    const currentVersion = cart.version;

    const updatedCart = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .carts()
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to update associate cart by ID: ${error.message}`);
  }
};

export const updateAssociateCartByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  key: string,
  actions: CartUpdateAction[]
) => {
  try {
    // First fetch the cart to get the latest version
    const cart = await readAssociateCartByKey(
      apiRoot,
      projectKey,
      associateId,
      businessUnitKey,
      key
    );
    const currentVersion = cart.version;

    const updatedCart = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .carts()
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to update associate cart by key: ${error.message}`);
  }
};

export const replicateAssociateCart = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  reference: CartReference,
  key?: string
) => {
  try {
    const replicatedCart = await apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .carts()
      .replicate()
      .post({
        body: {
          reference,
          ...(key && {key}),
        },
      })
      .execute();

    return replicatedCart.body;
  } catch (error: any) {
    throw new Error(`Failed to replicate associate cart: ${error.message}`);
  }
};

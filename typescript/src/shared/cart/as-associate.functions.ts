import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {z} from 'zod';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from './parameters';
import {
  readAssociateCartById,
  readAssociateCartByKey,
  queryAssociateCarts,
  createAssociateCart,
  updateAssociateCartById,
  updateAssociateCartByKey,
  replicateAssociateCart,
} from './base.functions';
import {SDKError} from '../errors/sdkError';

export const readCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCartParameters>
) => {
  try {
    const {projectKey, customerId, businessUnitKey} = context;
    const {id, key, where, limit, offset, sort, expand} = params;

    if (!customerId) {
      throw new SDKError(
        'Customer ID is required for associate cart operations',
        {}
      );
    }

    if (!businessUnitKey) {
      throw new SDKError(
        'Business Unit Key is required for associate cart operations',
        {}
      );
    }

    // If specific cart ID or key is provided, fetch that cart
    if (id) {
      return await readAssociateCartById(
        apiRoot,
        projectKey,
        customerId,
        businessUnitKey,
        id,
        expand
      );
    }

    if (key) {
      return await readAssociateCartByKey(
        apiRoot,
        projectKey,
        customerId,
        businessUnitKey,
        key,
        expand
      );
    }

    // Otherwise, query carts
    return await queryAssociateCarts(
      apiRoot,
      projectKey,
      customerId,
      businessUnitKey,
      where,
      limit,
      offset,
      sort,
      expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read associate cart', error);
  }
};

export const createCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCartParameters>
) => {
  try {
    const {projectKey, customerId, businessUnitKey} = context;

    if (!customerId) {
      throw new SDKError(
        'Customer ID is required for associate cart operations',
        {}
      );
    }

    if (!businessUnitKey) {
      throw new SDKError(
        'Business Unit Key is required for associate cart operations',
        {}
      );
    }

    const cartDraft = {
      ...params,
      customerId,
      businessUnit: {
        typeId: 'business-unit' as const,
        key: businessUnitKey,
      },
    };

    return await createAssociateCart(
      apiRoot,
      projectKey,
      customerId,
      businessUnitKey,
      cartDraft as any
    );
  } catch (error: any) {
    throw new SDKError('Failed to create associate cart', error);
  }
};

export const updateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCartParameters>
) => {
  try {
    const {projectKey, customerId, businessUnitKey} = context;
    const {id, key, actions} = params;

    if (!customerId) {
      throw new SDKError(
        'Customer ID is required for associate cart operations',
        {}
      );
    }

    if (!businessUnitKey) {
      throw new SDKError(
        'Business Unit Key is required for associate cart operations',
        {}
      );
    }

    if (!actions || actions.length === 0) {
      throw new SDKError(
        'At least one action is required to update a cart',
        {}
      );
    }

    if (id) {
      return await updateAssociateCartById(
        apiRoot,
        projectKey,
        customerId,
        businessUnitKey,
        id,
        actions as any
      );
    }

    if (key) {
      return await updateAssociateCartByKey(
        apiRoot,
        projectKey,
        customerId,
        businessUnitKey,
        key,
        actions as any
      );
    }

    throw new SDKError('Either cart ID or key must be provided', {});
  } catch (error: any) {
    throw new SDKError('Failed to update associate cart', error);
  }
};

export const replicateCart = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof replicateCartParameters>
) => {
  try {
    const {projectKey, customerId, businessUnitKey} = context;
    const {reference, key} = params;

    if (!customerId) {
      throw new SDKError(
        'Customer ID is required for associate cart operations',
        {}
      );
    }

    if (!businessUnitKey) {
      throw new SDKError(
        'Business Unit Key is required for associate cart operations',
        {}
      );
    }

    return await replicateAssociateCart(
      apiRoot,
      projectKey,
      customerId,
      businessUnitKey,
      reference,
      key
    );
  } catch (error: any) {
    throw new SDKError('Failed to replicate associate cart', error);
  }
};

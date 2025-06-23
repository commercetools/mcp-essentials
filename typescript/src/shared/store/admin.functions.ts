import {
  ApiRoot,
  StoreDraft,
  StoreUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {
  queryStores,
  readStoreById,
  readStoreByKey,
  createStore as baseCreateStore,
  updateStoreById,
  updateStoreByKey,
} from './base.functions';
import {
  readStoreParameters,
  createStoreParameters,
  updateStoreParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readStore = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readStoreParameters>
) => {
  try {
    if (!context.isAdmin) {
      throw new SDKError('Admin access required', {
        statusCode: 403,
      });
    }

    // Case 1: Read by ID
    if (params.id) {
      return await readStoreById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // Case 2: Read by key
    if (params.key) {
      return await readStoreByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Case 3: Query stores
    return await queryStores(
      apiRoot,
      context.projectKey,
      params.where,
      params.limit,
      params.offset,
      params.sort,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read store', error);
  }
};

export const createStore = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createStoreParameters>
) => {
  try {
    if (!context.isAdmin) {
      throw new SDKError('Admin access required', {
        statusCode: 403,
      });
    }

    const storeDraft: StoreDraft = {
      key: params.key,
      name: params.name,
      ...(params.languages && {languages: params.languages}),
      ...(params.countries && {countries: params.countries}),
      ...(params.distributionChannels && {
        distributionChannels: params.distributionChannels,
      }),
      ...(params.supplyChannels && {supplyChannels: params.supplyChannels}),
      ...(params.productSelections && {
        productSelections: params.productSelections,
      }),
      ...(params.custom && {custom: params.custom}),
    };

    return await baseCreateStore(apiRoot, context.projectKey, storeDraft);
  } catch (error: any) {
    throw new SDKError('Failed to create store', error);
  }
};

export const updateStore = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateStoreParameters>
) => {
  try {
    if (!context.isAdmin) {
      throw new SDKError('Admin access required', {
        statusCode: 403,
      });
    }

    if (params.id) {
      return await updateStoreById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as StoreUpdateAction[]
      );
    } else if (params.key) {
      return await updateStoreByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as StoreUpdateAction[]
      );
    } else {
      throw new SDKError('Either store ID or key must be provided', {
        statusCode: 400,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to update store', error);
  }
};

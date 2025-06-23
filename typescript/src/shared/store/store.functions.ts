import {ApiRoot, StoreUpdateAction} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {SDKError} from '../errors/sdkError';
import {
  queryStores,
  readStoreById,
  readStoreByKey,
  updateStoreById,
  updateStoreByKey,
} from './base.functions';
import {readStoreParameters, updateStoreParameters} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readStore = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readStoreParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {
        statusCode: 400,
      });
    }

    // Case 1: Read by ID
    if (params.id) {
      const store = await readStoreById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );

      // Verify this is the store in context
      if (store.key !== context.storeKey) {
        throw new SDKError('Store not found', {
          statusCode: 404,
        });
      }

      return store;
    }

    // Case 2: Read by key
    if (params.key) {
      return await readStoreByKey(
        apiRoot,
        context.projectKey,
        context.storeKey,
        params.expand
      );
    }

    // Case 3: Query stores - limit to current store
    const whereWithStoreKey = params.where ? [...params.where] : [];
    whereWithStoreKey.push(`key="${context.storeKey}"`);

    return await queryStores(
      apiRoot,
      context.projectKey,
      whereWithStoreKey,
      params.limit,
      params.offset,
      params.sort,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read store', error);
  }
};

export const updateStore = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateStoreParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {
        statusCode: 400,
      });
    }

    const result = await updateStoreByKey(
      apiRoot,
      context.projectKey,
      context.storeKey,
      params.actions as StoreUpdateAction[]
    );

    return result;
  } catch (error: any) {
    throw new SDKError('Failed to update store', error);
  }
};

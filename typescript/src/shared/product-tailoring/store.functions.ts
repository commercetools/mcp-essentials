import z from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  readProductTailoringById,
  readProductTailoringByKey,
  readProductTailoringByProductId,
  readProductTailoringByProductKey,
  queryProductTailoringInStore,
  createProductTailoring,
  updateProductTailoringById,
  updateProductTailoringByKey,
} from './base.functions';
import {
  createProductTailoringParameters,
  readProductTailoringParameters,
} from './parameters';

/**
 * Store function to read product tailoring
 * Store context automatically filters by store key
 */
export async function readProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readProductTailoringParameters>
) {
  try {
    if (params.id) {
      return await readProductTailoringById(
        apiRoot,
        context.projectKey,
        params
      );
    } else if (params.key) {
      return await readProductTailoringByKey(
        apiRoot,
        context.projectKey,
        params
      );
    } else if (params.productId) {
      return await readProductTailoringByProductId(
        apiRoot,
        context.projectKey,
        params
      );
    } else if (params.productKey) {
      return await readProductTailoringByProductKey(
        apiRoot,
        context.projectKey,
        params
      );
    } else {
      // Query product tailoring entries in the store
      return await queryProductTailoringInStore(
        apiRoot,
        context.projectKey,
        params
      );
    }
  } catch (error) {
    throw new SDKError('Failed to read product tailoring', error);
  }
}

/**
 * Store function to create product tailoring
 * Store context automatically applies store key
 */
export async function createProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductTailoringParameters>
) {
  try {
    return await createProductTailoring(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Failed to create product tailoring', error);
  }
}

/**
 * Store function to update product tailoring
 * Store context automatically applies store key
 */
export async function updateProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: any
) {
  try {
    if (params.id) {
      return await updateProductTailoringById(
        apiRoot,
        context.projectKey,
        params
      );
    } else if (params.key) {
      return await updateProductTailoringByKey(
        apiRoot,
        context.projectKey,
        params
      );
    } else {
      throw new Error(
        'Either ID, key, or product ID/key must be provided to update product tailoring'
      );
    }
  } catch (error) {
    throw new SDKError('Failed to update product tailoring', error);
  }
}

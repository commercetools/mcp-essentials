import z from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  readProductTailoringById,
  readProductTailoringByKey,
  readProductTailoringByProductId,
  readProductTailoringByProductKey,
  queryProductTailoring,
  createProductTailoring,
  updateProductTailoringById,
  updateProductTailoringByKey,
} from './base.functions';
import {
  createProductTailoringParameters,
  readProductTailoringParameters,
  updateProductTailoringParameters,
} from './parameters';

/**
 * Customer function to read product tailoring
 * Customers can only read product tailoring for products they have access to
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
    } else if (params.productKey && params.storeKey) {
      return await readProductTailoringByProductKey(
        apiRoot,
        context.projectKey,
        params
      );
    } else {
      // Query product tailoring entries - customers may have limited access
      return await queryProductTailoring(apiRoot, context.projectKey, params);
    }
  } catch (error) {
    throw new SDKError('Failed to read product tailoring', error);
  }
}

/**
 * Customer function to create product tailoring
 * Customers can create product tailoring for products they have access to
 */
export async function createProductTailoringEntry(
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
 * Customer function to update product tailoring
 * Customers can update product tailoring for products they have access to
 */
export async function updateProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductTailoringParameters>
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
        params as any
      );
    } else {
      throw new Error(
        'Either ID, key, or product ID/key with store key must be provided to update product tailoring'
      );
    }
  } catch (error) {
    throw new SDKError('Failed to update product tailoring', error);
  }
}

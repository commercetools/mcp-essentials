import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  readProductTailoringById,
  readProductTailoringByKey,
  readProductTailoringByProductId,
  readProductTailoringByProductKey,
  queryProductTailoring,
  createProductTailoring as baseCreateProductTailoring,
  updateProductTailoringById,
  updateProductTailoringByKey,
} from './base.functions';

/**
 * Admin function to read product tailoring by ID
 */
export async function readProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: any
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
    } else if (params.productId && params.storeKey) {
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
      // Query all product tailoring entries
      return await queryProductTailoring(apiRoot, context.projectKey, params);
    }
  } catch (error) {
    throw new SDKError('Failed to read product tailoring', error);
  }
}

/**
 * Admin function to create product tailoring
 */
export async function createProductTailoring(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: any
) {
  try {
    return await baseCreateProductTailoring(
      apiRoot,
      context.projectKey,
      params
    );
  } catch (error) {
    throw new SDKError('Failed to create product tailoring', error);
  }
}

/**
 * Admin function to update product tailoring
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
      throw new SDKError(
        'Either ID, key, or product ID/key with store key must be provided to update product tailoring'
      );
    }
  } catch (error) {
    throw new SDKError('Failed to update product tailoring', error);
  }
}

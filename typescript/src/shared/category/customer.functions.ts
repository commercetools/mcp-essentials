import {z} from 'zod';
import {readCategoryParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readCategoryById,
  readCategoryByKey,
  queryCategories,
} from './base.functions';
import {SDKError} from '../errors/sdkError';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readCategory = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCategoryParameters>
) => {
  try {
    // If ID is provided, fetch by ID
    if (params.id) {
      return await readCategoryById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // If key is provided, fetch by key
    if (params.key) {
      return await readCategoryByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Otherwise, fetch a list of categories based on query parameters
    return await queryCategories(
      apiRoot,
      context.projectKey,
      params.limit,
      params.offset,
      params.sort,
      params.where,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read category', error);
  }
};

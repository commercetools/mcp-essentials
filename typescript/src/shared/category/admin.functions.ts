import {z} from 'zod';
import {
  readCategoryParameters,
  createCategoryParameters,
  updateCategoryParameters,
} from './parameters';
import {
  ApiRoot,
  CategoryDraft,
  CategoryUpdateAction,
} from '@commercetools/platform-sdk';
import {
  readCategoryById,
  readCategoryByKey,
  queryCategories,
  createCategory as createBaseCategory,
  updateCategoryById,
  updateCategoryByKey,
} from './base.functions';
import {SDKError} from '../errors/sdkError';

export const readCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
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

export const createCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCategoryParameters>
) => {
  try {
    return await createBaseCategory(
      apiRoot,
      context.projectKey,
      params as CategoryDraft
    );
  } catch (error: any) {
    throw new SDKError('Failed to create category', error);
  }
};

export const updateCategory = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCategoryParameters>
) => {
  try {
    if (params.id) {
      return await updateCategoryById(
        apiRoot,
        context.projectKey,
        params.id,
        params.version,
        params.actions as CategoryUpdateAction[]
      );
    }

    if (params.key) {
      return await updateCategoryByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.version,
        params.actions as CategoryUpdateAction[]
      );
    }

    throw new Error('Either id or key must be provided to update a category');
  } catch (error: any) {
    throw new SDKError('Failed to update category', error);
  }
};

import {z} from 'zod';
import {
  readProductSelectionById,
  readProductSelectionByKey,
  queryProductSelections,
  createProductSelectionBase,
  updateProductSelectionById,
  updateProductSelectionByKey,
} from './base.functions';
import {
  readProductSelectionParameters,
  createProductSelectionParameters,
  updateProductSelectionParameters,
} from './parameters';
import {
  ApiRoot,
  ProductSelectionUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export type ProjectContext = {
  projectKey: string;
  isAdmin?: boolean;
};

export const readProductSelection = (
  apiRoot: ApiRoot,
  context: ProjectContext,
  params: z.infer<typeof readProductSelectionParameters>
) => {
  if (!context.projectKey) {
    throw new SDKError(
      'Failed to read ProductSelection',
      new Error('Project key is required')
    );
  }

  if (params.id) {
    return readProductSelectionById(
      apiRoot,
      context.projectKey,
      params.id,
      params.expand
    );
  } else if (params.key) {
    return readProductSelectionByKey(
      apiRoot,
      context.projectKey,
      params.key,
      params.expand
    );
  } else {
    const queryArgs: any = {
      limit: params.limit || 10,
    };

    if (typeof params.offset !== 'undefined') {
      queryArgs.offset = params.offset;
    }

    if (params.sort) {
      queryArgs.sort = params.sort;
    }

    if (params.where) {
      queryArgs.where = params.where;
    }

    if (params.expand) {
      queryArgs.expand = params.expand;
    }

    return queryProductSelections(apiRoot, context.projectKey, queryArgs);
  }
};

export const createProductSelection = (
  apiRoot: ApiRoot,
  context: ProjectContext,
  params: z.infer<typeof createProductSelectionParameters>
) => {
  if (!context.projectKey) {
    throw new SDKError(
      'Failed to create ProductSelection',
      new Error('Project key is required')
    );
  }

  return createProductSelectionBase(apiRoot, context.projectKey, params);
};

export const updateProductSelection = (
  apiRoot: ApiRoot,
  context: ProjectContext,
  params: z.infer<typeof updateProductSelectionParameters>
) => {
  if (!context.projectKey) {
    throw new SDKError(
      'Failed to update ProductSelection',
      new Error('Project key is required')
    );
  }

  if (params.id) {
    return updateProductSelectionById(
      apiRoot,
      context.projectKey,
      params.id,
      params.version,
      params.actions as ProductSelectionUpdateAction[]
    );
  } else if (params.key) {
    return updateProductSelectionByKey(
      apiRoot,
      context.projectKey,
      params.key,
      params.version,
      params.actions as ProductSelectionUpdateAction[]
    );
  } else {
    throw new SDKError(
      'Failed to update ProductSelection',
      new Error(
        'Either id or key must be provided to update a ProductSelection'
      )
    );
  }
};

import {z} from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';
import {
  createTypeParameters,
  readTypeParameters,
  updateTypeParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads types based on provided parameters
 */
export function readType(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readTypeParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get type by ID
      return readTypeById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get type by key
      return readTypeByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List types
      return queryTypes(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading type', error);
  }
}

/**
 * Reads a type by ID
 */
export function readTypeById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readTypeById(apiRoot, context.projectKey, params);
}

/**
 * Reads a type by key
 */
export function readTypeByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readTypeByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists types
 */
export function queryTypes(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  return base.queryTypes(apiRoot, context.projectKey, params);
}

/**
 * Creates a new type
 */
export function createType(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createTypeParameters>
) {
  return base.createType(apiRoot, context.projectKey, params);
}

/**
 * Updates a type based on provided parameters
 */
export function updateType(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateTypeParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateTypeById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateTypeByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error('Either id or key must be provided for updating a type');
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating type', error);
  }
}

/**
 * Updates a type by ID
 */
export function updateTypeById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateTypeById(apiRoot, context.projectKey, params);
}

/**
 * Updates a type by key
 */
export function updateTypeByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateTypeByKey(apiRoot, context.projectKey, params);
}

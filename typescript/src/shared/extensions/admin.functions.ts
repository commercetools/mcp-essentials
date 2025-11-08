import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createExtensionParameters,
  readExtensionParameters,
  updateExtensionParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads extensions based on provided parameters
 */
export function readExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readExtensionParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get extension by ID
      return readExtensionById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get extension by key
      return readExtensionByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List extensions
      return queryExtensions(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Error reading extension', error);
  }
}

/**
 * Reads an extension by ID
 */
export function readExtensionById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readExtensionById(apiRoot, context.projectKey, params);
}

/**
 * Reads an extension by key
 */
export function readExtensionByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readExtensionByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists extensions
 */
export function queryExtensions(
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
  return base.queryExtensions(apiRoot, context.projectKey, params);
}

/**
 * Creates a new extension
 */
export function createExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createExtensionParameters>
) {
  return base.createExtension(apiRoot, context.projectKey, params);
}

/**
 * Updates an extension based on provided parameters
 */
export function updateExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateExtensionParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateExtensionById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateExtensionByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating an extension'
      );
    }
  } catch (error: any) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating extension', error);
  }
}

/**
 * Updates an extension by ID
 */
export function updateExtensionById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateExtensionById(apiRoot, context.projectKey, params);
}

/**
 * Updates an extension by key
 */
export function updateExtensionByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateExtensionByKey(apiRoot, context.projectKey, params);
}

import {z} from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';
import {
  createCustomObjectParameters,
  readCustomObjectParameters,
  updateCustomObjectParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads custom objects based on provided parameters
 */
export function readCustomObject(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCustomObjectParameters>
) {
  try {
    const {container, key} = params;

    if (container && key) {
      // Get custom object by container and key
      return readCustomObjectByContainerAndKey(apiRoot, context, {
        container,
        key,
        expand: params.expand,
      });
    } else if (container) {
      // List custom objects in container
      return queryCustomObjects(apiRoot, context, {
        container,
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    } else {
      throw new Error('Container must be provided for reading custom objects');
    }
  } catch (error) {
    throw new SDKError('Error reading custom object', error);
  }
}

/**
 * Reads a custom object by container and key
 */
export function readCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {container: string; key: string; expand?: string[]}
) {
  return base.readCustomObjectByContainerAndKey(
    apiRoot,
    context.projectKey,
    params
  );
}

/**
 * Lists custom objects in a container
 */
export function queryCustomObjects(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    container: string;
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  return base.queryCustomObjects(apiRoot, context.projectKey, params);
}

/**
 * Creates a new custom object
 */
export function createCustomObject(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCustomObjectParameters>
) {
  return base.createCustomObject(apiRoot, context.projectKey, params);
}

/**
 * Updates a custom object based on provided parameters
 */
export function updateCustomObject(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCustomObjectParameters>
) {
  try {
    const {container, key, version, value} = params;

    if (container && key) {
      // Update by container and key
      return updateCustomObjectByContainerAndKey(apiRoot, context, {
        container,
        key,
        version,
        value,
      });
    } else {
      throw new Error(
        'Both container and key must be provided for updating a custom object'
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating custom object', error);
  }
}

/**
 * Updates a custom object by container and key
 */
export function updateCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateCustomObjectParameters>
) {
  return base.updateCustomObjectByContainerAndKey(
    apiRoot,
    context.projectKey,
    params
  );
}

/**
 * Deletes a custom object by container and key
 */
export function deleteCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    container: string;
    key: string;
    version: number;
    dataErasure?: boolean;
  }
) {
  return base.deleteCustomObjectByContainerAndKey(
    apiRoot,
    context.projectKey,
    params
  );
}

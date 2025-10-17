import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createZoneParameters,
  readZoneParameters,
  updateZoneParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads zones based on provided parameters
 */
export async function readZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readZoneParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get zone by ID
      return await readZoneById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get zone by key
      return await readZoneByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List zones
      return await queryZones(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading zone', error);
  }
}

/**
 * Reads a zone by ID
 */
export async function readZoneById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  try {
    return await base.readZoneById(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error reading zone by ID', error);
  }
}

/**
 * Reads a zone by key
 */
export async function readZoneByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  try {
    return await base.readZoneByKey(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error reading zone by key', error);
  }
}

/**
 * Lists zones
 */
export async function queryZones(
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
  try {
    return await base.queryZones(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error querying zones', error);
  }
}

/**
 * Creates a new zone
 */
export async function createZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createZoneParameters>
) {
  try {
    return await base.createZone(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error creating zone', error);
  }
}

/**
 * Updates a zone based on provided parameters
 */
export async function updateZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateZoneParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return await updateZoneById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return await updateZoneByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new SDKError(
        'Either id or key must be provided for updating a zone',
        new Error('Missing required parameter')
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof SDKError) {
      throw error;
    }
    throw new SDKError('Error updating zone', error);
  }
}

/**
 * Updates a zone by ID
 */
export async function updateZoneById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    return await base.updateZoneById(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error updating zone by ID', error);
  }
}

/**
 * Updates a zone by key
 */
export async function updateZoneByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    return await base.updateZoneByKey(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error updating zone by key', error);
  }
}

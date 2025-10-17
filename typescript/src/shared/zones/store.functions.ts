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
 * Reads zones based on provided parameters (store context)
 * Note: Zones are typically not store-specific, but this provides a consistent interface
 */
export function readZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readZoneParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get zone by ID
      return base.readZoneById(apiRoot, context.projectKey, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get zone by key
      return base.readZoneByKey(apiRoot, context.projectKey, {
        key,
        expand: params.expand,
      });
    } else {
      // List zones
      return base.queryZones(apiRoot, context.projectKey, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to read zone', error);
  }
}

/**
 * Creates a new zone (store context)
 * Note: Zone creation is typically admin-only, but this provides a consistent interface
 */
export function createZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createZoneParameters>
) {
  try {
    return base.createZone(apiRoot, context.projectKey, params);
  } catch (error: any) {
    throw new SDKError('Failed to create zone', error);
  }
}

/**
 * Updates a zone based on provided parameters (store context)
 * Note: Zone updates are typically admin-only, but this provides a consistent interface
 */
export function updateZone(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateZoneParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return base.updateZoneById(apiRoot, context.projectKey, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return base.updateZoneByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error('Either id or key must be provided for updating a zone');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update zone', error);
  }
}

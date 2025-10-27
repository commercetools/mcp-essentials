import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createZoneParameters,
  readZoneParameters,
  updateZoneParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToZoneFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_zone: admin.readZone,
      create_zone: admin.createZone,
      update_zone: admin.updateZone,
    };
  }

  return {};
};

/**
 * Reads zones based on provided parameters:
 * - If 'id' is provided, retrieves a specific zone by ID
 * - If 'key' is provided, retrieves a specific zone by key
 * - If neither 'id' nor 'key' is provided, lists zones with optional filtering
 */
export function readZone(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readZoneParameters>
) {
  return admin.readZone(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new zone
 */
export function createZone(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createZoneParameters>
) {
  return admin.createZone(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates a zone based on provided parameters:
 * - If 'id' is provided, updates the zone by ID
 * - If 'key' is provided, updates the zone by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateZone(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateZoneParameters>
) {
  return admin.updateZone(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

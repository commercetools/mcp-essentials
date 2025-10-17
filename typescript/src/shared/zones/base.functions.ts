import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createZoneParameters,
  readZoneParameters,
  updateZoneParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a zone by ID
 */
export async function readZoneById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const zoneRequest = apiRoot
      .withProjectKey({projectKey})
      .zones()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await zoneRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading zone by ID', error);
  }
}

/**
 * Reads a zone by key
 */
export async function readZoneByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readZoneParameters>
) {
  try {
    const zoneRequest = apiRoot
      .withProjectKey({projectKey})
      .zones()
      .withKey({key: params.key as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await zoneRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading zone by key', error);
  }
}

/**
 * Lists zones
 */
export async function queryZones(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readZoneParameters>
) {
  try {
    const zoneRequest = apiRoot
      .withProjectKey({projectKey})
      .zones()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await zoneRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error querying zones', error);
  }
}

/**
 * Creates a new zone
 */
export async function createZone(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createZoneParameters>
) {
  try {
    const zoneDraft = {
      key: params.key,
      name: params.name,
      description: params.description,
      locations: params.locations,
    };

    const zoneRequest = apiRoot.withProjectKey({projectKey}).zones().post({
      body: zoneDraft,
    });

    const response = await zoneRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating zone', error);
  }
}

/**
 * Updates a zone by ID
 */
export async function updateZoneById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .zones()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating zone by ID', error);
  }
}

/**
 * Updates a zone by key
 */
export async function updateZoneByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .zones()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating zone by key', error);
  }
}

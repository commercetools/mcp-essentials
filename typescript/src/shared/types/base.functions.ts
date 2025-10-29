import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTypeParameters,
  readTypeParameters,
  updateTypeParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a type by ID
 */
export async function readTypeById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const typeRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await typeRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading type by ID', error);
  }
}

/**
 * Reads a type by key
 */
export async function readTypeByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const typeRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await typeRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading type by key', error);
  }
}

/**
 * Lists types
 */
export async function queryTypes(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  try {
    const typeRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await typeRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying types:', error);
    throw error;
  }
}

/**
 * Creates a new type
 */
export async function createType(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createTypeParameters>
) {
  try {
    const typeDraft = {
      key: params.key,
      name: params.name,
      description: params.description,
      resourceTypeIds: params.resourceTypeIds,
      fieldDefinitions: params.fieldDefinitions,
    };

    const typeRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
      .post({
        body: typeDraft,
      });

    const response = await typeRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating type', error);
  }
}

/**
 * Updates a type by ID
 */
export async function updateTypeById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
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
    throw new SDKError('Error updating type by ID', error);
  }
}

/**
 * Updates a type by key
 */
export async function updateTypeByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .types()
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
    throw new SDKError('Error updating type by key', error);
  }
}

import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createCustomObjectParameters,
  readCustomObjectParameters,
  updateCustomObjectParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a custom object by container and key
 */
export async function readCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readCustomObjectParameters>
) {
  try {
    const customObjectRequest = apiRoot
      .withProjectKey({projectKey})
      .customObjects()
      .withContainerAndKey({
        container: params.container!,
        key: params.key!,
      })
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await customObjectRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError(
      'Error reading custom object by container and key',
      error
    );
  }
}

/**
 * Lists custom objects in a container
 */
export async function queryCustomObjects(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    container: string;
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  try {
    const customObjectRequest = apiRoot
      .withProjectKey({projectKey})
      .customObjects()
      .withContainer({container: params.container})
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await customObjectRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying custom objects:', error);
    throw error;
  }
}

/**
 * Creates a new custom object
 */
export async function createCustomObject(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createCustomObjectParameters>
) {
  try {
    const customObjectDraft = {
      container: params.container,
      key: params.key,
      value: params.value,
    };

    const customObjectRequest = apiRoot
      .withProjectKey({projectKey})
      .customObjects()
      .post({
        body: customObjectDraft,
      });

    const response = await customObjectRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating custom object', error);
  }
}

/**
 * Updates a custom object by container and key
 */
export async function updateCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateCustomObjectParameters>
) {
  try {
    const customObjectDraft = {
      container: params.container,
      key: params.key,
      value: params.value,
    };

    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .customObjects()
      .post({
        body: customObjectDraft,
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError(
      'Error updating custom object by container and key',
      error
    );
  }
}

/**
 * Deletes a custom object by container and key
 */
export async function deleteCustomObjectByContainerAndKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    container: string;
    key: string;
    version: number;
    dataErasure?: boolean;
  }
) {
  try {
    const deleteRequest = apiRoot
      .withProjectKey({projectKey})
      .customObjects()
      .withContainerAndKey({
        container: params.container,
        key: params.key,
      })
      .delete({
        queryArgs: {
          version: params.version,
          dataErasure: params.dataErasure,
        },
      });

    const response = await deleteRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError(
      'Error deleting custom object by container and key',
      error
    );
  }
}

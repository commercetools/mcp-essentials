import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createExtensionParameters,
  readExtensionParameters,
  updateExtensionParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads an extension by ID
 */
export async function readExtensionById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readExtensionParameters>
) {
  try {
    const extensionRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .withId({ID: params.id!})
      .get();

    const response = await extensionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error reading extension by ID', error);
  }
}

/**
 * Reads an extension by key
 */
export async function readExtensionByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readExtensionParameters>
) {
  try {
    const extensionRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .withKey({key: params.key!})
      .get();

    const response = await extensionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error reading extension by key', error);
  }
}

/**
 * Lists extensions
 */
export async function queryExtensions(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readExtensionParameters>
) {
  try {
    const extensionRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await extensionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error querying extensions', error);
  }
}

/**
 * Creates a new extension
 */
export async function createExtension(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createExtensionParameters>
) {
  try {
    const extensionDraft = {
      key: params.key!,
      destination: params.destination as any,
      triggers: params.triggers,
      timeoutInMs: params.timeoutInMs,
    };

    const extensionRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .post({
        body: extensionDraft,
      });

    const response = await extensionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error creating extension', error);
  }
}

/**
 * Updates an extension by ID
 */
export async function updateExtensionById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error updating extension by ID', error);
  }
}

/**
 * Updates an extension by key
 */
export async function updateExtensionByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .extensions()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error updating extension by key', error);
  }
}

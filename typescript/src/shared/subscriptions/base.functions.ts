import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createSubscriptionParameters,
  readSubscriptionParameters,
  updateSubscriptionParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a subscription by ID
 */
export async function readSubscriptionById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readSubscriptionParameters>
) {
  try {
    const subscriptionRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
      .withId({ID: params.id!})
      .get();

    const response = await subscriptionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error reading subscription by ID', error);
  }
}

/**
 * Reads a subscription by key
 */
export async function readSubscriptionByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readSubscriptionParameters>
) {
  try {
    const subscriptionRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
      .withKey({key: params.key!})
      .get();

    const response = await subscriptionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error reading subscription by key', error);
  }
}

/**
 * Lists subscriptions
 */
export async function querySubscriptions(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readSubscriptionParameters>
) {
  try {
    const subscriptionRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await subscriptionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error querying subscriptions', error);
  }
}

/**
 * Creates a new subscription
 */
export async function createSubscription(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createSubscriptionParameters>
) {
  try {
    const subscriptionDraft = {
      key: params.key!,
      destination: params.destination as any,
      changes: params.changes,
      messages: params.messages,
      format: params.format,
    };

    const subscriptionRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
      .post({
        body: subscriptionDraft,
      });

    const response = await subscriptionRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error creating subscription', error);
  }
}

/**
 * Updates a subscription by ID
 */
export async function updateSubscriptionById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
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
    throw new SDKError('Error updating subscription by ID', error);
  }
}

/**
 * Updates a subscription by key
 */
export async function updateSubscriptionByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .subscriptions()
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
    throw new SDKError('Error updating subscription by key', error);
  }
}

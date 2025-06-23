import {
  ApiRoot,
  ChannelDraft,
  ChannelUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readChannelById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read channel by ID', error);
  }
};

export const readChannelByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read channel by key', error);
  }
};

export const queryChannels = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .get({
        queryArgs: {
          limit: limit || 20,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(where && {where}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to query channels', error);
  }
};

export const createChannel = async (
  apiRoot: ApiRoot,
  projectKey: string,
  channelDraft: ChannelDraft
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .post({
        body: channelDraft,
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to create channel', error);
  }
};

export const updateChannelById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: ChannelUpdateAction[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to update channel by ID', error);
  }
};

export const updateChannelByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  version: number,
  actions: ChannelUpdateAction[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .channels()
      .withKey({key})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to update channel by key', error);
  }
};

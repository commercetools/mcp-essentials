import {z} from 'zod';
import {
  readChannelParameters,
  createChannelParameters,
  updateChannelParameters,
} from './parameters';
import {
  ApiRoot,
  ChannelDraft,
  ChannelUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  readChannelById,
  readChannelByKey,
  queryChannels,
  createChannel as createChannelBase,
  updateChannelById,
  updateChannelByKey,
} from './base.functions';

export const readChannel = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readChannelParameters>
) => {
  try {
    // If ID is provided, fetch a specific channel by ID
    if (params.id) {
      return await readChannelById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // If key is provided, fetch a specific channel by key
    if (params.key) {
      return await readChannelByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Otherwise, query channels with filters
    return await queryChannels(
      apiRoot,
      context.projectKey,
      params.where,
      params.limit,
      params.offset,
      params.sort,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read channels', error);
  }
};

export const createChannel = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createChannelParameters>
) => {
  try {
    return await createChannelBase(
      apiRoot,
      context.projectKey,
      params as ChannelDraft
    );
  } catch (error: any) {
    throw new SDKError('Failed to create channel', error);
  }
};

export const updateChannel = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateChannelParameters>
) => {
  try {
    // Ensure one of id or key is provided
    if (!params.id && !params.key) {
      throw new Error(
        'Either id or key must be provided for updating a channel'
      );
    }

    if (params.id) {
      // Update by ID
      return await updateChannelById(
        apiRoot,
        context.projectKey,
        params.id,
        params.version,
        params.actions as ChannelUpdateAction[]
      );
    } else {
      // Update by key
      return await updateChannelByKey(
        apiRoot,
        context.projectKey,
        params.key!,
        params.version,
        params.actions as ChannelUpdateAction[]
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update channel', error);
  }
};

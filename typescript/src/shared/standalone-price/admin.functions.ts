import {z} from 'zod';
import {
  readStandalonePriceParameters,
  createStandalonePriceParameters,
  updateStandalonePriceParameters,
} from './parameters';
import {
  ApiRoot,
  StandalonePriceDraft,
  StandalonePriceUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  readStandalonePriceById,
  readStandalonePriceByKey,
  queryStandalonePrices,
  createStandalonePrice as createStandalonePriceBase,
  updateStandalonePriceById,
  updateStandalonePriceByKey,
} from './base.functions';

export const readStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readStandalonePriceParameters>
) => {
  try {
    // If ID is provided, fetch a specific standalone price by ID
    if (params.id) {
      return await readStandalonePriceById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // If key is provided, fetch a specific standalone price by key
    if (params.key) {
      return await readStandalonePriceByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Otherwise, query standalone prices with filters
    return await queryStandalonePrices(
      apiRoot,
      context.projectKey,
      params.where,
      params.limit,
      params.offset,
      params.sort,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read standalone prices', error);
  }
};

export const createStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createStandalonePriceParameters>
) => {
  try {
    return await createStandalonePriceBase(
      apiRoot,
      context.projectKey,
      params as StandalonePriceDraft
    );
  } catch (error: any) {
    throw new SDKError('Failed to create standalone price', error);
  }
};

export const updateStandalonePrice = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateStandalonePriceParameters>
) => {
  try {
    // Ensure one of id or key is provided
    if (!params.id && !params.key) {
      throw new Error(
        'Either id or key must be provided for updating a standalone price'
      );
    }

    if (params.id) {
      // Update by ID
      return await updateStandalonePriceById(
        apiRoot,
        context.projectKey,
        params.id,
        params.version,
        params.actions as StandalonePriceUpdateAction[]
      );
    } else {
      // Update by key
      return await updateStandalonePriceByKey(
        apiRoot,
        context.projectKey,
        params.key!,
        params.version,
        params.actions as StandalonePriceUpdateAction[]
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update standalone price', error);
  }
};

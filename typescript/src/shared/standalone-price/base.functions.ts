import {z} from 'zod';
import {
  ApiRoot,
  StandalonePriceDraft,
  StandalonePriceUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readStandalonePriceById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .standalonePrices()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read standalone price by ID', error);
  }
};

export const readStandalonePriceByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .standalonePrices()
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read standalone price by key', error);
  }
};

export const queryStandalonePrices = async (
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
      .standalonePrices()
      .get({
        queryArgs: {
          limit: limit || 10,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(where && {where}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to query standalone prices', error);
  }
};

export const createStandalonePrice = async (
  apiRoot: ApiRoot,
  projectKey: string,
  standalonePriceDraft: StandalonePriceDraft
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .standalonePrices()
      .post({
        body: standalonePriceDraft,
      })
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to create standalone price', error);
  }
};

export const updateStandalonePriceById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: StandalonePriceUpdateAction[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .standalonePrices()
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
    throw new SDKError('Failed to update standalone price by ID', error);
  }
};

export const updateStandalonePriceByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  version: number,
  actions: StandalonePriceUpdateAction[]
) => {
  try {
    const response = await apiRoot
      .withProjectKey({projectKey})
      .standalonePrices()
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
    throw new SDKError('Failed to update standalone price by key', error);
  }
};

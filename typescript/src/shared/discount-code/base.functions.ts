import {z} from 'zod';
import {
  readDiscountCodeParameters,
  createDiscountCodeParameters,
} from './parameters';
import {
  ApiRoot,
  DiscountCodeDraft,
  DiscountCodeUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readDiscountCodeById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new SDKError('Failed to read discount code by ID', error);
  }
};

export const readDiscountCodeByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new SDKError('Failed to read discount code by key', error);
  }
};

export const queryDiscountCodes = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readDiscountCodeParameters>
) => {
  try {
    const discountCodes = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .get({
        queryArgs: {
          limit: params.limit || 10,
          ...(params.offset && {offset: params.offset}),
          ...(params.sort && {sort: params.sort}),
          ...(params.where && {where: params.where}),
          ...(params.expand && {expand: params.expand}),
        },
      })
      .execute();

    return discountCodes.body;
  } catch (error: any) {
    throw new SDKError('Failed to list discount codes', error);
  }
};

export const createDiscountCode = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createDiscountCodeParameters>
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .post({
        body: params as DiscountCodeDraft,
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new SDKError('Failed to create discount code', error);
  }
};

export const updateDiscountCodeById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions as DiscountCodeUpdateAction[],
        },
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new SDKError('Failed to update discount code by ID', error);
  }
};

export const updateDiscountCodeByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) => {
  try {
    const discountCode = await apiRoot
      .withProjectKey({projectKey})
      .discountCodes()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions as DiscountCodeUpdateAction[],
        },
      })
      .execute();

    return discountCode.body;
  } catch (error: any) {
    throw new SDKError('Failed to update discount code by key', error);
  }
};

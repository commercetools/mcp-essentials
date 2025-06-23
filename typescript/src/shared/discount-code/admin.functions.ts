import {z} from 'zod';
import {
  readDiscountCodeParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

export const readDiscountCode = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readDiscountCodeParameters>
) => {
  if (params.id) {
    return readDiscountCodeById(apiRoot, context, {
      id: params.id,
      expand: params.expand,
    });
  } else if (params.key) {
    return readDiscountCodeByKey(apiRoot, context, {
      key: params.key,
      expand: params.expand,
    });
  } else {
    return base.queryDiscountCodes(apiRoot, context.projectKey, params);
  }
};

export const readDiscountCodeById = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) => {
  return base.readDiscountCodeById(apiRoot, context.projectKey, params);
};

export const readDiscountCodeByKey = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) => {
  return base.readDiscountCodeByKey(apiRoot, context.projectKey, params);
};

export const createDiscountCode = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createDiscountCodeParameters>
) => {
  return base.createDiscountCode(apiRoot, context.projectKey, params);
};

export const updateDiscountCode = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateDiscountCodeParameters>
) => {
  if (params.id) {
    return updateDiscountCodeById(apiRoot, context, {
      id: params.id,
      version: params.version,
      actions: params.actions,
    });
  } else if (params.key) {
    return updateDiscountCodeByKey(apiRoot, context, {
      key: params.key,
      version: params.version,
      actions: params.actions,
    });
  } else {
    throw new SDKError(
      'Failed to update discount code',
      new Error('Either id or key must be provided')
    );
  }
};

export const updateDiscountCodeById = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) => {
  return base.updateDiscountCodeById(apiRoot, context.projectKey, params);
};

export const updateDiscountCodeByKey = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) => {
  return base.updateDiscountCodeByKey(apiRoot, context.projectKey, params);
};

/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTaxCategoryParameters,
  readTaxCategoryParameters,
  updateTaxCategoryParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads tax categories based on provided parameters
 */
export async function readTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readTaxCategoryParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get tax category by ID
      return await readTaxCategoryById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get tax category by key
      return await readTaxCategoryByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List tax categories
      return await queryTaxCategories(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to read tax category', error);
  }
}

/**
 * Reads a tax category by ID
 */
export function readTaxCategoryById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readTaxCategoryById(apiRoot, context.projectKey, params);
}

/**
 * Reads a tax category by key
 */
export function readTaxCategoryByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readTaxCategoryByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists tax categories
 */
export function queryTaxCategories(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  return base.queryTaxCategories(apiRoot, context.projectKey, params);
}

/**
 * Creates a new tax category
 */
export async function createTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createTaxCategoryParameters>
) {
  try {
    return await base.createTaxCategory(apiRoot, context.projectKey, params);
  } catch (error: any) {
    throw new SDKError('Failed to create tax category', error);
  }
}

/**
 * Updates a tax category based on provided parameters
 */
export async function updateTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateTaxCategoryParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return await base.updateTaxCategoryById(apiRoot, context.projectKey, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return await base.updateTaxCategoryByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a tax category'
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update tax category', error);
  }
}

/**
 * Updates a tax category by ID
 */
export async function updateTaxCategoryById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateTaxCategoryById(apiRoot, context.projectKey, params);
}

/**
 * Updates a tax category by key
 */
export async function updateTaxCategoryByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateTaxCategoryByKey(apiRoot, context.projectKey, params);
}

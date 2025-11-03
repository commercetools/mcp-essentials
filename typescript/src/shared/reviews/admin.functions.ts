import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createReviewParameters,
  readReviewParameters,
  updateReviewParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads reviews based on provided parameters
 */
export function readReview(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readReviewParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get review by ID
      return readReviewById(apiRoot, context, {
        id,
        expand: params.expand,
      });
    } else if (key) {
      // Get review by key
      return readReviewByKey(apiRoot, context, {
        key,
        expand: params.expand,
      });
    } else {
      // List reviews
      return queryReviews(apiRoot, context, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading review', error);
  }
}

/**
 * Reads a review by ID
 */
export function readReviewById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]}
) {
  return base.readReviewById(apiRoot, context.projectKey, params);
}

/**
 * Reads a review by key
 */
export function readReviewByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]}
) {
  return base.readReviewByKey(apiRoot, context.projectKey, params);
}

/**
 * Lists reviews
 */
export function queryReviews(
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
  return base.queryReviews(apiRoot, context.projectKey, params);
}

/**
 * Creates a new review
 */
export function createReview(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createReviewParameters>
) {
  return base.createReview(apiRoot, context.projectKey, params);
}

/**
 * Updates a review based on provided parameters
 */
export function updateReview(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateReviewParameters>
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      // Update by ID
      return updateReviewById(apiRoot, context, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return updateReviewByKey(apiRoot, context, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a review'
      );
    }
  } catch (error) {
    // If the error is already properly formatted, rethrow it
    if (error instanceof Error) {
      throw error;
    }
    throw new SDKError('Error updating review', error);
  }
}

/**
 * Updates a review by ID
 */
export function updateReviewById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; version: number; actions: any[]}
) {
  return base.updateReviewById(apiRoot, context.projectKey, params);
}

/**
 * Updates a review by key
 */
export function updateReviewByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; version: number; actions: any[]}
) {
  return base.updateReviewByKey(apiRoot, context.projectKey, params);
}

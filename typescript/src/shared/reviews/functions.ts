import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createReviewParameters,
  readReviewParameters,
  updateReviewParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToReviewFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_review: admin.readReview,
      create_review: admin.createReview,
      update_review: admin.updateReview,
    };
  }

  return {};
};

/**
 * Reads reviews based on provided parameters:
 * - If 'id' is provided, retrieves a specific review by ID
 * - If 'key' is provided, retrieves a specific review by key
 * - If neither 'id' nor 'key' is provided, lists reviews with optional filtering
 */
export function readReview(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readReviewParameters>
) {
  return admin.readReview(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new review
 */
export function createReview(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createReviewParameters>
) {
  return admin.createReview(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates a review based on provided parameters:
 * - If 'id' is provided, updates the review by ID
 * - If 'key' is provided, updates the review by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateReview(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateReviewParameters>
) {
  return admin.updateReview(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

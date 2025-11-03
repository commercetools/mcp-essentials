import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createReviewParameters,
  readReviewParameters,
  updateReviewParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a review by ID
 */
export async function readReviewById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readReviewParameters>
) {
  try {
    const reviewRequest = apiRoot
      .withProjectKey({projectKey})
      .reviews()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await reviewRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading review by ID', error);
  }
}

/**
 * Reads a review by key
 */
export async function readReviewByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readReviewParameters>
) {
  try {
    const reviewRequest = apiRoot
      .withProjectKey({projectKey})
      .reviews()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await reviewRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading review by key', error);
  }
}

/**
 * Lists reviews
 */
export async function queryReviews(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  try {
    const reviewRequest = apiRoot
      .withProjectKey({projectKey})
      .reviews()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await reviewRequest.execute();
    return response.body;
  } catch (error) {
    console.error('Error querying reviews:', error);
    throw error;
  }
}

/**
 * Creates a new review
 */
export async function createReview(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createReviewParameters>
) {
  try {
    const reviewDraft = {
      key: params.key,
      uniquenessValue: params.uniquenessValue,
      locale: params.locale,
      authorName: params.authorName,
      title: params.title,
      text: params.text,
      target: params.target,
      state: params.state,
      rating: params.rating,
      customer: params.customer,
      custom: params.custom,
    };

    const reviewRequest = apiRoot.withProjectKey({projectKey}).reviews().post({
      body: reviewDraft,
    });

    const response = await reviewRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating review', error);
  }
}

/**
 * Updates a review by ID
 */
export async function updateReviewById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateReviewParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .reviews()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating review by ID', error);
  }
}

/**
 * Updates a review by key
 */
export async function updateReviewByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateReviewParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .reviews()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating review by key', error);
  }
}

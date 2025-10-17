import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTaxCategoryParameters,
  readTaxCategoryParameters,
  updateTaxCategoryParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a tax category by ID
 */
export async function readTaxCategoryById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readTaxCategoryParameters>
) {
  try {
    const taxCategoryRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .withId({ID: params.id as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await taxCategoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading tax category by ID', error);
  }
}

/**
 * Reads a tax category by key
 */
export async function readTaxCategoryByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readTaxCategoryParameters>
) {
  try {
    const taxCategoryRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .withKey({key: params.key as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await taxCategoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading tax category by key', error);
  }
}

/**
 * Lists tax categories
 */
export async function queryTaxCategories(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readTaxCategoryParameters>
) {
  try {
    const taxCategoryRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await taxCategoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error querying tax categories', error);
  }
}

/**
 * Creates a new tax category
 */
export async function createTaxCategory(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createTaxCategoryParameters>
) {
  try {
    // Transform rates to ensure includedInPrice is always defined
    const transformedRates = params.rates?.map((rate) => ({
      ...rate,
      includedInPrice: rate.includedInPrice ?? false,
    }));

    const taxCategoryDraft = {
      key: params.key,
      name: params.name,
      description: params.description,
      rates: transformedRates,
      custom: params.custom,
    };

    const taxCategoryRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .post({
        body: taxCategoryDraft,
      });

    const response = await taxCategoryRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating tax category', error);
  }
}

/**
 * Updates a tax category by ID
 */
export async function updateTaxCategoryById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateTaxCategoryParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .withId({ID: params.id as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating tax category by ID', error);
  }
}

/**
 * Updates a tax category by key
 */
export async function updateTaxCategoryByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updateTaxCategoryParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .taxCategories()
      .withKey({key: params.key as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating tax category by key', error);
  }
}

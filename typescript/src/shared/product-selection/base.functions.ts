import {z} from 'zod';
import {
  ApiRoot,
  ProductSelectionDraft,
  ProductSelectionUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readProductSelectionById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new SDKError('Failed to read ProductSelection by ID', error);
  }
};

export const readProductSelectionByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new SDKError('Failed to read ProductSelection by key', error);
  }
};

export const queryProductSelections = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any
) => {
  try {
    const productSelections = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .get({
        queryArgs,
      })
      .execute();

    return productSelections.body;
  } catch (error: any) {
    throw new SDKError('Failed to query ProductSelections', error);
  }
};

export const createProductSelectionBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  draft: ProductSelectionDraft
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .post({
        body: draft,
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new SDKError('Failed to create ProductSelection', error);
  }
};

export const updateProductSelectionById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: ProductSelectionUpdateAction[]
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .withId({ID: id})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new SDKError('Failed to update ProductSelection by ID', error);
  }
};

export const updateProductSelectionByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  version: number,
  actions: ProductSelectionUpdateAction[]
) => {
  try {
    const productSelection = await apiRoot
      .withProjectKey({projectKey})
      .productSelections()
      .withKey({key})
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return productSelection.body;
  } catch (error: any) {
    throw new SDKError('Failed to update ProductSelection by key', error);
  }
};

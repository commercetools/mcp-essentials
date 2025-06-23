import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

/**
 * Read a staged quote by ID
 */
export const readStagedQuoteById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  queryArgs?: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .withId({ID: id})
        .get({queryArgs})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .withId({ID: id})
      .get({queryArgs})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read staged quote by ID', error);
  }
};

/**
 * Read a staged quote by key
 */
export const readStagedQuoteByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  queryArgs?: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .withKey({key})
        .get({queryArgs})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .withKey({key})
      .get({queryArgs})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read staged quote by key', error);
  }
};

/**
 * Query staged quotes
 */
export const queryStagedQuotes = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .get({queryArgs})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .get({queryArgs})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to query staged quotes', error);
  }
};

/**
 * Create a staged quote
 */
export const createStagedQuote = async (
  apiRoot: ApiRoot,
  projectKey: string,
  stagedQuoteDraft: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .post({body: stagedQuoteDraft})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .post({body: stagedQuoteDraft})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to create staged quote', error);
  }
};

/**
 * Update a staged quote by ID
 */
export const updateStagedQuoteById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  updateBody: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .withId({ID: id})
        .post({body: updateBody})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .withId({ID: id})
      .post({body: updateBody})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to update staged quote by ID', error);
  }
};

/**
 * Update a staged quote by key
 */
export const updateStagedQuoteByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  updateBody: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const response = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .stagedQuotes()
        .withKey({key})
        .post({body: updateBody})
        .execute();
      return response.body;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .stagedQuotes()
      .withKey({key})
      .post({body: updateBody})
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to update staged quote by key', error);
  }
};

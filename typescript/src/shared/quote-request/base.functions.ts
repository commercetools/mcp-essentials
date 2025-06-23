import {
  ApiRoot,
  QuoteRequestDraft,
  QuoteRequestUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readQuoteRequestById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[],
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const quoteRequest = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests()
        .withId({ID: id})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return quoteRequest.body;
    } else {
      const quoteRequest = await apiRoot
        .withProjectKey({projectKey})
        .quoteRequests()
        .withId({ID: id})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return quoteRequest.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to read quote request by ID', error);
  }
};

export const readQuoteRequestByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[],
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const quoteRequest = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests()
        .withKey({key})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return quoteRequest.body;
    } else {
      const quoteRequest = await apiRoot
        .withProjectKey({projectKey})
        .quoteRequests()
        .withKey({key})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return quoteRequest.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to read quote request by key', error);
  }
};

const queryQuoteRequest = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const quoteRequests = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests()
        .get({queryArgs})
        .execute();
      return quoteRequests.body;
    }
    const quoteRequests = await apiRoot
      .withProjectKey({projectKey})
      .quoteRequests()
      .get({queryArgs})
      .execute();
    return quoteRequests.body;
  } catch (error: any) {
    throw new SDKError('Failed to query quote requests', error);
  }
};

// Helper function to query quote requests
export const queryQuoteRequests = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    ...(where && {where}),
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const quoteRequests = await queryQuoteRequest(
      apiRoot,
      projectKey,
      queryArgs,
      storeKey
    );
    return quoteRequests;
  } else {
    const quoteRequests = await queryQuoteRequest(
      apiRoot,
      projectKey,
      queryArgs
    );
    return quoteRequests;
  }
};

export const updateQuoteRequestById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  actions: QuoteRequestUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the quote request to get the latest version
    const quoteRequest = await readQuoteRequestById(apiRoot, projectKey, id);
    const currentVersion = quoteRequest.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests();
    } else {
      apiRequest = projectApiRoot.quoteRequests();
    }

    const updatedQuoteRequest = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedQuoteRequest.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote request by ID', error);
  }
};

export const updateQuoteRequestByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  actions: QuoteRequestUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the quote request to get the latest version
    const quoteRequest = await readQuoteRequestByKey(apiRoot, projectKey, key);
    const currentVersion = quoteRequest.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests();
    } else {
      apiRequest = projectApiRoot.quoteRequests();
    }

    const updatedQuoteRequest = await apiRequest
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedQuoteRequest.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote request by key', error);
  }
};

export const createQuoteRequest = async (
  apiRoot: ApiRoot,
  projectKey: string,
  quoteRequestDraft: QuoteRequestDraft,
  storeKey?: string
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quoteRequests();
    } else {
      apiRequest = projectApiRoot.quoteRequests();
    }

    const quoteRequest = await apiRequest
      .post({
        body: quoteRequestDraft,
      })
      .execute();

    return quoteRequest.body;
  } catch (error: any) {
    throw new SDKError('Failed to create quote request', error);
  }
};

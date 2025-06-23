import {z} from 'zod';
import {
  readQuoteRequestParameters,
  createQuoteRequestParameters,
  updateQuoteRequestParameters,
} from './parameters';
import {
  ApiRoot,
  QuoteRequestDraft,
  QuoteRequestUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  queryQuoteRequests,
  readQuoteRequestById,
  readQuoteRequestByKey,
  updateQuoteRequestById,
  updateQuoteRequestByKey,
  createQuoteRequest as baseCreateQuoteRequest,
} from './base.functions';

export const readQuoteRequest = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readQuoteRequestParameters>
) => {
  try {
    // Case 1: Read quote request by ID
    if (params.id) {
      return await readQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // Case 2: Read quote request by key
    if (params.key) {
      return await readQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
    }

    // Case 3: Read quote request by customer ID
    if (params.customerId) {
      const whereWithCustomerId = [`customer(id="${params.customerId}")`];
      return await queryQuoteRequests(
        apiRoot,
        context.projectKey,
        whereWithCustomerId,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    // Case 4: Query quote requests with provided where conditions
    if (params.where) {
      return await queryQuoteRequests(
        apiRoot,
        context.projectKey,
        params.where,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    // Case 5: Return all quote requests (with pagination)
    return await queryQuoteRequests(
      apiRoot,
      context.projectKey,
      undefined,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read quote request', error);
  }
};

export const createQuoteRequest = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createQuoteRequestParameters>
) => {
  try {
    let quoteRequest;

    if (params.storeKey) {
      // Using in-store endpoint
      quoteRequest = await baseCreateQuoteRequest(
        apiRoot,
        context.projectKey,
        params as QuoteRequestDraft,
        params.storeKey
      );
    } else {
      quoteRequest = await baseCreateQuoteRequest(
        apiRoot,
        context.projectKey,
        params as QuoteRequestDraft
      );
    }

    return quoteRequest;
  } catch (error: any) {
    throw new SDKError('Failed to create quote request', error);
  }
};

export const updateQuoteRequest = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateQuoteRequestParameters>
) => {
  try {
    // Handle the different combinations of id/key and store/no-store
    if (params.id) {
      return await updateQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as QuoteRequestUpdateAction[],
        params.storeKey
      );
    } else if (params.key) {
      return await updateQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as QuoteRequestUpdateAction[],
        params.storeKey
      );
    } else {
      throw new Error('Either id or key must be provided');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update quote request', error);
  }
};

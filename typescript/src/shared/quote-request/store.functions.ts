import {
  ApiRoot,
  QuoteRequestDraft,
  QuoteRequestUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  createQuoteRequest as baseCreateQuoteRequest,
  queryQuoteRequests,
  readQuoteRequestById,
  readQuoteRequestByKey,
  updateQuoteRequestById,
  updateQuoteRequestByKey,
} from './base.functions';
import {
  createQuoteRequestParameters,
  readQuoteRequestParameters,
  updateQuoteRequestParameters,
} from './parameters';

export const readQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteRequestParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Case 1: Read quote request by ID
    if (params.id) {
      const quoteRequest = await readQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand,
        context.storeKey
      );
      return quoteRequest;
    }

    // Case 2: Read quote request by key
    if (params.key) {
      const quoteRequest = await readQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand,
        context.storeKey
      );
      return quoteRequest;
    }

    // Case 3: Read quote request by customer ID (within store)
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
        context.storeKey
      );
    }

    // Case 4: Query quote requests with provided where conditions (within store)
    return await queryQuoteRequests(
      apiRoot,
      context.projectKey,
      params.where,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read quote request', error);
  }
};

export const createQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createQuoteRequestParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Create quote request draft with store key
    const quoteRequestDraft = {
      ...params,
      // Store key will be handled by the in-store endpoint
    } as QuoteRequestDraft;

    // Use base function with store context
    return await baseCreateQuoteRequest(
      apiRoot,
      context.projectKey,
      quoteRequestDraft,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to create quote request', error);
  }
};

export const updateQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteRequestParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Always use in-store endpoint when we have store context
    if (params.id) {
      return await updateQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as QuoteRequestUpdateAction[],
        context.storeKey
      );
    } else if (params.key) {
      return await updateQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as QuoteRequestUpdateAction[],
        context.storeKey
      );
    }

    throw new SDKError('Failed to update quote request', {
      statusCode: 500,
    });
  } catch (error: any) {
    throw new SDKError('Failed to update quote request', error);
  }
};

import {ApiRoot, QuoteRequestUpdateAction} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  queryQuoteRequests,
  readQuoteRequestById,
  readQuoteRequestByKey,
  updateQuoteRequestById,
  updateQuoteRequestByKey,
} from './base.functions';
import {
  readQuoteRequestParameters,
  updateQuoteRequestParameters,
} from './parameters';

export const readQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteRequestParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    // Case 1: Read by ID
    if (params.id) {
      const quoteRequest = await readQuoteRequestById(
        apiRoot,
        context.projectKey,
        context.customerId
      );
      if (quoteRequest.customer.id !== context.customerId) {
        throw new SDKError('Quote request does not belong to customer', {});
      }
      return quoteRequest;
    }

    // Case 2: Read by key
    if (params.key) {
      const quoteRequest = await readQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key
      );
      if (quoteRequest.customer.id !== context.customerId) {
        throw new SDKError('Quote request does not belong to customer', {});
      }
      return quoteRequest;
    }

    // Case 3: Query with customer filter
    const whereWithCustomerId = params.where ? [...params.where] : [];
    whereWithCustomerId.push(`customer(id="${context.customerId}")`);

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
  } catch (error: any) {
    throw new SDKError('Failed to read quote request', error);
  }
};

export const updateQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteRequestParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    // Handle the different combinations of id/key
    if (params.id) {
      const quoteRequest = await readQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id
      );
      if (quoteRequest.customer.id !== context.customerId) {
        throw new SDKError('Quote request does not belong to customer', {});
      }
      return await updateQuoteRequestById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as QuoteRequestUpdateAction[],
        params.storeKey
      );
    } else if (params.key) {
      const quoteRequest = await readQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key
      );
      if (quoteRequest.customer.id !== context.customerId) {
        throw new SDKError('Quote request does not belong to customer', {});
      }
      return await updateQuoteRequestByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as QuoteRequestUpdateAction[],
        params.storeKey
      );
    }

    throw new SDKError('Failed to update quote request', {
      statusCode: 500,
    });
  } catch (error: any) {
    throw new SDKError('Failed to update quote request', error);
  }
};

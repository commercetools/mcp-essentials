import {z} from 'zod';
import {
  readStagedQuoteParameters,
  createStagedQuoteParameters,
  updateStagedQuoteParameters,
} from './parameters';
import {ApiRoot, StagedQuoteDraft} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Read a staged quote in store context
 */
export const readStagedQuote = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readStagedQuoteParameters>
) => {
  if (!context.storeKey) {
    throw new SDKError('Store key is required', {});
  }

  // Handle different query types
  if (params.id) {
    // Read by ID
    const queryArgs = {
      ...(params.expand && {expand: params.expand}),
    };

    return base.readStagedQuoteById(
      apiRoot,
      context.projectKey,
      params.id,
      queryArgs,
      context.storeKey
    );
  } else if (params.key) {
    // Read by key
    const queryArgs = {
      ...(params.expand && {expand: params.expand}),
    };

    return base.readStagedQuoteByKey(
      apiRoot,
      context.projectKey,
      params.key,
      queryArgs,
      context.storeKey
    );
  } else {
    // Query staged quotes
    const queryArgs = {
      ...(params.where && {where: params.where}),
      ...(params.limit !== undefined && {limit: params.limit}),
      ...(params.offset !== undefined && {offset: params.offset}),
      ...(params.sort && {sort: params.sort}),
      ...(params.expand && {expand: params.expand}),
    };

    return base.queryStagedQuotes(
      apiRoot,
      context.projectKey,
      queryArgs,
      context.storeKey
    );
  }
};

/**
 * Create a staged quote in store context
 */
export const createStagedQuote = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createStagedQuoteParameters>
) => {
  const stagedQuoteDraft: StagedQuoteDraft = {
    quoteRequest: params.quoteRequest,
    quoteRequestVersion: params.quoteRequestVersion,
  };

  // Add optional fields if provided
  if (params.key) {
    (stagedQuoteDraft as any).key = params.key;
  }

  if (params.quoteRequestStateToAccepted !== undefined) {
    (stagedQuoteDraft as any).quoteRequestStateToAccepted =
      params.quoteRequestStateToAccepted;
  }

  if (params.state) {
    (stagedQuoteDraft as any).state = params.state;
  }

  if (params.custom) {
    (stagedQuoteDraft as any).custom = params.custom;
  }

  return base.createStagedQuote(
    apiRoot,
    context.projectKey,
    stagedQuoteDraft,
    context.storeKey
  );
};

/**
 * Update a staged quote in store context
 */
export const updateStagedQuote = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateStagedQuoteParameters>
) => {
  const updateBody = {
    version: params.version,
    actions: params.actions,
  };

  if (params.id) {
    return base.updateStagedQuoteById(
      apiRoot,
      context.projectKey,
      params.id,
      updateBody,
      context.storeKey
    );
  } else if (params.key) {
    return base.updateStagedQuoteByKey(
      apiRoot,
      context.projectKey,
      params.key,
      updateBody,
      context.storeKey
    );
  } else {
    throw new Error('Either id or key must be provided for update operations');
  }
};

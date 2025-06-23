import {ApiRoot, QuoteDraft, StateReference} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import * as base from './base.functions';
import {z} from 'zod';
import {
  readQuoteParameters,
  createQuoteParameters,
  updateQuoteParameters,
} from './parameters';

// Read quote in store context
export const readQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    const {projectKey} = context;
    const {id, key, where, limit, offset, sort, expand} = params;
    const storeKey = params.storeKey || context.storeKey;

    // If querying by ID
    if (id) {
      const quote = await base.readQuoteById(
        apiRoot,
        projectKey,
        id,
        expand,
        storeKey
      );

      // Check if quote belongs to store
      if (quote.store?.key !== storeKey) {
        throw new SDKError('Quote not found', {});
      }

      return quote;
    }

    // If querying by key
    if (key) {
      const quote = await base.readQuoteByKey(
        apiRoot,
        projectKey,
        key,
        expand,
        storeKey
      );

      // Check if quote belongs to store
      if (quote.store?.key !== storeKey) {
        throw new SDKError('Quote not found', {});
      }

      return quote;
    }

    // Query quotes with store filter
    const storeWhere = [`store(key="${storeKey}")`];
    const combinedWhere = where ? [...storeWhere, ...where] : storeWhere;

    const queryArgs = {
      where: combinedWhere,
      limit,
      offset,
      sort,
      expand,
    };

    return await base.queryQuotes(apiRoot, projectKey, queryArgs, storeKey);
  } catch (error: any) {
    throw new SDKError('Failed to read quote', error);
  }
};

// Create quote in store context
export const createQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createQuoteParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    const {projectKey} = context;
    const {expand} = params;
    const storeKey = params.storeKey || context.storeKey;

    const quoteDraft: QuoteDraft = {
      ...(params.key && {key: params.key}),
      stagedQuote: params.stagedQuote,
      stagedQuoteVersion: params.stagedQuoteVersion,
      stagedQuoteStateToSent: params.stagedQuoteStateToSent,
      ...(params.state && {state: params.state as StateReference}),
      ...(params.custom && {custom: params.custom}),
    };

    return await base.createQuote(
      apiRoot,
      projectKey,
      quoteDraft,
      expand,
      storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to create quote', error);
  }
};

// Update quote in store context
export const updateQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    const {projectKey} = context;
    const {id, key, version, actions, expand} = params;
    const storeKey = params.storeKey || context.storeKey;

    // First, get the current quote to verify it belongs to the store and get version if not provided
    let currentQuote;
    if (id) {
      currentQuote = await base.readQuoteById(
        apiRoot,
        projectKey,
        id,
        expand,
        storeKey
      );
    } else if (key) {
      currentQuote = await base.readQuoteByKey(
        apiRoot,
        projectKey,
        key,
        expand,
        storeKey
      );
    } else {
      throw new SDKError('Either quote ID or key must be provided', {});
    }

    // Check if quote belongs to store
    if (currentQuote.store?.key !== storeKey) {
      throw new SDKError('Cannot update quote: not from this store', {
        storeKey,
        quoteStoreKey: currentQuote.store?.key,
      });
    }

    const updateData = {
      version: version || currentQuote.version,
      actions,
    };

    if (id) {
      return await base.updateQuoteById(
        apiRoot,
        projectKey,
        id,
        updateData,
        expand,
        storeKey
      );
    } else {
      return await base.updateQuoteByKey(
        apiRoot,
        projectKey,
        key!,
        updateData,
        expand,
        storeKey
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update quote', error);
  }
};

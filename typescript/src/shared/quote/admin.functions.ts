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

// Read quote for admin (no restrictions)
export const readQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteParameters>
) => {
  try {
    const {projectKey} = context;
    const {id, key, where, limit, offset, sort, expand, storeKey} = params;

    // If querying by ID
    if (id) {
      return await base.readQuoteById(
        apiRoot,
        projectKey,
        id,
        expand,
        storeKey
      );
    }

    // If querying by key
    if (key) {
      return await base.readQuoteByKey(
        apiRoot,
        projectKey,
        key,
        expand,
        storeKey
      );
    }

    // Query quotes without restrictions
    const queryArgs = {
      where,
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

// Create quote for admin (full access)
export const createQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createQuoteParameters>
) => {
  try {
    const {projectKey} = context;
    const {expand, storeKey} = params;

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

// Update quote for admin (full access to all actions)
export const updateQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteParameters>
) => {
  try {
    const {projectKey} = context;
    const {id, key, version, actions, expand, storeKey} = params;

    // If version is not provided, get it from the current quote
    let currentVersion = version;
    if (!currentVersion) {
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
      currentVersion = currentQuote.version;
    }

    const updateData = {
      version: currentVersion,
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
    } else if (key) {
      return await base.updateQuoteByKey(
        apiRoot,
        projectKey,
        key,
        updateData,
        expand,
        storeKey
      );
    } else {
      throw new SDKError('Either quote ID or key must be provided', {});
    }
  } catch (error: any) {
    throw new SDKError('Failed to update quote', error);
  }
};

import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import * as base from './base.functions';
import {z} from 'zod';
import {
  readQuoteParameters,
  createQuoteParameters,
  updateQuoteParameters,
} from './parameters';

// Read quote for customer (by ID, key, or query)
export const readQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    const {projectKey} = context;
    const {id, key, where, limit, offset, sort, expand, storeKey} = params;

    // If querying by ID
    if (id) {
      const quote = await base.readQuoteById(
        apiRoot,
        projectKey,
        id,
        expand,
        storeKey
      );

      // Check if quote belongs to customer
      if (quote.customer?.id !== context.customerId) {
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

      // Check if quote belongs to customer
      if (quote.customer?.id !== context.customerId) {
        throw new SDKError('Quote not found', {});
      }

      return quote;
    }

    // Query quotes with customer filter
    const customerWhere = [`customer(id="${context.customerId}")`];
    const combinedWhere = where ? [...customerWhere, ...where] : customerWhere;

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

// Update quote for customer (limited to specific actions like accept/decline)
export const updateQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    const {projectKey} = context;
    const {id, key, version, actions, expand, storeKey} = params;

    // First, get the current quote to verify ownership and get version if not provided
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

    // Check if quote belongs to customer
    if (currentQuote.customer?.id !== context.customerId) {
      throw new SDKError('Cannot update quote: not owned by customer', {
        customerId: context.customerId,
        quoteCustomerId: currentQuote.customer?.id,
      });
    }

    // Validate customer actions (only allow certain actions for customers)
    const allowedCustomerActions = [
      'changeQuoteState',
      'requestQuoteRenegotiation',
    ];

    for (const action of actions) {
      if (!allowedCustomerActions.includes(action.action)) {
        throw new SDKError(
          `Action '${action.action}' is not allowed for customers`,
          {}
        );
      }

      // If changing quote state, only allow accepting or declining
      if (action.action === 'changeQuoteState') {
        const allowedStates = ['Accepted', 'Declined'];
        if (!allowedStates.includes(action.quoteState)) {
          throw new SDKError(
            `Quote state '${action.quoteState}' is not allowed for customers`,
            {}
          );
        }
      }
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

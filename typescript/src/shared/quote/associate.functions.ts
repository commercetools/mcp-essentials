import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import * as base from './base.functions';
import {readQuoteParameters, updateQuoteParameters} from './parameters';

// Read quote as associate in business unit context
export const readQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    if (!context.businessUnitKey) {
      throw new SDKError('Business unit key is required', {});
    }

    const {projectKey} = context;
    const associateId = context.customerId;
    const businessUnitKey = context.businessUnitKey;
    const {id, key, where, limit, offset, sort, expand} = params;

    // If querying by ID
    if (id) {
      return await base.readQuoteByIdAsAssociate(
        apiRoot,
        projectKey,
        associateId,
        businessUnitKey,
        id,
        expand
      );
    }

    // If querying by key
    if (key) {
      return await base.readQuoteByKeyAsAssociate(
        apiRoot,
        projectKey,
        associateId,
        businessUnitKey,
        key,
        expand
      );
    }

    // Query quotes for business unit
    const queryArgs = {
      where,
      limit,
      offset,
      sort,
      expand,
    };

    return await base.queryQuotesAsAssociate(
      apiRoot,
      projectKey,
      associateId,
      businessUnitKey,
      queryArgs
    );
  } catch (error: any) {
    throw new SDKError('Failed to read quote as associate', error);
  }
};

// Update quote as associate (limited to specific actions)
export const updateQuote = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteParameters>
) => {
  try {
    if (!context.customerId) {
      throw new SDKError('Customer ID is required', {});
    }

    if (!context.businessUnitKey) {
      throw new SDKError('Business unit key is required', {});
    }

    const {projectKey} = context;
    const associateId = context.customerId;
    const businessUnitKey = context.businessUnitKey;
    const {id, key, version, actions, expand} = params;

    // Validate associate actions (similar to customer but with business unit context)
    const allowedAssociateActions = [
      'changeQuoteState',
      'requestQuoteRenegotiation',
      'changeCustomer', // Associates can reassign quotes within business unit
    ];

    for (const action of actions) {
      if (!allowedAssociateActions.includes(action.action)) {
        throw new SDKError(
          `Action '${action.action}' is not allowed for associates`,
          {}
        );
      }

      // If changing quote state, only allow accepting or declining
      if (action.action === 'changeQuoteState') {
        const allowedStates = ['Accepted', 'Declined'];
        if (!allowedStates.includes(action.quoteState)) {
          throw new SDKError(
            `Quote state '${action.quoteState}' is not allowed for associates`,
            {}
          );
        }
      }
    }

    const updateData = {
      version,
      actions,
    };

    if (id) {
      return await base.updateQuoteByIdAsAssociate(
        apiRoot,
        projectKey,
        associateId,
        businessUnitKey,
        id,
        updateData,
        expand
      );
    } else if (key) {
      return await base.updateQuoteByKeyAsAssociate(
        apiRoot,
        projectKey,
        associateId,
        businessUnitKey,
        key,
        updateData,
        expand
      );
    } else {
      throw new SDKError('Either quote ID or key must be provided', {});
    }
  } catch (error: any) {
    throw new SDKError('Failed to update quote as associate', error);
  }
};

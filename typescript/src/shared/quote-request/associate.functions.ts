import {z} from 'zod';
import {
  readQuoteRequestParameters,
  createQuoteRequestParameters,
  updateQuoteRequestParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';

/**
 * Read a quote request as an associate on behalf of a business unit
 */
export const readQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readQuoteRequestParameters>
) => {
  if (!context.customerId) {
    throw new Error(
      'Associate ID (customerId) is required for associate operations'
    );
  }
  if (!context.businessUnitKey) {
    throw new Error('Business Unit key is required for associate operations');
  }

  try {
    // Handle different query types
    if (params.id) {
      // Read by ID
      const queryArgs = {
        ...(params.expand && {expand: params.expand}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .asAssociate()
        .withAssociateIdValue({associateId: context.customerId})
        .inBusinessUnitKeyWithBusinessUnitKeyValue({
          businessUnitKey: context.businessUnitKey,
        })
        .quoteRequests()
        .withId({ID: params.id})
        .get({queryArgs})
        .execute();

      return response.body;
    } else if (params.key) {
      // Read by key
      const queryArgs = {
        ...(params.expand && {expand: params.expand}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .asAssociate()
        .withAssociateIdValue({associateId: context.customerId})
        .inBusinessUnitKeyWithBusinessUnitKeyValue({
          businessUnitKey: context.businessUnitKey,
        })
        .quoteRequests()
        .withKey({key: params.key})
        .get({queryArgs})
        .execute();

      return response.body;
    } else {
      // Query quote requests
      const queryArgs = {
        ...(params.where && {where: params.where}),
        ...(params.limit !== undefined && {limit: params.limit}),
        ...(params.offset !== undefined && {offset: params.offset}),
        ...(params.sort && {sort: params.sort}),
        ...(params.expand && {expand: params.expand}),
      };

      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .asAssociate()
        .withAssociateIdValue({associateId: context.customerId})
        .inBusinessUnitKeyWithBusinessUnitKeyValue({
          businessUnitKey: context.businessUnitKey,
        })
        .quoteRequests()
        .get({queryArgs})
        .execute();

      return response.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to read quote request as associate', error);
  }
};

/**
 * Create a quote request as an associate on behalf of a business unit
 */
export const createQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createQuoteRequestParameters>
) => {
  if (!context.customerId) {
    throw new Error(
      'Associate ID (customerId) is required for associate operations'
    );
  }
  if (!context.businessUnitKey) {
    throw new Error('Business Unit key is required for associate operations');
  }

  try {
    const requestBody: any = {
      cart: params.cart,
      cartVersion: params.cartVersion,
    };

    if (params.comment) {
      requestBody.comment = params.comment;
    }

    if (params.key) {
      requestBody.key = params.key;
    }

    if (params.custom) {
      requestBody.custom = params.custom;
    }

    const response = await apiRoot
      .withProjectKey({projectKey: context.projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId: context.customerId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({
        businessUnitKey: context.businessUnitKey,
      })
      .quoteRequests()
      .post({body: requestBody})
      .execute();

    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to create quote request as associate', error);
  }
};

/**
 * Update a quote request as an associate on behalf of a business unit
 */
export const updateQuoteRequest = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateQuoteRequestParameters>
) => {
  if (!context.customerId) {
    throw new Error(
      'Associate ID (customerId) is required for associate operations'
    );
  }
  if (!context.businessUnitKey) {
    throw new Error('Business Unit key is required for associate operations');
  }

  if (!params.id && !params.key) {
    throw new Error('Either id or key must be provided for update operations');
  }

  try {
    const updateBody = {
      version: params.version,
      actions: params.actions as any,
    };

    if (params.id) {
      // Update by ID
      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .asAssociate()
        .withAssociateIdValue({associateId: context.customerId})
        .inBusinessUnitKeyWithBusinessUnitKeyValue({
          businessUnitKey: context.businessUnitKey,
        })
        .quoteRequests()
        .withId({ID: params.id})
        .post({body: updateBody})
        .execute();

      return response.body;
    } else if (params.key) {
      // Update by key
      const response = await apiRoot
        .withProjectKey({projectKey: context.projectKey})
        .asAssociate()
        .withAssociateIdValue({associateId: context.customerId})
        .inBusinessUnitKeyWithBusinessUnitKeyValue({
          businessUnitKey: context.businessUnitKey,
        })
        .quoteRequests()
        .withKey({key: params.key})
        .post({body: updateBody})
        .execute();

      return response.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to update quote request as associate', error);
  }
};

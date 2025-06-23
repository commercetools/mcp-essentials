import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readOrderParameters,
  updateOrderParameters,
  createOrderParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

export const readAssociateOrder = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readOrderParameters>
) => {
  const {customerId: associateId, businessUnitKey} = context;

  if (!associateId || !businessUnitKey) {
    throw new SDKError(
      'Both customerId (associateId) and businessUnitKey are required for associate operations',
      {}
    );
  }

  if (params.id) {
    return base.readOrderByIdAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.id,
      params.expand
    );
  }

  if (params.orderNumber) {
    return base.readOrderByOrderNumberAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.orderNumber,
      params.expand
    );
  }

  // Query orders
  return base.queryOrdersAsAssociate(
    apiRoot,
    context.projectKey,
    associateId,
    businessUnitKey,
    params.where,
    params.limit,
    params.offset,
    params.sort,
    params.expand
  );
};

export const createAssociateOrder = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createOrderParameters>
) => {
  const {customerId: associateId, businessUnitKey} = context;

  if (!associateId || !businessUnitKey) {
    throw new SDKError(
      'Both customerId (associateId) and businessUnitKey are required for associate operations',
      {}
    );
  }

  // Create order from cart
  if (params.id && params.version && !params.quoteId) {
    return base.createOrderFromCartAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.id,
      params.version,
      params.orderNumber
    );
  }

  // Create order from quote
  if (params.quoteId && params.version) {
    return base.createOrderFromQuoteAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.quoteId,
      params.version,
      params.orderNumber
    );
  }

  throw new SDKError(
    'Invalid parameters for creating order as associate. Either cart (id + version) or quote (quoteId + version) parameters are required.',
    {}
  );
};

export const updateAssociateOrder = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateOrderParameters>
) => {
  const {customerId: associateId, businessUnitKey} = context;

  if (!associateId || !businessUnitKey) {
    throw new SDKError(
      'Both customerId (associateId) and businessUnitKey are required for associate operations',
      {}
    );
  }

  if (params.id) {
    return base.updateOrderByIdAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.id,
      params.actions as any
    );
  }

  if (params.orderNumber) {
    return base.updateOrderByOrderNumberAsAssociate(
      apiRoot,
      context.projectKey,
      associateId,
      businessUnitKey,
      params.orderNumber,
      params.actions as any
    );
  }

  throw new SDKError(
    'Either id or orderNumber must be provided for updating order as associate',
    {}
  );
};

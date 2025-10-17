import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';
import {
  createPaymentParameters,
  readPaymentParameters,
  updatePaymentParameters,
} from './parameters';

/**
 * Reads payments based on provided parameters
 */
export async function readPayment(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readPaymentParameters>
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get payment by ID
      return await base.readPaymentById(apiRoot, context.projectKey, {
        id,
        expand: params.expand,
      } as z.infer<typeof readPaymentParameters>);
    } else if (key) {
      // Get payment by key
      return await base.readPaymentByKey(apiRoot, context.projectKey, {
        key,
        expand: params.expand,
      } as z.infer<typeof readPaymentParameters>);
    } else {
      // List payments
      return await base.queryPayments(apiRoot, context.projectKey, {
        limit: params.limit,
        offset: params.offset,
        sort: params.sort,
        where: params.where,
        expand: params.expand,
      });
    }
  } catch (error) {
    throw new SDKError('Error reading payment', error);
  }
}

/**
 * Creates a new payment
 */
export async function createPayment(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createPaymentParameters>
) {
  try {
    return await base.createPayment(apiRoot, context.projectKey, params);
  } catch (error) {
    throw new SDKError('Error creating payment', error);
  }
}

/**
 * Updates a payment based on provided parameters
 */
export async function updatePayment(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updatePaymentParameters>
) {
  try {
    const {id, key, version, actions, ...rest} = params;

    if (id) {
      // Update by ID
      return await base.updatePaymentById(apiRoot, context.projectKey, {
        id,
        version,
        actions,
      });
    } else if (key) {
      // Update by key
      return await base.updatePaymentByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a payment'
      );
    }
  } catch (error) {
    throw new SDKError('Error updating payment', error);
  }
}

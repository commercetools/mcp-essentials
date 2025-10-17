import z from 'zod';
import {SDKError} from '../errors/sdkError';
import {
  readPaymentById,
  readPaymentByKey,
  queryPayments,
  createPayment,
  updatePaymentById,
  updatePaymentByKey,
} from './base.functions';
import {readPaymentParameters} from './parameters';

/**
 * Customer function to read their own payments
 */
export async function customerReadPayment(
  apiRoot: any,
  context: any,
  params: any
) {
  try {
    // Add customer-specific filtering
    const customerParams = {
      ...params,
      where: [
        ...(params.where || []),
        'customer(id="' + context.customerId + '")',
      ],
    };

    const {id, key} = customerParams;

    if (id) {
      return await readPaymentById(apiRoot, context.projectKey, {
        id,
        expand: customerParams.expand,
      } as z.infer<typeof readPaymentParameters>);
    } else if (key) {
      return await readPaymentByKey(apiRoot, context.projectKey, {
        key,
        expand: customerParams.expand,
      } as z.infer<typeof readPaymentParameters>);
    } else {
      return await queryPayments(apiRoot, context.projectKey, {
        limit: customerParams.limit,
        offset: customerParams.offset,
        sort: customerParams.sort,
        where: customerParams.where,
        expand: customerParams.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to read payment (customer)', error);
  }
}

/**
 * Customer function to create payments
 */
export async function customerCreatePayment(
  apiRoot: any,
  context: any,
  params: any
) {
  try {
    return await createPayment(apiRoot, context.projectKey, params);
  } catch (error: any) {
    throw new SDKError('Failed to create payment (customer)', error);
  }
}

/**
 * Customer function to update their own payments
 */
export async function customerUpdatePayment(
  apiRoot: any,
  context: any,
  params: any
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      return await updatePaymentById(apiRoot, context.projectKey, {
        id,
        version,
        actions,
      });
    } else if (key) {
      return await updatePaymentByKey(apiRoot, context.projectKey, {
        key,
        version,
        actions,
      });
    } else {
      throw new Error(
        'Either id or key must be provided for updating a payment'
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to update payment (customer)', error);
  }
}

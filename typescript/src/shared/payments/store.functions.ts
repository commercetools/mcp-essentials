import {SDKError} from '../errors/sdkError';
import {
  readPaymentById,
  readPaymentByKey,
  queryPayments,
  createPayment,
  updatePaymentById,
  updatePaymentByKey,
} from './base.functions';

/**
 * Store function to read payments within store context
 */
export async function storeReadPayment(
  apiRoot: any,
  context: any,
  params: any
) {
  try {
    // Add store-specific filtering
    const storeParams = {
      ...params,
      where: [...(params.where || []), 'store(key="' + params.storeKey + '")'],
    };

    const {id, key} = storeParams;

    if (id) {
      return await readPaymentById(apiRoot, context.projectKey, {
        id,
        expand: storeParams.expand,
      });
    } else if (key) {
      return await readPaymentByKey(apiRoot, context.projectKey, {
        key,
        expand: storeParams.expand,
      });
    } else {
      return await queryPayments(apiRoot, context.projectKey, {
        limit: storeParams.limit,
        offset: storeParams.offset,
        sort: storeParams.sort,
        where: storeParams.where,
        expand: storeParams.expand,
      });
    }
  } catch (error: any) {
    throw new SDKError('Failed to read payment (store)', error);
  }
}

/**
 * Store function to create payments within store context
 */
export async function storeCreatePayment(
  apiRoot: any,
  context: any,
  params: any
) {
  try {
    const {storeKey, ...paymentParams} = params;
    if (!storeKey) {
      throw new Error('Missing storeKey in storeCreatePayment parameters');
    }
    return await createPayment(apiRoot, context.projectKey, paymentParams);
  } catch (error: any) {
    throw new SDKError('Failed to create payment (store)', error);
  }
}

/**
 * Store function to update payments within store context
 */
export async function storeUpdatePayment(
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
    throw new SDKError('Failed to update payment (store)', error);
  }
}

import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readPaymentParameters,
  createPaymentParameters,
  updatePaymentParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a payment by ID
 */
export async function readPaymentById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readPaymentParameters>
) {
  try {
    const paymentRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .withId({ID: params.id as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await paymentRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading payment by ID', error);
  }
}

/**
 * Reads a payment by key
 */
export async function readPaymentByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readPaymentParameters>
) {
  try {
    const paymentRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .withKey({key: params.key as string})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await paymentRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading payment by key', error);
  }
}

/**
 * Lists payments
 */
export async function queryPayments(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readPaymentParameters>
) {
  try {
    const paymentRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await paymentRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error querying payments', error);
  }
}

/**
 * Creates a new payment
 */
export async function createPayment(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createPaymentParameters>
) {
  try {
    const paymentDraft = {
      key: params.key,
      interfaceId: params.interfaceId,
      amountPlanned: params.amountPlanned,
      paymentMethodInfo: params.paymentMethodInfo,
      custom: params.custom,
      transaction: params.transaction,
    };

    const paymentRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .post({
        body: paymentDraft,
      });

    const response = await paymentRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating payment', error);
  }
}

/**
 * Updates a payment by ID
 */
export async function updatePaymentById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updatePaymentParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .withId({ID: params.id as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating payment by ID', error);
  }
}

/**
 * Updates a payment by key
 */
export async function updatePaymentByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof updatePaymentParameters>
) {
  try {
    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .payments()
      .withKey({key: params.key as string})
      .post({
        body: {
          version: params.version,
          actions: params.actions as any,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating payment by key', error);
  }
}

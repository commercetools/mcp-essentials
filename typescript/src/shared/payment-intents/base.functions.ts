/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/checkout-sdk';
import {z} from 'zod';
import {updatePaymentIntentParameters} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Manages a payment intent by ID
 */
export async function managePaymentIntentById(
  apiRoot: any,
  projectKey: string,
  params: {
    paymentId: string;
    actions: z.infer<typeof updatePaymentIntentParameters>['actions'];
  },
  getApiRoot: Function
) {
  try {
    const api: ApiRoot = getApiRoot(
      createApiBuilderFromCtpClient,
      'https://checkout.europe-west1.gcp.commercetools.com'
    );

    const paymentIntentRequest = api
      .withProjectKey({projectKey})
      .paymentIntents()
      .withPaymentId({paymentId: params.paymentId})
      .post({
        body: {
          actions: params.actions,
        },
      });

    const response = await paymentIntentRequest.execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Error managing payment intent by ID', error);
  }
}

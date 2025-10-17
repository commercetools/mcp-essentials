/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {updatePaymentIntentParameters} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Manages payment intents based on provided parameters
 */
export async function updatePaymentIntent(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updatePaymentIntentParameters>,
  getApiRoot: Function
) {
  try {
    return await base.managePaymentIntentById(
      apiRoot,
      context.projectKey,
      {
        paymentId: params.paymentId,
        actions: params.actions,
      },
      getApiRoot
    );
  } catch (error: any) {
    throw new SDKError('Failed to update payment intent', error);
  }
}

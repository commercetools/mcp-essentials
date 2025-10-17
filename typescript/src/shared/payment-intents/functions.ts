/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {updatePaymentIntentParameters} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToPaymentIntentFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any,
    getApiRoot: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      update_payment_intents: admin.updatePaymentIntent,
    };
  }

  return {};
};

/**
 * Manages payment intents based on provided parameters
 */
export async function updatePaymentIntent(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updatePaymentIntentParameters>,
  getApiRoot: any
) {
  return admin.updatePaymentIntent(apiRoot, context, params, getApiRoot);
}

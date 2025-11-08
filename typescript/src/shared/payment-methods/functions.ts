import {Context, CommercetoolsFuncContext} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';

export const contextToPaymentMethodFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_payment_methods: admin.readPaymentMethod,
      create_payment_methods: admin.createPaymentMethod,
      update_payment_methods: admin.updatePaymentMethod,
    };
  }

  return {};
};

import {readPayment, createPayment, updatePayment} from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';

export {readPayment, createPayment, updatePayment} from './admin.functions';

export function contextToPaymentFunctionMapping(
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> {
  if (context?.isAdmin) {
    return {
      read_payments: readPayment,
      create_payments: createPayment,
      update_payments: updatePayment,
    };
  }

  return {};
}

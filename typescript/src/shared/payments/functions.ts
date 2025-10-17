import {readPayment, createPayment, updatePayment} from './admin.functions';
import {
  customerReadPayment,
  customerCreatePayment,
  customerUpdatePayment,
} from './customer.functions';
import {
  storeReadPayment,
  storeCreatePayment,
  storeUpdatePayment,
} from './store.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';

export {readPayment, createPayment, updatePayment} from './admin.functions';
export {
  customerReadPayment,
  customerCreatePayment,
  customerUpdatePayment,
} from './customer.functions';
export {
  storeReadPayment,
  storeCreatePayment,
  storeUpdatePayment,
} from './store.functions';

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

  if (context?.customerId) {
    return {
      read_payments: customerReadPayment,
      create_payments: customerCreatePayment,
      update_payments: customerUpdatePayment,
    };
  }

  if (context?.storeKey) {
    return {
      read_payments: storeReadPayment,
      create_payments: storeCreatePayment,
      update_payments: storeUpdatePayment,
    };
  }

  return {};
}

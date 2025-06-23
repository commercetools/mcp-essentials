import * as customer from './customer.functions';
import * as store from './store.functions';
import * as associate from './associate.functions';
import * as admin from './admin.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToQuoteFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.customerId && context?.businessUnitKey) {
    return {
      read_quote: associate.readQuote,
      update_quote: associate.updateQuote,
    };
  }
  if (context?.customerId) {
    return {
      read_quote: customer.readQuote,
      update_quote: customer.updateQuote,
    };
  }
  if (context?.storeKey) {
    return {
      read_quote: store.readQuote,
      create_quote: store.createQuote,
      update_quote: store.updateQuote,
    };
  }
  if (context?.isAdmin) {
    return {
      read_quote: admin.readQuote,
      create_quote: admin.createQuote,
      update_quote: admin.updateQuote,
    };
  }
  return {};
};

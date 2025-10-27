import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {
  readProductTailoring as adminReadProductTailoring,
  createProductTailoring as adminCreateProductTailoring,
  updateProductTailoring as adminUpdateProductTailoring,
} from './admin.functions';
import {
  readProductTailoring as customerReadProductTailoring,
  createProductTailoringEntry as customerCreateProductTailoring,
  updateProductTailoring as customerUpdateProductTailoring,
} from './customer.functions';
import {
  readProductTailoring as storeReadProductTailoring,
  createProductTailoring as storeCreateProductTailoring,
  updateProductTailoring as storeUpdateProductTailoring,
} from './store.functions';

/**
 * Context-based function mapping for product tailoring
 */
export const contextToProductTailoringFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  const isAdmin = context?.isAdmin || false;
  const isStore = context?.storeKey !== undefined;
  const isCustomer = context?.customerId !== undefined;

  if (isAdmin) {
    return {
      readProductTailoring: adminReadProductTailoring,
      createProductTailoring: adminCreateProductTailoring,
      updateProductTailoring: adminUpdateProductTailoring,
    };
  } else if (isStore) {
    return {
      readProductTailoring: storeReadProductTailoring,
      createProductTailoring: storeCreateProductTailoring,
      updateProductTailoring: storeUpdateProductTailoring,
    };
  } else if (isCustomer) {
    return {
      readProductTailoring: customerReadProductTailoring,
      createProductTailoring: customerCreateProductTailoring,
      updateProductTailoring: customerUpdateProductTailoring,
    };
  } else {
    // Default to admin functions for backward compatibility
    return {
      readProductTailoring: adminReadProductTailoring,
      createProductTailoring: adminCreateProductTailoring,
      updateProductTailoring: adminUpdateProductTailoring,
    };
  }
};

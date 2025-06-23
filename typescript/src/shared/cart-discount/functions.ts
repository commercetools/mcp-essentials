import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import * as admin from './admin.functions';
import {
  createCartDiscountParameters,
  readCartDiscountParameters,
  updateCartDiscountParameters,
} from './parameters';
import * as store from './store.functions';

// Context mapping function for cart-discount functions
export const contextToCartDiscountFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.storeKey) {
    return {
      read_cart_discount: store.readCartDiscount,
      create_cart_discount: store.createCartDiscount,
      update_cart_discount: store.updateCartDiscount,
    };
  }
  if (context?.isAdmin) {
    return {
      read_cart_discount: admin.readCartDiscount,
      create_cart_discount: admin.createCartDiscount,
      update_cart_discount: admin.updateCartDiscount,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use
export const readCartDiscount = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readCartDiscountParameters>
) => {
  if (context?.storeKey) {
    return store.readCartDiscount(apiRoot, context, params);
  }
  return admin.readCartDiscount(apiRoot, context, params);
};

export const createCartDiscount = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createCartDiscountParameters>
) => {
  if (context?.storeKey) {
    return store.createCartDiscount(apiRoot, context, params);
  }
  return admin.createCartDiscount(apiRoot, context, params);
};

export const updateCartDiscount = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateCartDiscountParameters>
) => {
  if (context?.storeKey) {
    return store.updateCartDiscount(apiRoot, context, params);
  }
  return admin.updateCartDiscount(apiRoot, context, params);
};

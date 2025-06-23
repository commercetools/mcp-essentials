import {z} from 'zod';
import {
  readProductTypeParameters,
  createProductTypeParameters,
  updateProductTypeParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {Context, CommercetoolsFuncContext} from '../../types/configuration';
import * as admin from './admin.functions';

/**
 * Maps context to product type functions
 */
export const contextToProductTypeFunctionMapping = (
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
      read_product_type: admin.readProductType,
      create_product_type: admin.createProductType,
      update_product_type: admin.updateProductType,
    };
  }
  return {
    read_product_type: admin.readProductType,
  };
};

// Testing

export const readProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readProductTypeParameters>
) => {
  return admin.readProductType(apiRoot, context, params);
};

export const createProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductTypeParameters>
) => {
  return admin.createProductType(apiRoot, context, params);
};

export const updateProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductTypeParameters>
) => {
  return admin.updateProductType(apiRoot, context, params);
};

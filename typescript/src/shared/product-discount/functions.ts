import {z} from 'zod';
import {
  readProductDiscountParameters,
  createProductDiscountParameters,
  updateProductDiscountParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToProductDiscountFunctionMapping = (
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
      read_product_discount: admin.readProductDiscount,
      create_product_discount: admin.createProductDiscount,
      update_product_discount: admin.updateProductDiscount,
    };
  }

  return {};
};

// Legacy function exports to maintain backward compatibility
export const readProductDiscount = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readProductDiscountParameters>
) => {
  return admin.readProductDiscount(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const createProductDiscount = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductDiscountParameters>
) => {
  return admin.createProductDiscount(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const updateProductDiscount = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductDiscountParameters>
) => {
  return admin.updateProductDiscount(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

import {z} from 'zod';
import {
  readCategoryParameters,
  createCategoryParameters,
  updateCategoryParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';
import * as customer from './customer.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

// Context mapping function for category functions
export const contextToCategoryFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.customerId) {
    return {
      read_category: customer.readCategory,
    };
  }
  if (context?.isAdmin) {
    return {
      read_category: admin.readCategory,
      create_category: admin.createCategory,
      update_category: admin.updateCategory,
    };
  }
  return {
    read_category: customer.readCategory,
  };
};

// Export the individual CRUD functions for direct use
export const readCategory = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readCategoryParameters>
) => {
  if (context?.customerId) {
    return customer.readCategory(apiRoot, context, params);
  }
  return admin.readCategory(apiRoot, context, params);
};

export const createCategory = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createCategoryParameters>
) => {
  return admin.createCategory(apiRoot, context, params);
};

export const updateCategory = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateCategoryParameters>
) => {
  return admin.updateCategory(apiRoot, context, params);
};

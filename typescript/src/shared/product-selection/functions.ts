import {z} from 'zod';
import {
  readProductSelectionParameters,
  createProductSelectionParameters,
  updateProductSelectionParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

// We only have admin functions for product-selection as requested
export const contextToProductSelectionFunctionMapping = (
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
      read_product_selection: admin.readProductSelection,
      create_product_selection: admin.createProductSelection,
      update_product_selection: admin.updateProductSelection,
    };
  }

  // If no valid context is provided, return empty object
  return {};
};

// For backwards compatibility
export const readProductSelection = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readProductSelectionParameters>
) => {
  return admin.readProductSelection(apiRoot, context, params);
};

export const createProductSelection = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createProductSelectionParameters>
) => {
  return admin.createProductSelection(apiRoot, context, params);
};

export const updateProductSelection = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateProductSelectionParameters>
) => {
  return admin.updateProductSelection(apiRoot, context, params);
};

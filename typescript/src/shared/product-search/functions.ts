import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import * as admin from './admin.functions';
import {searchProductsParameters} from './parameters';

export const contextToProductSearchFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  // Product search is available to all contexts (customer, store, admin)
  return {
    search_products: admin.searchProducts,
  };
};

// Legacy function export to maintain backward compatibility
export const searchProducts = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof searchProductsParameters>
) => {
  return admin.searchProducts(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

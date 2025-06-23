import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {searchProductsParameters} from './parameters';

/**
 * Searches for products using the provided parameters
 */
export function searchProducts(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof searchProductsParameters>
) {
  return base.searchProducts(apiRoot, context.projectKey, params);
}

/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTaxCategoryParameters,
  readTaxCategoryParameters,
  updateTaxCategoryParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToTaxCategoryFunctionMapping = (
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
      read_tax_category: admin.readTaxCategory,
      create_tax_category: admin.createTaxCategory,
      update_tax_category: admin.updateTaxCategory,
    };
  }

  return {};
};

/**
 * Reads tax categories based on provided parameters:
 * - If 'id' is provided, retrieves a specific tax category by ID
 * - If 'key' is provided, retrieves a specific tax category by key
 * - If neither is provided, lists tax categories with optional filtering, sorting, and pagination
 */
export async function readTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readTaxCategoryParameters>
) {
  return admin.readTaxCategory(apiRoot, context, params);
}

/**
 * Creates a new tax category in the commercetools platform
 */
export async function createTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createTaxCategoryParameters>
) {
  return admin.createTaxCategory(apiRoot, context, params);
}

/**
 * Updates an existing tax category in the commercetools platform
 */
export async function updateTaxCategory(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateTaxCategoryParameters>
) {
  return admin.updateTaxCategory(apiRoot, context, params);
}

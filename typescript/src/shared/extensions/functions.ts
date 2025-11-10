import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createExtensionParameters,
  readExtensionParameters,
  updateExtensionParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToExtensionFunctionMapping = (
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
      read_extension: admin.readExtension,
      create_extension: admin.createExtension,
      update_extension: admin.updateExtension,
    };
  }

  return {};
};

/**
 * Reads extensions based on provided parameters:
 * - If 'id' is provided, retrieves a specific extension by ID
 * - If 'key' is provided, retrieves a specific extension by key
 * - If neither 'id' nor 'key' is provided, lists extensions with optional filtering
 */
export function readExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readExtensionParameters>
) {
  return admin.readExtension(apiRoot, context, params);
}

/**
 * Creates a new extension
 */
export function createExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createExtensionParameters>
) {
  return admin.createExtension(apiRoot, context, params);
}

/**
 * Updates an extension based on provided parameters:
 * - If 'id' is provided, updates the extension by ID
 * - If 'key' is provided, updates the extension by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateExtension(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateExtensionParameters>
) {
  return admin.updateExtension(apiRoot, context, params);
}

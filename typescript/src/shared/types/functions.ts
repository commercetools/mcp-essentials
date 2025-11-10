import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTypeParameters,
  readTypeParameters,
  updateTypeParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToTypeFunctionMapping = (
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
      read_type: admin.readType,
      create_type: admin.createType,
      update_type: admin.updateType,
    };
  }

  return {};
};

/**
 * Reads types based on provided parameters:
 * - If 'id' is provided, retrieves a specific type by ID
 * - If 'key' is provided, retrieves a specific type by key
 * - If neither 'id' nor 'key' is provided, lists types with optional filtering
 */
export function readType(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readTypeParameters>
) {
  return admin.readType(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new type
 */
export function createType(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createTypeParameters>
) {
  return admin.createType(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates a type based on provided parameters:
 * - If 'id' is provided, updates the type by ID
 * - If 'key' is provided, updates the type by key
 * - One of either 'id' or 'key' must be provided
 */
export function updateType(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateTypeParameters>
) {
  return admin.updateType(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

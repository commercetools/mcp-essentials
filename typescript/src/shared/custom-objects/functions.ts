import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createCustomObjectParameters,
  readCustomObjectParameters,
  updateCustomObjectParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToCustomObjectFunctionMapping = (
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
      read_custom_object: admin.readCustomObject,
      create_custom_object: admin.createCustomObject,
      update_custom_object: admin.updateCustomObject,
    };
  }

  return {};
};

/**
 * Reads custom objects based on provided parameters:
 * - If 'container' and 'key' are provided, retrieves a specific custom object by container and key
 * - If only 'container' is provided, lists custom objects in the container with optional filtering
 * - Container must always be provided
 */
export function readCustomObject(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readCustomObjectParameters>
) {
  return admin.readCustomObject(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Creates a new custom object
 */
export function createCustomObject(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createCustomObjectParameters>
) {
  return admin.createCustomObject(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

/**
 * Updates a custom object based on provided parameters:
 * - Both 'container' and 'key' must be provided for updating
 * - Updates the custom object by container and key
 */
export function updateCustomObject(
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCustomObjectParameters>
) {
  return admin.updateCustomObject(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
}

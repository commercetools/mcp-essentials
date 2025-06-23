import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import * as admin from './admin.functions';
import {readProjectParameters, updateProjectParameters} from './parameters';

// Context mapping function for project functions
export const contextToProjectFunctionMapping = (
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
      read_project: admin.readProject,
      update_project: admin.updateProject,
    };
  }

  // If no valid context is provided, return read only
  return {
    read_project: admin.readProject,
  };
};

// Export the read function for direct use (backward compatibility)
export const readProject = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readProjectParameters>
) => {
  return admin.readProject(apiRoot, context, params);
};

// Export the update function for direct use
export const updateProject = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateProjectParameters>
) => {
  return admin.updateProject(apiRoot, context, params);
};

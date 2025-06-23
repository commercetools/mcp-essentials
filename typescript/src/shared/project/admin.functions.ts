import {z} from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';
import {readProjectParameters, updateProjectParameters} from './parameters';
import {readProjectBase, updateProjectBase} from './base.functions';
import {SDKError} from '../errors/sdkError';
import {Context} from '../../types/configuration';

export type ProjectContext = {
  projectKey: string;
  isAdmin?: boolean;
};

/**
 * Reads project information for admin users
 * @param apiRoot - The API client instance
 * @param context - The request context
 * @param params - The request parameters
 * @returns The project information
 */
export const readProject = (
  apiRoot: ApiRoot,
  context: ProjectContext,
  params: z.infer<typeof readProjectParameters>
) => {
  try {
    const projectKey = params.projectKey || context.projectKey;

    if (!projectKey) {
      throw new Error('Project key is required');
    }

    return readProjectBase(apiRoot, projectKey);
  } catch (error: any) {
    throw new SDKError('Failed to read project', error);
  }
};

/**
 * Updates project settings for admin users
 * @param apiRoot - The API client instance
 * @param context - The request context
 * @param params - The request parameters including version and update actions
 * @returns The updated project information
 */
export const updateProject = (
  apiRoot: ApiRoot,
  context: ProjectContext,
  params: z.infer<typeof updateProjectParameters>
) => {
  // Validate required parameters before making API call
  const projectKey = params.projectKey || context.projectKey;

  if (!projectKey) {
    throw new SDKError(
      'Failed to update project',
      new Error('Project key is required')
    );
  }

  if (!params.actions || params.actions.length === 0) {
    throw new SDKError(
      'Failed to update project',
      new Error('At least one update action is required')
    );
  }

  try {
    return updateProjectBase(
      apiRoot,
      projectKey,
      params.version ?? null, // Use null if version is undefined to auto-fetch
      params.actions
    );
  } catch (error: any) {
    throw new SDKError('Failed to update project', error);
  }
};

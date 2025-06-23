import type {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

/**
 * Reads basic project information
 * @param apiRoot - The API client instance
 * @param projectKey - The project key
 * @returns The project information
 */
export const readProjectBase = async (apiRoot: ApiRoot, projectKey: string) => {
  try {
    const response = await apiRoot.withProjectKey({projectKey}).get().execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to read project', error);
  }
};

/**
 * Updates project settings
 * @param apiRoot - The API client instance
 * @param projectKey - The project key
 * @param version - The current version of the project (optional, pass null to auto-fetch)
 * @param actions - The list of update actions to apply
 * @returns The updated project information
 */
export const updateProjectBase = async (
  apiRoot: ApiRoot,
  projectKey: string,
  version: number | null,
  actions: any[]
) => {
  try {
    // If version is not provided, fetch it from the current project
    let currentVersion = version;
    if (currentVersion === null) {
      const project = await readProjectBase(apiRoot, projectKey);
      currentVersion = project.version;
    }

    const response = await apiRoot
      .withProjectKey({projectKey})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();
    return response.body;
  } catch (error: any) {
    throw new SDKError('Failed to update project', error);
  }
};

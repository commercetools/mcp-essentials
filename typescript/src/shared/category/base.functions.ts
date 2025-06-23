import {
  ApiRoot,
  CategoryDraft,
  CategoryUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readCategoryById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[]
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const category = await projectApiRoot
      .categories()
      .withId({ID: id})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return category.body;
  } catch (error: any) {
    throw new SDKError('Failed to read category by ID', error);
  }
};

export const readCategoryByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[]
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const category = await projectApiRoot
      .categories()
      .withKey({key})
      .get({
        queryArgs: {
          ...(expand && {expand}),
        },
      })
      .execute();

    return category.body;
  } catch (error: any) {
    throw new SDKError('Failed to read category by key', error);
  }
};

export const queryCategories = async (
  apiRoot: ApiRoot,
  projectKey: string,
  limit?: number,
  offset?: number,
  sort?: string[],
  where?: string[],
  expand?: string[]
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const categories = await projectApiRoot
      .categories()
      .get({
        queryArgs: {
          limit: limit || 10,
          ...(offset && {offset}),
          ...(sort && {sort}),
          ...(where && {where}),
          ...(expand && {expand}),
        },
      })
      .execute();

    return categories.body;
  } catch (error: any) {
    throw new SDKError('Failed to query categories', error);
  }
};

export const createCategory = async (
  apiRoot: ApiRoot,
  projectKey: string,
  categoryDraft: CategoryDraft
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const category = await projectApiRoot
      .categories()
      .post({
        body: categoryDraft,
      })
      .execute();

    return category.body;
  } catch (error: any) {
    throw new SDKError('Failed to create category', error);
  }
};

export const updateCategoryById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  version: number,
  actions: CategoryUpdateAction[]
) => {
  try {
    // First fetch the category to get the latest version
    const category = await readCategoryById(apiRoot, projectKey, id);
    const currentVersion = category.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const updatedCategory = await projectApiRoot
      .categories()
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCategory.body;
  } catch (error: any) {
    throw new SDKError('Failed to update category by ID', error);
  }
};

export const updateCategoryByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  version: number,
  actions: CategoryUpdateAction[]
) => {
  try {
    // First fetch the category to get the latest version
    const category = await readCategoryByKey(apiRoot, projectKey, key);
    const currentVersion = category.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    const updatedCategory = await projectApiRoot
      .categories()
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedCategory.body;
  } catch (error: any) {
    throw new SDKError('Failed to update category by key', error);
  }
};

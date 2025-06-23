import {
  ApiRoot,
  BusinessUnitDraft,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

export const readBusinessUnitById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expand?: string[],
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const businessUnit = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits()
        .withId({ID: id})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return businessUnit.body;
    } else {
      const businessUnit = await apiRoot
        .withProjectKey({projectKey})
        .businessUnits()
        .withId({ID: id})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return businessUnit.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to read business unit by ID', error);
  }
};

export const readBusinessUnitByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expand?: string[],
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const businessUnit = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits()
        .withKey({key})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return businessUnit.body;
    } else {
      const businessUnit = await apiRoot
        .withProjectKey({projectKey})
        .businessUnits()
        .withKey({key})
        .get({
          queryArgs: {
            ...(expand && {expand}),
          },
        })
        .execute();
      return businessUnit.body;
    }
  } catch (error: any) {
    throw new SDKError('Failed to read business unit by key', error);
  }
};

const queryBusinessUnit = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  try {
    if (storeKey) {
      const businessUnits = await apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits()
        .get({queryArgs})
        .execute();
      return businessUnits.body;
    }
    const businessUnits = await apiRoot
      .withProjectKey({projectKey})
      .businessUnits()
      .get({queryArgs})
      .execute();
    return businessUnits.body;
  } catch (error: any) {
    throw new SDKError('Failed to query business units', error);
  }
};

// Helper function to query business units
export const queryBusinessUnits = async (
  apiRoot: ApiRoot,
  projectKey: string,
  where?: string[],
  limit?: number,
  offset?: number,
  sort?: string[],
  expand?: string[],
  storeKey?: string
) => {
  const queryArgs = {
    ...(where && {where}),
    limit: limit || 10,
    ...(offset && {offset}),
    ...(sort && {sort}),
    ...(expand && {expand}),
  };

  if (storeKey) {
    // Using in-store endpoint
    const businessUnits = await queryBusinessUnit(
      apiRoot,
      projectKey,
      queryArgs,
      storeKey
    );
    return businessUnits;
  } else {
    const businessUnits = await queryBusinessUnit(
      apiRoot,
      projectKey,
      queryArgs
    );
    return businessUnits;
  }
};

export const updateBusinessUnitById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  actions: BusinessUnitUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the business unit to get the latest version
    const businessUnit = await readBusinessUnitById(
      apiRoot,
      projectKey,
      id,
      undefined,
      storeKey
    );
    const currentVersion = businessUnit.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits();
    } else {
      apiRequest = projectApiRoot.businessUnits();
    }

    const updatedBusinessUnit = await apiRequest
      .withId({ID: id})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedBusinessUnit.body;
  } catch (error: any) {
    throw new SDKError('Failed to update business unit by ID', error);
  }
};

export const updateBusinessUnitByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  actions: BusinessUnitUpdateAction[],
  storeKey?: string
) => {
  try {
    // First fetch the business unit to get the latest version
    const businessUnit = await readBusinessUnitByKey(
      apiRoot,
      projectKey,
      key,
      undefined,
      storeKey
    );
    const currentVersion = businessUnit.version;

    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits();
    } else {
      apiRequest = projectApiRoot.businessUnits();
    }

    const updatedBusinessUnit = await apiRequest
      .withKey({key})
      .post({
        body: {
          version: currentVersion,
          actions,
        },
      })
      .execute();

    return updatedBusinessUnit.body;
  } catch (error: any) {
    throw new SDKError('Failed to update business unit by key', error);
  }
};

export const createBusinessUnit = async (
  apiRoot: ApiRoot,
  projectKey: string,
  businessUnitDraft: BusinessUnitDraft,
  storeKey?: string
) => {
  try {
    const projectApiRoot = apiRoot.withProjectKey({
      projectKey,
    });

    let apiRequest;
    if (storeKey) {
      apiRequest = projectApiRoot
        .inStoreKeyWithStoreKeyValue({storeKey})
        .businessUnits();
    } else {
      apiRequest = projectApiRoot.businessUnits();
    }

    const newBusinessUnit = await apiRequest
      .post({
        body: businessUnitDraft,
      })
      .execute();

    return newBusinessUnit.body;
  } catch (error: any) {
    throw new SDKError('Failed to create business unit', error);
  }
};

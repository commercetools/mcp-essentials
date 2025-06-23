import {z} from 'zod';
import {
  readBusinessUnitParameters,
  createBusinessUnitParameters,
  updateBusinessUnitParameters,
} from './parameters';
import {
  ApiRoot,
  BusinessUnitDraft,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  queryBusinessUnits,
  readBusinessUnitById,
  readBusinessUnitByKey,
  updateBusinessUnitById,
  updateBusinessUnitByKey,
  createBusinessUnit as createBusinessUnitBase,
} from './base.functions';

export const readBusinessUnit = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readBusinessUnitParameters>
) => {
  try {
    // Case 1: Read business unit by ID
    if (params.id) {
      return await readBusinessUnitById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    }

    // Case 2: Read business unit by key
    if (params.key) {
      const businessUnit = await readBusinessUnitByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand
      );
      return businessUnit;
    }

    // Case 3: Query business units with provided where conditions
    if (params.where) {
      return await queryBusinessUnits(
        apiRoot,
        context.projectKey,
        params.where,
        params.limit,
        params.offset,
        params.sort,
        params.expand,
        params.storeKey
      );
    }

    // Case 4: Query all business units
    return await queryBusinessUnits(
      apiRoot,
      context.projectKey,
      undefined,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      params.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read business unit', error);
  }
};

export const createBusinessUnit = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createBusinessUnitParameters>
) => {
  try {
    let businessUnit;

    if (params.storeKey) {
      // Using in-store endpoint
      businessUnit = await createBusinessUnitBase(
        apiRoot,
        context.projectKey,
        params as BusinessUnitDraft,
        params.storeKey
      );
    } else {
      businessUnit = await createBusinessUnitBase(
        apiRoot,
        context.projectKey,
        params as BusinessUnitDraft
      );
    }

    return businessUnit;
  } catch (error: any) {
    throw new SDKError('Failed to create business unit', error);
  }
};

export const updateBusinessUnit = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateBusinessUnitParameters>
) => {
  try {
    // Handle the different combinations of id/key and store/no-store
    if (params.id) {
      return await updateBusinessUnitById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as BusinessUnitUpdateAction[],
        params.storeKey
      );
    } else if (params.key) {
      return await updateBusinessUnitByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as BusinessUnitUpdateAction[],
        params.storeKey
      );
    } else {
      throw new Error('Either id or key must be provided');
    }
  } catch (error: any) {
    throw new SDKError('Failed to update business unit', error);
  }
};

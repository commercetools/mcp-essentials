import {
  ApiRoot,
  BusinessUnitDraft,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {
  queryBusinessUnits,
  readBusinessUnitById,
  readBusinessUnitByKey,
  updateBusinessUnitById,
  updateBusinessUnitByKey,
  createBusinessUnit as baseCreateBusinessUnit,
} from './base.functions';
import {
  readBusinessUnitParameters,
  createBusinessUnitParameters,
  updateBusinessUnitParameters,
} from './parameters';

export const readBusinessUnit = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readBusinessUnitParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Case 1: Read business unit by ID
    if (params.id) {
      return readBusinessUnitById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand,
        context.storeKey
      );
    }

    // Case 2: Read business unit by key
    if (params.key) {
      return readBusinessUnitByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.expand,
        context.storeKey
      );
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
        context.storeKey
      );
    }

    // Case 4: Query all business units in store
    return await queryBusinessUnits(
      apiRoot,
      context.projectKey,
      undefined,
      params.limit,
      params.offset,
      params.sort,
      params.expand,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to read business unit', error);
  }
};

export const createBusinessUnit = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createBusinessUnitParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Ensure the business unit is associated with the store
    const businessUnitDraft = {
      ...params,
      stores: params.stores || [
        {
          key: context.storeKey,
          typeId: 'store',
        },
      ],
      storeMode: params.storeMode || 'Explicit',
    } as BusinessUnitDraft;

    // Use base function with store context
    return await baseCreateBusinessUnit(
      apiRoot,
      context.projectKey,
      businessUnitDraft,
      context.storeKey
    );
  } catch (error: any) {
    throw new SDKError('Failed to create business unit', error);
  }
};

export const updateBusinessUnit = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateBusinessUnitParameters>
) => {
  try {
    if (!context.storeKey) {
      throw new SDKError('Store key is required', {});
    }

    // Verify that the business unit belongs to the store before updating
    if (params.id) {
      return await updateBusinessUnitById(
        apiRoot,
        context.projectKey,
        params.id,
        params.actions as BusinessUnitUpdateAction[],
        context.storeKey
      );
    }

    if (params.key) {
      return await updateBusinessUnitByKey(
        apiRoot,
        context.projectKey,
        params.key,
        params.actions as BusinessUnitUpdateAction[],
        context.storeKey
      );
    }

    throw new SDKError('Either id or key must be provided for update', {});
  } catch (error: any) {
    throw new SDKError('Failed to update business unit', error);
  }
};

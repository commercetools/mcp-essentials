import * as store from './store.functions';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readBusinessUnitParameters,
  createBusinessUnitParameters,
  updateBusinessUnitParameters,
} from './parameters';

// Context mapping function for business unit functions
export const contextToBusinessUnitFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.storeKey) {
    return {
      read_business_unit: store.readBusinessUnit,
      create_business_unit: store.createBusinessUnit,
      update_business_unit: store.updateBusinessUnit,
    };
  }
  if (context?.isAdmin) {
    return {
      read_business_unit: admin.readBusinessUnit,
      create_business_unit: admin.createBusinessUnit,
      update_business_unit: admin.updateBusinessUnit,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use in tests
export const readBusinessUnit = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readBusinessUnitParameters>
) => {
  if (context?.storeKey) {
    return store.readBusinessUnit(apiRoot, context, params);
  }
  return admin.readBusinessUnit(apiRoot, context, params);
};

export const createBusinessUnit = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createBusinessUnitParameters>
) => {
  if (context?.storeKey) {
    return store.createBusinessUnit(apiRoot, context, params);
  }
  return admin.createBusinessUnit(apiRoot, context, params);
};

export const updateBusinessUnit = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateBusinessUnitParameters>
) => {
  if (context?.storeKey) {
    return store.updateBusinessUnit(apiRoot, context, params);
  }
  return admin.updateBusinessUnit(apiRoot, context, params);
};

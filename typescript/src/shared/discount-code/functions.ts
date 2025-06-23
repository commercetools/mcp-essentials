import {z} from 'zod';
import {
  readDiscountCodeParameters,
  createDiscountCodeParameters,
  updateDiscountCodeParameters,
} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToDiscountCodeFunctionMapping = (
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
      read_discount_code: admin.readDiscountCode,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    };
  }

  return {};
};

// Legacy function exports to maintain backward compatibility
export const readDiscountCode = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof readDiscountCodeParameters>
) => {
  return admin.readDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const createDiscountCode = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof createDiscountCodeParameters>
) => {
  return admin.createDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

export const updateDiscountCode = (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateDiscountCodeParameters>
) => {
  return admin.updateDiscountCode(
    apiRoot,
    {...context, projectKey: context.projectKey},
    params
  );
};

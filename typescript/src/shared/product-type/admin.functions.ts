import {
  ApiRoot,
  ProductTypeDraft,
  ProductTypeUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readProductTypeParameters,
  createProductTypeParameters,
  updateProductTypeParameters,
} from './parameters';
import * as base from './base.functions';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const readProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readProductTypeParameters>
) => {
  if (params.id) {
    return base.readProductTypeById(
      apiRoot,
      context.projectKey,
      params.id,
      params.expand
    );
  }

  const queryArgs = {
    limit: params.limit || 10,
    ...(params.offset && {offset: params.offset}),
    ...(params.sort && {sort: params.sort}),
    ...(params.where && {where: params.where}),
    ...(params.expand && {expand: params.expand}),
  };

  return base.queryProductTypes(apiRoot, context.projectKey, queryArgs);
};

export const createProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductTypeParameters>
) => {
  return base.createProductTypeBase(
    apiRoot,
    context.projectKey,
    params as ProductTypeDraft
  );
};

export const updateProductType = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductTypeParameters>
) => {
  return base.updateProductTypeBase(
    apiRoot,
    context.projectKey,
    params.id,
    params.version,
    params.actions as ProductTypeUpdateAction[]
  );
};

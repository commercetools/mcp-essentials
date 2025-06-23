import {
  ApiRoot,
  ProductDraft,
  ProductUpdateAction,
} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  listProductsParameters,
  createProductParameters,
  updateProductParameters,
} from './parameters';
import * as base from './base.functions';
import {CommercetoolsFuncContext} from '../../types/configuration';

export const listProducts = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof listProductsParameters>
) => {
  if (params.id) {
    return base.readProductById(
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

  return base.queryProducts(apiRoot, context.projectKey, queryArgs);
};

export const createProduct = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createProductParameters>
) => {
  return base.createProductBase(
    apiRoot,
    context.projectKey,
    params as ProductDraft
  );
};

export const updateProduct = (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof updateProductParameters>
) => {
  return base.updateProductBase(
    apiRoot,
    context.projectKey,
    params.id,
    params.version,
    params.actions as ProductUpdateAction[]
  );
};

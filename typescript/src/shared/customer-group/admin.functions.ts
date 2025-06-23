import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {
  CreateCustomerGroupParameters,
  QueryCustomerGroupsParameters,
  ReadCustomerGroupByIdParameters,
  ReadCustomerGroupByKeyParameters,
  UpdateCustomerGroupByIdParameters,
  UpdateCustomerGroupByKeyParameters,
} from './parameters';

/**
 * Reads a customer group based on provided parameters
 */
export function readCustomerGroup(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params:
    | ReadCustomerGroupByIdParameters
    | ReadCustomerGroupByKeyParameters
    | QueryCustomerGroupsParameters
) {
  if ('id' in params) {
    return readCustomerGroupById(apiRoot, context, params);
  } else if ('key' in params) {
    return readCustomerGroupByKey(apiRoot, context, params);
  } else {
    return queryCustomerGroups(apiRoot, context, params);
  }
}

/**
 * Updates a customer group based on provided parameters
 */
export function updateCustomerGroup(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: UpdateCustomerGroupByIdParameters | UpdateCustomerGroupByKeyParameters
) {
  if ('id' in params) {
    return updateCustomerGroupById(apiRoot, context, params);
  } else if ('key' in params) {
    return updateCustomerGroupByKey(apiRoot, context, params);
  } else {
    throw new Error(
      'Either id or key must be provided to update a customer group'
    );
  }
}

/**
 * Fetches a customer group by its ID
 */
export function readCustomerGroupById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: ReadCustomerGroupByIdParameters
) {
  return base.readCustomerGroupById(apiRoot, context.projectKey, parameters);
}

/**
 * Fetches a customer group by its key
 */
export function readCustomerGroupByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: ReadCustomerGroupByKeyParameters
) {
  return base.readCustomerGroupByKey(apiRoot, context.projectKey, parameters);
}

/**
 * Queries customer groups based on provided parameters
 */
export function queryCustomerGroups(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: QueryCustomerGroupsParameters
) {
  return base.queryCustomerGroups(apiRoot, context.projectKey, parameters);
}

/**
 * Creates a new customer group
 */
export function createCustomerGroup(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: CreateCustomerGroupParameters
) {
  return base.createCustomerGroup(apiRoot, context.projectKey, parameters);
}

/**
 * Updates a customer group by its ID
 */
export function updateCustomerGroupById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: UpdateCustomerGroupByIdParameters
) {
  return base.updateCustomerGroupById(apiRoot, context.projectKey, parameters);
}

/**
 * Updates a customer group by its key
 */
export function updateCustomerGroupByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  parameters: UpdateCustomerGroupByKeyParameters
) {
  return base.updateCustomerGroupByKey(apiRoot, context.projectKey, parameters);
}

import {z} from 'zod';
import {
  createCustomerParameters,
  updateCustomerParameters,
  readCustomerParameters,
} from './parameters';
import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {
  readCustomerById,
  queryCustomers,
  createCustomer as baseCreateCustomer,
  updateCustomer as baseUpdateCustomer,
} from './base.functions';
import {CommercetoolsFuncContext} from '../../types/configuration';

// Read any customer as admin
export const readCustomer = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCustomerParameters>
) => {
  try {
    if (params.id) {
      if (params.storeKey) {
        return await readCustomerById(
          apiRoot,
          context.projectKey,
          params.id,
          params.expand,
          params.storeKey
        );
      }
      return await readCustomerById(
        apiRoot,
        context.projectKey,
        params.id,
        params.expand
      );
    } else {
      return await queryCustomers(
        apiRoot,
        context.projectKey,
        params.limit,
        params.offset,
        params.sort,
        params.where,
        params.expand
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to read customer', error);
  }
};

// Create customer as admin
export const createCustomerAsAdmin = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createCustomerParameters>
) => {
  try {
    if (params.storeKey) {
      return await baseCreateCustomer(
        apiRoot,
        context.projectKey,
        params as CustomerDraft,
        context.storeKey
      );
    }
    return await baseCreateCustomer(
      apiRoot,
      context.projectKey,
      params as CustomerDraft
    );
  } catch (error: any) {
    throw new SDKError('Failed to create customer', error);
  }
};

// Update customer as admin
export const updateCustomerAsAdmin = async (
  apiRoot: ApiRoot,
  context: {projectKey: string},
  params: z.infer<typeof updateCustomerParameters>
) => {
  try {
    return await baseUpdateCustomer(
      apiRoot,
      context.projectKey,
      params.id,
      params.version,
      params.actions as CustomerUpdateAction[]
    );
  } catch (error: any) {
    throw new SDKError('Failed to update customer', error);
  }
};

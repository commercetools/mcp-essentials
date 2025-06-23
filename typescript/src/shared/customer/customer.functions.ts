import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../types/configuration';
import {SDKError} from '../errors/sdkError';
import {readCustomerById} from './base.functions';
import {readCustomerParameters} from './parameters';

// Helper function to verify that a customer can read their own profile
export const readCustomerProfile = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readCustomerParameters>
) => {
  try {
    return await readCustomerById(
      apiRoot,
      context.projectKey,
      context.customerId!,
      params.expand
    );
  } catch (error: any) {
    throw new SDKError('Failed to read customer profile', error);
  }
};

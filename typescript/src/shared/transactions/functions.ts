/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable require-await */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTransactionParameters,
  readTransactionParameters,
} from './parameters';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToTransactionFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: any,
    context: CommercetoolsFuncContext,
    params: any,
    getApiRoot?: Function
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      read_transaction: admin.readTransaction,
      create_transaction: admin.createTransaction,
    };
  }

  return {};
};

/**
 * Reads transactions based on provided parameters:
 * - If 'id' is provided, retrieves a specific transaction by ID
 * - If 'key' is provided, retrieves a specific transaction by key
 * - If neither is provided, lists transactions with optional filtering, sorting, and pagination
 */
export async function readTransaction(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readTransactionParameters>,
  getApiRoot?: Function
) {
  return admin.readTransaction(apiRoot, context, params, getApiRoot);
}

/**
 * Creates a new transaction in the commercetools platform
 */
export async function createTransaction(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createTransactionParameters>,
  getApiRoot?: Function
) {
  return admin.createTransaction(apiRoot, context, params, getApiRoot);
}

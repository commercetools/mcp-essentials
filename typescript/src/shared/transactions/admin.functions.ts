/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createTransactionParameters,
  readTransactionParameters,
} from './parameters';
import {CommercetoolsFuncContext} from '../../types/configuration';
import * as base from './base.functions';
import {SDKError} from '../errors/sdkError';

/**
 * Reads transactions based on provided parameters
 */
export async function readTransaction(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof readTransactionParameters>,
  getApiRoot?: Function
) {
  try {
    const {id, key} = params;

    if (id) {
      // Get transaction by ID
      return await readTransactionById(
        apiRoot,
        context,
        {
          id,
          expand: params.expand,
        },
        getApiRoot
      );
    } else if (key) {
      // Get transaction by key
      return await readTransactionByKey(
        apiRoot,
        context,
        {
          key,
          expand: params.expand,
        },
        getApiRoot
      );
    }
  } catch (error: any) {
    throw new SDKError('Failed to read transaction', error);
  }
}

/**
 * Reads a transaction by ID
 */
export function readTransactionById(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {id: string; expand?: string[]},
  getApiRoot?: Function
) {
  return base.readTransactionById(
    apiRoot,
    context.projectKey,
    params,
    getApiRoot
  );
}

/**
 * Reads a transaction by key
 */
export function readTransactionByKey(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: {key: string; expand?: string[]},
  getApiRoot?: Function
) {
  return base.readTransactionByKey(
    apiRoot,
    context.projectKey,
    params,
    getApiRoot
  );
}

/**
 * Creates a new transaction
 */
export async function createTransaction(
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof createTransactionParameters>,
  getApiRoot?: Function
) {
  try {
    return await base.createTransaction(
      apiRoot,
      context.projectKey,
      params,
      getApiRoot
    );
  } catch (error: any) {
    throw new SDKError('Failed to create transaction', error);
  }
}

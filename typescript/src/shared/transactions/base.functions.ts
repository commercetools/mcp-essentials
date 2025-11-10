/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {ApiRoot} from '@commercetools/platform-sdk';
import {createApiBuilderFromCtpClient} from '@commercetools/checkout-sdk';
import {z} from 'zod';
import {
  createTransactionParameters,
  readTransactionParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';
/**
 * Reads a transaction by ID
 */
export async function readTransactionById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof readTransactionParameters>,
  getApiRoot?: Function
) {
  try {
    const api = getApiRoot!(
      createApiBuilderFromCtpClient,
      'https://checkout.europe-west1.gcp.commercetools.com'
    );

    const transactionRequest = api
      .withProjectKey({projectKey})
      .transactions()
      .withId({id: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await transactionRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading transaction by ID', error);
  }
}

/**
 * Reads a transaction by key
 */
export async function readTransactionByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]},
  getApiRoot?: Function
) {
  try {
    const api = getApiRoot!(
      createApiBuilderFromCtpClient,
      'https://checkout.europe-west1.gcp.commercetools.com'
    );

    const transactionRequest = api
      .withProjectKey({projectKey})
      .transactions()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await transactionRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading transaction by key', error);
  }
}

/**
 * Creates a new transaction
 */
export async function createTransaction(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createTransactionParameters>,
  getApiRoot?: Function
) {
  try {
    const api = getApiRoot!(
      createApiBuilderFromCtpClient,
      'https://checkout.europe-west1.gcp.commercetools.com'
    );

    const transactionDraft = {
      key: params.key,
      application: params.application,
      cart: params.cart,
      transactionItems: params.transactionItems,
    };

    const transactionRequest = api
      .withProjectKey({projectKey})
      .transactions()
      .post({
        body: transactionDraft,
      });

    const response = await transactionRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating transaction', error);
  }
}

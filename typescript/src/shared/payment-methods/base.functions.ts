import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  createPaymentMethodParameters,
  readPaymentMethodParameters,
  updatePaymentMethodParameters,
} from './parameters';
import {SDKError} from '../errors/sdkError';

/**
 * Reads a payment method by ID
 */
export async function readPaymentMethodById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; expand?: string[]}
) {
  try {
    const paymentMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .withId({ID: params.id})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await paymentMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading payment method by ID', error);
  }
}

/**
 * Reads a payment method by key
 */
export async function readPaymentMethodByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; expand?: string[]}
) {
  try {
    const paymentMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .withKey({key: params.key})
      .get({
        queryArgs: {
          expand: params.expand,
        },
      });

    const response = await paymentMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error reading payment method by key', error);
  }
}

/**
 * Lists payment methods
 */
export async function queryPaymentMethods(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {
    limit?: number;
    offset?: number;
    sort?: string[];
    where?: string[];
    expand?: string[];
  }
) {
  try {
    const paymentMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .get({
        queryArgs: {
          limit: params.limit,
          offset: params.offset,
          sort: params.sort,
          where: params.where,
          expand: params.expand,
        },
      });

    const response = await paymentMethodRequest.execute();
    return response.body;
  } catch (error) {
    // Preserve the original error message for testing
    console.error('Error querying payment methods:', error);
    throw error;
  }
}

/**
 * Creates a new payment method
 */
export async function createPaymentMethod(
  apiRoot: ApiRoot,
  projectKey: string,
  params: z.infer<typeof createPaymentMethodParameters>
) {
  try {
    const paymentMethodDraft = {
      key: params.key,
      name: params.name,
      description: params.description,
      paymentInterface: params.paymentInterface,
      method: params.method,
      interfaceAccount: params.interfaceAccount,
      default: params.default,
      paymentMethodStatus: params.paymentMethodStatus,
      customer: params.customer,
      businessUnit: params.businessUnit,
      custom: params.custom,
    };

    const paymentMethodRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .post({
        body: paymentMethodDraft,
      });

    const response = await paymentMethodRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error creating payment method', error);
  }
}

/**
 * Updates a payment method by ID
 */
export async function updatePaymentMethodById(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {id: string; version: number; actions: any[]}
) {
  try {
    // Filter out any 'delete' actions
    const updateActions = params.actions.filter(
      (action) => action.action !== 'delete'
    );

    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .withId({ID: params.id})
      .post({
        body: {
          version: params.version,
          actions: updateActions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating payment method by ID', error);
  }
}

/**
 * Updates a payment method by key
 */
export async function updatePaymentMethodByKey(
  apiRoot: ApiRoot,
  projectKey: string,
  params: {key: string; version: number; actions: any[]}
) {
  try {
    // Filter out any 'delete' actions
    const updateActions = params.actions.filter(
      (action) => action.action !== 'delete'
    );

    const updateRequest = apiRoot
      .withProjectKey({projectKey})
      .paymentMethods()
      .withKey({key: params.key})
      .post({
        body: {
          version: params.version,
          actions: updateActions,
        },
      });

    const response = await updateRequest.execute();
    return response.body;
  } catch (error) {
    throw new SDKError('Error updating payment method by key', error);
  }
}

export async function updatePaymentMethod(
  apiRoot: ApiRoot,
  projectKey: string,
  params: any
) {
  try {
    const {id, key, version, actions} = params;

    if (id) {
      return await updatePaymentMethodById(apiRoot, projectKey, params);
    } else if (key) {
      return await updatePaymentMethodByKey(apiRoot, projectKey, params);
    }

    throw new Error(
      'Either id or key must be provided for updating a payment method'
    );
  } catch (error) {
    throw new SDKError('Error updating payment method', error);
  }
}

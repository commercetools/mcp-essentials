import * as customer from './customer.functions';
import * as admin from './admin.functions';
import * as store from './store.functions';
import * as asAssociate from './as-associate.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readOrderParameters,
  updateOrderParameters,
  createOrderParameters,
} from './parameters';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';

export const contextToOrderFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  // Prioritize as-associate functions when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return {
      read_order: asAssociate.readAssociateOrder,
      create_order: asAssociate.createAssociateOrder,
      update_order: asAssociate.updateAssociateOrder,
    };
  }
  if (context?.customerId) {
    return {
      read_order: customer.readCustomerOrder,
    };
  }
  if (context?.storeKey) {
    return {
      read_order: store.readStoreOrder,
      create_order: store.createOrderInStore,
      update_order: store.updateOrderByIdInStore,
    };
  }
  if (context?.isAdmin) {
    return {
      read_order: admin.readOrder,
      create_order: admin.createOrder,
      update_order: admin.updateOrder,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use in tests
export const readOrder = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readOrderParameters>
) => {
  // Prioritize as-associate when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return asAssociate.readAssociateOrder(apiRoot, context, params);
  }
  if (context?.customerId) {
    return customer.readCustomerOrder(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    return store.readStoreOrder(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.readOrder(apiRoot, context, params);
};

export const createOrderFromCart = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createOrderParameters>
) => {
  // Prioritize as-associate when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return asAssociate.createAssociateOrder(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    return store.createOrderInStore(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.createOrder(apiRoot, context, params);
};

export const createOrderFromQuote = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createOrderParameters>
) => {
  // Prioritize as-associate when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return asAssociate.createAssociateOrder(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    return store.createOrderInStore(apiRoot, context, {
      ...params,
      storeKey: context?.storeKey || params.storeKey,
    });
  }
  return admin.createOrder(apiRoot, context, params);
};

export const createOrderByImport = (
  apiRoot: ApiRoot,
  context: any,
  params: any
) => {
  // Only available in admin context
  return admin.createOrder(apiRoot, context, params);
};

export const updateOrder = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateOrderParameters>
) => {
  // Prioritize as-associate when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return asAssociate.updateAssociateOrder(apiRoot, context, params);
  }
  if (context?.storeKey || params?.storeKey) {
    const storeKey = context?.storeKey || params.storeKey;

    if (params.id) {
      return store.updateOrderByIdInStore(apiRoot, context, {
        ...params,
        id: params.id,
        storeKey,
      });
    } else if (params.orderNumber) {
      return store.updateOrderByOrderNumberInStore(apiRoot, context, {
        ...params,
        orderNumber: params.orderNumber,
        storeKey,
      });
    } else {
      throw new Error('Either id or orderNumber must be provided');
    }
  }
  return admin.updateOrder(apiRoot, context, params);
};

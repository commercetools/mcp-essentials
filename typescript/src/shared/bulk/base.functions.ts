import {z} from 'zod';
import {bulkCreateParameters, bulkUpdateParameters} from './parameters';
import {ApiRoot} from '@commercetools/platform-sdk';
import {createBusinessUnit} from '../business-unit/functions';
import {createProduct} from '../products/functions';
import {createCustomer} from '../customer/functions';
// import {createCart} from '../cart/functions';
import {createCategory} from '../category/functions';
import {createChannel} from '../channel/functions';
import {createDiscountCode} from '../discount-code/functions';
import {createCartDiscount} from '../cart-discount/functions';
import {createProductDiscount} from '../product-discount/functions';
import {createCustomerGroup} from '../customer-group/functions';
import {createQuote} from '../quote/admin.functions';
import {createQuoteRequest} from '../quote-request/functions';
import {createStagedQuote} from '../staged-quote/functions';
import {createStandalonePrice} from '../standalone-price/functions';
import {createInventory} from '../inventory/functions';
import {createOrder} from '../order/admin.functions';
import {createStore} from '../store/functions';

// import {updateCart} from '../cart/functions';
import {updateBusinessUnit} from '../business-unit/functions';
import {updateCartDiscount} from '../cart-discount/functions';
import {updateCategory} from '../category/functions';
import {updateChannel} from '../channel/functions';
import {updateCustomer} from '../customer/functions';
import {updateCustomerGroup} from '../customer-group/functions';
import {updateDiscountCode} from '../discount-code/functions';
import {updateInventory} from '../inventory/functions';
import {updateOrder} from '../order/admin.functions';
import {updateProduct} from '../products/functions';
import {updateProductDiscount} from '../product-discount/functions';
import {updateProductSelection} from '../product-selection/functions';
import {updateProductType} from '../product-type/functions';
import {updateQuote} from '../quote/admin.functions';
import {updateQuoteRequest} from '../quote-request/functions';
import {updateStagedQuote} from '../staged-quote/functions';
import {updateStandalonePrice} from '../standalone-price/functions';
import {updateStore} from '../store/functions';
import {CommercetoolsFuncContext} from '../../types/configuration';

type EntityFunctionMap = {
  [key: string]: (
    apiRoot: ApiRoot,
    context: {projectKey: string},
    params: any
  ) => Promise<any>;
};

// Map entity types to their respective create functions
const entityFunctionMap: EntityFunctionMap = {
  'business-unit': createBusinessUnit,
  // cart: createCart,
  'cart-discount': createCartDiscount,
  category: createCategory,
  channel: createChannel,
  customer: createCustomer,
  'customer-group': createCustomerGroup,
  'discount-code': createDiscountCode,
  product: createProduct,
  'product-discount': createProductDiscount,
  quote: createQuote,
  'quote-request': createQuoteRequest,
  'staged-quote': createStagedQuote,
  'standalone-price': createStandalonePrice,
  inventory: createInventory,
  order: createOrder,
  store: createStore,
};

// Map entity types to their respective update functions
const entityUpdateFunctionMap: EntityFunctionMap = {
  'business-unit': updateBusinessUnit,
  // cart: updateCart,
  'cart-discount': updateCartDiscount,
  category: updateCategory,
  channel: updateChannel,
  customer: updateCustomer,
  'customer-group': updateCustomerGroup,
  'discount-code': updateDiscountCode,
  inventory: updateInventory,
  order: updateOrder,
  product: updateProduct,
  'product-discount': updateProductDiscount,
  'product-selection': updateProductSelection,
  'product-type': updateProductType,
  quote: updateQuote,
  'quote-request': updateQuoteRequest,
  'staged-quote': updateStagedQuote,
  'standalone-price': updateStandalonePrice,
  store: updateStore,
};

export const bulkCreate = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof bulkCreateParameters>
) => {
  try {
    // Create an array of promises for each entity creation
    const createPromises = params.items.map((item) => {
      const createFunction = entityFunctionMap[item.entityType];
      if (!createFunction) {
        throw new Error(`Unsupported entity type: ${item.entityType}`);
      }
      return createFunction(apiRoot, context, item.data);
    });

    // Execute all create operations in parallel
    const results = await Promise.all(createPromises);

    return {
      success: true,
      results: results,
    };
  } catch (error: any) {
    throw new Error('Bulk creation failed: ' + error.message);
  }
};

export const bulkUpdate = async (
  apiRoot: ApiRoot,
  context: CommercetoolsFuncContext,
  params: z.infer<typeof bulkUpdateParameters>
) => {
  try {
    // Create an array of promises for each entity update
    const updatePromises = params.items.map((item) => {
      const updateFunction = entityUpdateFunctionMap[item.entityType];
      if (!updateFunction) {
        throw new Error(`Unsupported entity type: ${item.entityType}`);
      }
      return updateFunction(apiRoot, context, item.data);
    });

    // Execute all update operations in parallel
    const results = await Promise.all(updatePromises);

    return {
      success: true,
      results: results,
    };
  } catch (error: any) {
    throw new Error('Bulk update failed: ' + error.message);
  }
};

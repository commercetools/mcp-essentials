import {contextToBusinessUnitTools} from './business-unit/tools';
import {contextToProductsTools} from './products/tools';
import {contextToProjectTools} from './project/tools';
import {contextToProductSearchTools} from './product-search/tools';
import {contextToCategoryTools} from './category/tools';
import {contextToChannelTools} from './channel/tools';
import {contextToProductSelectionTools} from './product-selection/tools';
import {contextToOrderTools} from './order/tools';
import {contextToCartTools} from './cart/tools';
import {contextToCustomerTools} from './customer/tools';
import {contextToCustomerGroupTools} from './customer-group/tools';
import {contextToQuoteTools} from './quote/tools';
import {contextToQuoteRequestTools} from './quote-request/tools';
import {contextToStagedQuoteTools} from './staged-quote/tools';
import {contextToStandalonePriceTools} from './standalone-price/tools';
import {contextToProductDiscountTools} from './product-discount/tools';
import {contextToCartDiscountTools} from './cart-discount/tools';
import {contextToDiscountCodeTools} from './discount-code/tools';
import {contextToProductTypeTools} from './product-type/tools';
import {contextToBulkTools} from './bulk/tools';
import {contextToInventoryTools} from './inventory/tools';
import {contextToStoreTools} from './store/tools';
import {contextToReviewTools} from './reviews/tools';
import {contextToPaymentTools} from './payments/tools';
import {contextToShippingMethodTools} from './shipping-methods/tools';
import {contextToTaxCategoryTools} from './tax-category/tools';
import {contextToZoneTools} from './zones/tools';
import {contextToProductTailoringTools} from './product-tailoring/tools';
import {contextToPaymentMethodTools} from './payment-methods/tools';
import {contextToRecurringOrderTools} from './recurring-orders/tools';
import {contextToShoppingListTools} from './shopping-lists/tools';
import {contextToExtensionTools} from './extensions/tools';
import {contextToSubscriptionTools} from './subscriptions/tools';
import {contextToCustomObjectTools} from './custom-objects/tools';
import {contextToTypeTools} from './types/tools';
import {Context} from '../types/configuration';

export const contextToResourceTools = (context?: Context) => {
  return {
    'business-unit': contextToBusinessUnitTools(context),
    cart: contextToCartTools(context),
    'cart-discount': contextToCartDiscountTools(context),
    category: contextToCategoryTools(context),
    channel: contextToChannelTools(context),
    customer: contextToCustomerTools(context),
    'customer-group': contextToCustomerGroupTools(context),
    'discount-code': contextToDiscountCodeTools(context),
    order: contextToOrderTools(context),
    inventory: contextToInventoryTools(context),
    products: contextToProductsTools(context),
    review: contextToReviewTools(context),
    project: contextToProjectTools(context),
    'product-search': contextToProductSearchTools(context),
    'product-selection': contextToProductSelectionTools(context),
    quote: contextToQuoteTools(context),
    'quote-request': contextToQuoteRequestTools(context),
    'staged-quote': contextToStagedQuoteTools(context),
    'standalone-price': contextToStandalonePriceTools(context),
    'product-discount': contextToProductDiscountTools(context),
    'product-type': contextToProductTypeTools(context),
    store: contextToStoreTools(context),
    bulk: contextToBulkTools(context),
    payments: contextToPaymentTools(context),
    'shipping-methods': contextToShippingMethodTools(context),
    'tax-category': contextToTaxCategoryTools(context),
    zone: contextToZoneTools(context),
    'product-tailoring': contextToProductTailoringTools(context),
    'payment-methods': contextToPaymentMethodTools(context),
    'recurring-orders': contextToRecurringOrderTools(context),
    'shopping-lists': contextToShoppingListTools(context),
    extension: contextToExtensionTools(context),
    subscription: contextToSubscriptionTools(context),
    'custom-objects': contextToCustomObjectTools(context),
    types: contextToTypeTools(context),
  };
};
export const contextToTools = (context?: Context) => {
  const resourceTools = contextToResourceTools(context);

  return Object.values(resourceTools).flat();
};

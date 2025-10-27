import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../types/configuration';
import {contextToBulkFunctionMapping} from './bulk/functions';
import {contextToBusinessUnitFunctionMapping} from './business-unit/functions';
import {contextToCartDiscountFunctionMapping} from './cart-discount/functions';
import {contextToCartFunctionMapping} from './cart/functions';
import {contextToCategoryFunctionMapping} from './category/functions';
import {contextToChannelFunctionMapping} from './channel/functions';
import {contextToCustomerGroupFunctionMapping} from './customer-group/functions';
import {contextToCustomerFunctionMapping} from './customer/functions';
import {contextToDiscountCodeFunctionMapping} from './discount-code/functions';
import {contextToInventoryFunctionMapping} from './inventory/functions';
import {contextToOrderFunctionMapping} from './order/functions';
import {contextToReviewFunctionMapping} from './reviews/functions';
import {contextToProductDiscountFunctionMapping} from './product-discount/functions';
import {contextToProductSearchFunctionMapping} from './product-search/functions';
import {contextToProductSelectionFunctionMapping} from './product-selection/functions';
import {contextToProductTypeFunctionMapping} from './product-type/functions';
import {contextToProductFunctionMapping} from './products/functions';
import {contextToProjectFunctionMapping} from './project/functions';
import {contextToQuoteFunctionMapping} from './quote/functions';
import {contextToQuoteRequestFunctionMapping} from './quote-request/functions';
import {contextToStagedQuoteFunctionMapping} from './staged-quote/functions';
import {contextToStandalonePriceFunctionMapping} from './standalone-price/functions';
import {contextToStoreFunctionMapping} from './store/functions';
import {contextToResourceBasedToolSystemFunctionMapping} from './resource-based-tools-system/functions';
import {contextToPaymentFunctionMapping} from './payments/functions';
import {contextToShippingMethodFunctionMapping} from './shipping-methods/functions';
import {contextToTaxCategoryFunctionMapping} from './tax-category/functions';
import {contextToZoneFunctionMapping} from './zones/functions';
import {contextToProductTailoringFunctionMapping} from './product-tailoring/functions';
import {contextToPaymentMethodFunctionMapping} from './payment-methods/functions';
import {contextToRecurringOrderFunctionMapping} from './recurring-orders/functions';
import {contextToShoppingListFunctionMapping} from './shopping-lists/functions';
import {contextToExtensionFunctionMapping} from './extensions/functions';
import {contextToSubscriptionFunctionMapping} from './subscriptions/functions';

export const contextToFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  return {
    ...contextToBusinessUnitFunctionMapping(context),
    ...contextToOrderFunctionMapping(context),
    ...contextToCartFunctionMapping(context),
    ...contextToCartDiscountFunctionMapping(context),
    ...contextToCategoryFunctionMapping(context),
    ...contextToChannelFunctionMapping(context),
    ...contextToCustomerFunctionMapping(context),
    ...contextToCustomerGroupFunctionMapping(context),
    ...contextToDiscountCodeFunctionMapping(context),
    ...contextToInventoryFunctionMapping(context),
    ...contextToProductDiscountFunctionMapping(context),
    ...contextToReviewFunctionMapping(context),
    ...contextToProductSearchFunctionMapping(context),
    ...contextToProductSelectionFunctionMapping(context),
    ...contextToProductTypeFunctionMapping(context),
    ...contextToProductFunctionMapping(context),
    ...contextToProjectFunctionMapping(context),
    ...contextToQuoteFunctionMapping(context),
    ...contextToQuoteRequestFunctionMapping(context),
    ...contextToStagedQuoteFunctionMapping(context),
    ...contextToStandalonePriceFunctionMapping(context),
    ...contextToStoreFunctionMapping(context),
    ...contextToBulkFunctionMapping(context),
    ...contextToResourceBasedToolSystemFunctionMapping(context),
    ...contextToPaymentFunctionMapping(context),
    ...contextToShippingMethodFunctionMapping(context),
    ...contextToTaxCategoryFunctionMapping(context),
    ...contextToZoneFunctionMapping(context),
    ...contextToProductTailoringFunctionMapping(context),
    ...contextToPaymentMethodFunctionMapping(context),
    ...contextToRecurringOrderFunctionMapping(context),
    ...contextToShoppingListFunctionMapping(context),
    ...contextToExtensionFunctionMapping(context),
    ...contextToSubscriptionFunctionMapping(context),
  };
};

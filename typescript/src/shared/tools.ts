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
import {Context} from '../types/configuration';

export const contextToResourceTools = (context?: Context) => {
  return {
    businessUnits: contextToBusinessUnitTools(context),
    carts: contextToCartTools(context),
    cartDiscounts: contextToCartDiscountTools(context),
    categories: contextToCategoryTools(context),
    channels: contextToChannelTools(context),
    customers: contextToCustomerTools(context),
    customerGroups: contextToCustomerGroupTools(context),
    discountCodes: contextToDiscountCodeTools(context),
    orders: contextToOrderTools(context),
    inventory: contextToInventoryTools(context),
    products: contextToProductsTools(context),
    project: contextToProjectTools(context),
    productSearch: contextToProductSearchTools(context),
    productSelections: contextToProductSelectionTools(context),
    quotes: contextToQuoteTools(context),
    quoteRequests: contextToQuoteRequestTools(context),
    stagedQuotes: contextToStagedQuoteTools(context),
    standalonePrices: contextToStandalonePriceTools(context),
    productDiscounts: contextToProductDiscountTools(context),
    productTypes: contextToProductTypeTools(context),
    stores: contextToStoreTools(context),
    bulk: contextToBulkTools(context),
  };
};
export const contextToTools = (context?: Context) => {
  const resourceTools = contextToResourceTools(context);

  return Object.values(resourceTools).flat();
};

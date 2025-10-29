import {z} from 'zod';
import {createBusinessUnitParameters} from '../business-unit/parameters';
import {createProductParameters} from '../products/parameters';
import {createCustomerParameters} from '../customer/parameters';
import {createCartParameters} from '../cart/parameters';
import {createCategoryParameters} from '../category/parameters';
import {createChannelParameters} from '../channel/parameters';
import {createDiscountCodeParameters} from '../discount-code/parameters';
import {createCartDiscountParameters} from '../cart-discount/parameters';
import {createProductDiscountParameters} from '../product-discount/parameters';
import {createCustomerGroupParametersSchema} from '../customer-group/parameters';
import {createQuoteParameters} from '../quote/parameters';
import {createQuoteRequestParameters} from '../quote-request/parameters';
import {createStagedQuoteParameters} from '../staged-quote/parameters';
import {createStandalonePriceParameters} from '../standalone-price/parameters';
import {createInventoryParameters} from '../inventory/parameters';
import {createOrderParameters} from '../order/parameters';
import {createStoreParameters} from '../store/parameters';
import {createReviewParameters} from '../reviews/parameters';
import {createRecurringOrderParameters} from '../recurring-orders/parameters';
import {createShoppingListParameters} from '../shopping-lists/parameters';
import {createCustomObjectParameters} from '../custom-objects/parameters';
import {createTypeParameters} from '../types/parameters';

import {updateBusinessUnitParameters} from '../business-unit/parameters';
import {updateProductParameters} from '../products/parameters';
import {updateCustomerParameters} from '../customer/parameters';
import {updateCartParameters} from '../cart/parameters';
import {updateCategoryParameters} from '../category/parameters';
import {updateChannelParameters} from '../channel/parameters';
import {updateDiscountCodeParameters} from '../discount-code/parameters';
import {updateCartDiscountParameters} from '../cart-discount/parameters';
import {updateProductDiscountParameters} from '../product-discount/parameters';
import {updateCustomerGroupByIdParametersSchema} from '../customer-group/parameters';
import {updateQuoteParameters} from '../quote/parameters';
import {updateQuoteRequestParameters} from '../quote-request/parameters';
import {updateStagedQuoteParameters} from '../staged-quote/parameters';
import {updateStandalonePriceParameters} from '../standalone-price/parameters';
import {updateInventoryParameters} from '../inventory/parameters';
import {updateOrderParameters} from '../order/parameters';
import {updateProductSelectionParameters} from '../product-selection/parameters';
import {updateProductTypeParameters} from '../product-type/parameters';
import {updateStoreParameters} from '../store/parameters';
import {updateReviewParameters} from '../reviews/parameters';
import {updateRecurringOrderParameters} from '../recurring-orders/parameters';
import {updateShoppingListParameters} from '../shopping-lists/parameters';
import {updateCustomObjectParameters} from '../custom-objects/parameters';
import {updateTypeParameters} from '../types/parameters';

// Define the bulk create parameters for products
export const bulkCreateParameters = z.object({
  items: z.array(
    z.object({
      entityType: z.enum([
        'business-unit',
        'product',
        'customer',
        'cart',
        'category',
        'channel',
        'discount-code',
        'cart-discount',
        'product-discount',
        'customer-group',
        'quote',
        'quote-request',
        'staged-quote',
        'standalone-price',
        'order',
        'inventory',
        'store',
        'review',
        'recurring-orders',
        'shopping-lists',
        'custom-objects',
        'types',
      ]),
      data: z.union([
        createBusinessUnitParameters,
        createProductParameters,
        createCustomerParameters,
        createCartParameters,
        createCategoryParameters,
        createChannelParameters,
        createDiscountCodeParameters,
        createCartDiscountParameters,
        createProductDiscountParameters,
        createCustomerGroupParametersSchema,
        createQuoteParameters,
        createQuoteRequestParameters,
        createStagedQuoteParameters,
        createStandalonePriceParameters,
        createInventoryParameters,
        createOrderParameters,
        createStoreParameters,
        createReviewParameters,
        createRecurringOrderParameters,
        createShoppingListParameters,
        createCustomObjectParameters,
        createTypeParameters,
      ]),
    })
  ),
});

// Define the bulk update parameters
export const bulkUpdateParameters = z.object({
  items: z.array(
    z.object({
      entityType: z.enum([
        'business-unit',
        'product',
        'customer',
        'cart',
        'category',
        'channel',
        'discount-code',
        'cart-discount',
        'product-discount',
        'customer-group',
        'quote',
        'quote-request',
        'staged-quote',
        'standalone-price',
        'inventory',
        'order',
        'product-selection',
        'product-type',
        'store',
        'review',
        'recurring-orders',
        'shopping-lists',
        'custom-objects',
        'types',
      ]),
      data: z.union([
        updateBusinessUnitParameters,
        updateProductParameters,
        updateCustomerParameters,
        updateCartParameters,
        updateCategoryParameters,
        updateChannelParameters,
        updateDiscountCodeParameters,
        updateCartDiscountParameters,
        updateProductDiscountParameters,
        updateCustomerGroupByIdParametersSchema,
        updateQuoteParameters,
        updateQuoteRequestParameters,
        updateStagedQuoteParameters,
        updateStandalonePriceParameters,
        updateInventoryParameters,
        updateOrderParameters,
        updateProductSelectionParameters,
        updateProductTypeParameters,
        updateStoreParameters,
        updateReviewParameters,
        updateRecurringOrderParameters,
        updateShoppingListParameters,
        updateCustomObjectParameters,
        updateTypeParameters,
      ]),
    })
  ),
});

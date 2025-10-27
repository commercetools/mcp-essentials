import {z} from 'zod';
import {ApiRoot} from '@commercetools/platform-sdk';

export enum AvailableNamespaces {
  BusinessUnit = 'business-unit',
  Products = 'products',
  Project = 'project',
  ProductSearch = 'product-search',
  Category = 'category',
  ProductSelection = 'product-selection',
  Order = 'order',
  Cart = 'cart',
  Customer = 'customer',
  CustomerGroup = 'customer-group',
  StandalonePrice = 'standalone-price',
  ProductDiscount = 'product-discount',
  CartDiscount = 'cart-discount',
  DiscountCode = 'discount-code',
  ProductType = 'product-type',
  Bulk = 'bulk',
  Inventory = 'inventory',
  Store = 'store',
  Review = 'review',

  TaxCategory = 'tax-category',
  ShippingMethods = 'shipping-methods',
  Payments = 'payments',
  Zones = 'zones',

  ProductTailoring = 'product-tailoring',
  PaymentMethods = 'payment-methods',
  RecurringOrders = 'recurring-orders',
  ShoppingLists = 'shopping-lists',
  Extensions = 'extensions',
  Subscriptions = 'subscriptions',
}

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  execute?: <T = any, R = string>(args: T, api?: ApiRoot) => Promise<R>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

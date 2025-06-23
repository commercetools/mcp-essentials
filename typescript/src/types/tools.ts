import {z} from 'zod';

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
}

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

import {z} from 'zod';

// Parameters for reading a cart
export const readCartParameters = z.object({
  id: z.string().optional().describe('The ID of the cart to fetch'),
  key: z.string().optional().describe('The key of the cart to fetch'),
  customerId: z
    .string()
    .optional()
    .describe('The customer ID to fetch the cart for'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering carts. Example: ["customerId=\\"1001\\""]'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 10.'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The number of items to skip before starting to collect the result set.'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["customer", "lineItems[*].variant"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the cart from'),
});

// Parameters for creating a cart
export const createCartParameters = z.object({
  currency: z.string().describe('The currency code for the cart'),
  customerEmail: z
    .string()
    .optional()
    .describe('Email address of the Customer'),
  customerId: z
    .string()
    .optional()
    .describe('ID of the customer that the Cart belongs to'),
  customerGroup: z
    .object({
      id: z.string(),
      typeId: z.literal('customer-group'),
    })
    .optional()
    .describe('Reference to a Customer Group'),
  anonymousId: z.string().optional().describe('Anonymous session ID'),
  country: z.string().optional().describe('Country for the cart'),
  inventoryMode: z
    .enum(['None', 'TrackOnly', 'ReserveOnOrder'])
    .optional()
    .describe('The inventory mode of the cart'),
  taxMode: z
    .enum(['Platform', 'External', 'ExternalAmount', 'Disabled'])
    .optional()
    .describe('The tax mode of the cart'),
  taxRoundingMode: z
    .enum(['HalfEven', 'HalfUp', 'HalfDown'])
    .optional()
    .describe('The tax rounding mode of the cart'),
  taxCalculationMode: z
    .enum(['LineItemLevel', 'UnitPriceLevel'])
    .optional()
    .describe('The tax calculation mode of the cart'),
  store: z
    .object({
      key: z.string(),
      typeId: z.literal('store'),
    })
    .optional()
    .describe('Reference to a Store'),
  billingAddress: z
    .record(z.string(), z.any())
    .optional()
    .describe('Billing address for the cart'),
  shippingAddress: z
    .record(z.string(), z.any())
    .optional()
    .describe('Shipping address for the cart'),
  shippingMethod: z
    .object({
      id: z.string(),
      typeId: z.literal('shipping-method'),
    })
    .optional()
    .describe('Reference to a Shipping Method'),
  shippingMode: z
    .enum(['Single', 'Multiple'])
    .optional()
    .describe('The shipping mode of the cart'),
  lineItems: z
    .array(
      z.object({
        productId: z.string().optional().describe('ID of the Product'),
        variantId: z.number().optional().describe('ID of the Product Variant'),
        sku: z.string().optional().describe('SKU of the Product Variant'),
        quantity: z.number().int().min(1).describe('Quantity of the line item'),
        custom: z
          .record(z.string(), z.any())
          .optional()
          .describe('Custom fields for the line item'),
        distributionChannel: z
          .object({
            id: z.string(),
            typeId: z.literal('channel'),
          })
          .optional()
          .describe('Reference to a Channel'),
        supplyChannel: z
          .object({
            id: z.string(),
            typeId: z.literal('channel'),
          })
          .optional()
          .describe('Reference to a Channel'),
        externalTaxRate: z
          .record(z.string(), z.any())
          .optional()
          .describe('External tax rate for the line item'),
        externalPrice: z
          .record(z.string(), z.any())
          .optional()
          .describe('External price for the line item'),
        externalTotalPrice: z
          .record(z.string(), z.any())
          .optional()
          .describe('External total price for the line item'),
      })
    )
    .optional()
    .describe('Line items to be added to the cart'),
  customLineItems: z
    .array(
      z.object({
        name: z
          .record(z.string(), z.string())
          .describe('Name of the custom line item'),
        money: z
          .object({
            currencyCode: z.string(),
            centAmount: z.number(),
          })
          .describe('Price of the custom line item'),
        quantity: z
          .number()
          .int()
          .min(1)
          .describe('Quantity of the custom line item'),
        slug: z.string().describe('Slug of the custom line item'),
        taxCategory: z
          .object({
            id: z.string(),
            typeId: z.literal('tax-category'),
          })
          .optional()
          .describe('Reference to a Tax Category'),
        custom: z
          .record(z.string(), z.any())
          .optional()
          .describe('Custom fields for the custom line item'),
        externalTaxRate: z
          .record(z.string(), z.any())
          .optional()
          .describe('External tax rate for the custom line item'),
      })
    )
    .optional()
    .describe('Custom line items to be added to the cart'),
  discountCodes: z
    .array(z.string())
    .optional()
    .describe('Array of discount codes to apply to the cart'),
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier of the Cart'),
  locale: z.string().optional().describe('Locale for the cart'),
  origin: z
    .enum(['Customer', 'Merchant'])
    .optional()
    .describe('Origin of the cart'),
  custom: z
    .record(z.string(), z.any())
    .optional()
    .describe('Custom fields for the cart'),
});

// Parameters for replicating a cart
export const replicateCartParameters = z.object({
  reference: z
    .object({
      id: z.string(),
      typeId: z.literal('cart'),
    })
    .describe('Reference to the cart to replicate'),
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier of the Cart'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the cart in'),
});

// Parameters for updating a cart
export const updateCartParameters = z.object({
  id: z.string().optional().describe('The ID of the cart to update'),
  key: z.string().optional().describe('The key of the cart to update'),
  version: z.number().int().describe('The current version of the cart'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the cart. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the cart belongs to'),
});

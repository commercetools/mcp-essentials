import {z} from 'zod';

// Base Cart schema
export const cartSchema = z
  .object({
    type: z.literal('Cart'),
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z
      .string()

      .optional(),
    customerId: z
      .string()

      .optional(),
    customerEmail: z
      .string()

      .optional(),
    customerGroup: z
      .any()

      .optional(),
    anonymousId: z
      .string()

      .optional(),
    businessUnit: z
      .any()

      .optional(),
    store: z
      .any()

      .optional(),
    lineItems: z.array(z.any()),
    customLineItems: z.array(z.any()),
    totalLineItemQuantity: z
      .number()

      .optional(),
    totalPrice: z.any(),
    taxedPrice: z
      .any()

      .optional(),
    taxedShippingPrice: z
      .any()

      .optional(),
    discountOnTotalPrice: z
      .any()

      .optional(),
    taxMode: z.any(),
    priceRoundingMode: z.any(),
    taxRoundingMode: z.any(),
    taxCalculationMode: z.any(),
    inventoryMode: z.any(),
    cartState: z.any(),
    billingAddress: z
      .any()

      .optional(),
    shippingAddress: z
      .any()

      .optional(),
    shippingMode: z.any(),
    shippingKey: z
      .string()

      .optional(),
    shippingInfo: z
      .any()

      .optional(),
    shippingRateInput: z
      .any()

      .optional(),
    shippingCustomFields: z
      .any()

      .optional(),
    shipping: z.array(z.any()),
    itemShippingAddresses: z.array(z.any()),
    discountCodes: z.array(z.any()),
    directDiscounts: z.array(z.any()),
    refusedGifts: z.array(z.any()),
    paymentInfo: z
      .any()

      .optional(),
    country: z
      .string()

      .optional(),
    locale: z
      .string()

      .optional(),
    origin: z.any(),
    custom: z.any().optional(),
    discountTypeCombination: z
      .any()

      .optional(),
    deleteDaysAfterLastModification: z
      .number()

      .optional(),
    lastModifiedBy: z
      .any()

      .optional(),
    createdBy: z
      .any()

      .optional(),
  })
  .strict();

// Paged CartPagedQueryResponse schema
export const cartPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z
      .number()

      .optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readCartOutputSchema = z.union([cartSchema, cartPagedSchema]);
export const createCartOutputSchema = cartSchema;
export const replicateCartOutputSchema = cartSchema;
export const updateCartOutputSchema = cartSchema;

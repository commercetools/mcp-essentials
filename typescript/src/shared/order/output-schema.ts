import {z} from 'zod';

// Base Order schema
export const orderSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    orderNumber: z.string().optional(),
    purchaseOrderNumber: z.string().optional(),
    customerId: z.string().optional(),
    customerEmail: z.string().optional(),
    customerGroup: z.any().optional(),
    anonymousId: z.string().optional(),
    businessUnit: z.any().optional(),
    store: z.any().optional(),
    lineItems: z.array(z.any()),
    customLineItems: z.array(z.any()),
    totalPrice: z.any(),
    taxedPrice: z.any().optional(),
    taxedShippingPrice: z.any().optional(),
    discountOnTotalPrice: z.any().optional(),
    priceRoundingMode: z.any().optional(),
    taxMode: z.any().optional(),
    taxRoundingMode: z.any().optional(),
    taxCalculationMode: z.any().optional(),
    inventoryMode: z.any().optional(),
    billingAddress: z.any().optional(),
    shippingAddress: z.any().optional(),
    shippingMode: z.any(),
    shippingKey: z.string().optional(),
    shippingInfo: z.any().optional(),
    shippingRateInput: z.any().optional(),
    shippingCustomFields: z.any().optional(),
    shipping: z.array(z.any()),
    itemShippingAddresses: z.array(z.any()).optional(),
    discountCodes: z.array(z.any()).optional(),
    directDiscounts: z.array(z.any()).optional(),
    refusedGifts: z.array(z.any()),
    paymentInfo: z.any().optional(),
    country: z.string().optional(),
    locale: z.string().optional(),
    origin: z.any(),
    cart: z.any().optional(),
    quote: z.any().optional(),
    recurringOrder: z.any().optional(),
    orderState: z.any(),
    shipmentState: z.any().optional(),
    paymentState: z.any().optional(),
    state: z.any().optional(),
    syncInfo: z.array(z.any()),
    returnInfo: z.array(z.any()).optional(),
    discountTypeCombination: z.any().optional(),
    lastMessageSequenceNumber: z.number().optional(),
    custom: z.any().optional(),
    completedAt: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
  })
  .strict();

// Paged OrderPagedQueryResponse schema
export const orderPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readOrderOutputSchema = orderSchema || orderPagedSchema;
export const createOrderOutputSchema = orderSchema;
export const updateOrderOutputSchema = orderSchema;

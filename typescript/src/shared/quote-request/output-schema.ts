import {z} from 'zod';

// Generated schemas for quote-request
// DO NOT EDIT - This file is auto-generated

// Base QuoteRequest schema
export const quoteRequestSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    quoteRequestState: z.any(),
    comment: z.string().optional(),
    customer: z.any(),
    customerGroup: z.any().optional(),
    store: z.any().optional(),
    lineItems: z.array(z.any()),
    customLineItems: z.array(z.any()),
    totalPrice: z.any(),
    taxedPrice: z.any().optional(),
    shippingAddress: z.any().optional(),
    billingAddress: z.any().optional(),
    inventoryMode: z.any().optional(),
    taxMode: z.any(),
    priceRoundingMode: z.any(),
    taxRoundingMode: z.any(),
    taxCalculationMode: z.any(),
    country: z.string().optional(),
    shippingInfo: z.any().optional(),
    paymentInfo: z.any().optional(),
    shippingRateInput: z.any().optional(),
    itemShippingAddresses: z.array(z.any()).optional(),
    directDiscounts: z.array(z.any()).optional(),
    custom: z.any().optional(),
    state: z.any().optional(),
    purchaseOrderNumber: z.string().optional(),
    cart: z.any().optional(),
    businessUnit: z.any().optional(),
  })
  .strict();

// Paged QuoteRequestPagedQueryResponse schema
export const quoteRequestPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readQuoteRequestOutputSchema =
  quoteRequestSchema || quoteRequestPagedSchema;
export const createQuoteRequestOutputSchema = quoteRequestSchema;
export const updateQuoteRequestOutputSchema = quoteRequestSchema;

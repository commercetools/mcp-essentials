import {z} from 'zod';

// Base Quote schema
export const quoteSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    quoteRequest: z.any(),
    stagedQuote: z.any(),
    customer: z.any().optional(),
    customerGroup: z.any().optional(),
    validTo: z.string().optional(),
    sellerComment: z.string().optional(),
    buyerComment: z.string().optional(),
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
    quoteState: z.any(),
    state: z.any().optional(),
    purchaseOrderNumber: z.string().optional(),
    businessUnit: z.any().optional(),
  })
  .strict();

// Paged QuotePagedQueryResponse schema
export const quotePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readQuoteOutputSchema = quoteSchema || quotePagedSchema;
export const createQuoteOutputSchema = quoteSchema;
export const updateQuoteOutputSchema = quoteSchema;

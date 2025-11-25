import {z} from 'zod';

// Generated schemas for staged-quote
// DO NOT EDIT - This file is auto-generated

// Base StagedQuote schema
export const stagedQuoteSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    stagedQuoteState: z.any(),
    customer: z.any().optional(),
    quoteRequest: z.any(),
    quotationCart: z.any(),
    validTo: z.string().optional(),
    sellerComment: z.string().optional(),
    custom: z.any().optional(),
    state: z.any().optional(),
    purchaseOrderNumber: z.string().optional(),
    businessUnit: z.any().optional(),
    store: z.any().optional(),
  })
  .strict();

// Paged StagedQuotePagedQueryResponse schema
export const stagedQuotePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readStagedQuoteOutputSchema =
  stagedQuoteSchema || stagedQuotePagedSchema;
export const createStagedQuoteOutputSchema = stagedQuoteSchema;
export const updateStagedQuoteOutputSchema = stagedQuoteSchema;

import {z} from 'zod';

// Generated schemas for product-selection
// DO NOT EDIT - This file is auto-generated

// Base ProductSelection schema
export const productSelectionSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    name: z.any(),
    productCount: z.number(),
    mode: z.any(),
    custom: z.any().optional(),
  })
  .strict();

// Paged ProductSelectionPagedQueryResponse schema
export const productSelectionPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readProductSelectionOutputSchema =
  productSelectionSchema || productSelectionPagedSchema;
export const createProductSelectionOutputSchema = productSelectionSchema;
export const updateProductSelectionOutputSchema = productSelectionSchema;

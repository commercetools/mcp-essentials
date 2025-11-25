import {z} from 'zod';

// Generated schemas for product-tailoring
// DO NOT EDIT - This file is auto-generated

// Base ProductTailoring schema
export const productTailoringSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    store: z.any(),
    product: z.any(),
    published: z.boolean(),
    current: z.any(),
    staged: z.any(),
    hasStagedChanges: z.boolean(),
    warnings: z.array(z.any()).optional(),
  })
  .strict();

// Paged ProductTailoringPagedQueryResponse schema
export const productTailoringPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readProductTailoringOutputSchema =
  productTailoringSchema || productTailoringPagedSchema;
export const createProductTailoringOutputSchema = productTailoringSchema;
export const updateProductTailoringOutputSchema = productTailoringSchema;

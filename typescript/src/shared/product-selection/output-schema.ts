import {z} from 'zod';

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

export const readProductSelectionOutputSchema = z.union([productSelectionSchema, productSelectionPagedSchema]);
export const createProductSelectionOutputSchema = productSelectionSchema;
export const updateProductSelectionOutputSchema = productSelectionSchema;

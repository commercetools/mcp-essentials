import {z} from 'zod';

// Base ProductType schema
export const productTypeSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    name: z.string(),
    description: z.string(),
    attributes: z.array(z.any()).optional(),
  })
  .strict();

// Paged ProductTypePagedQueryResponse schema
export const productTypePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readProductTypeOutputSchema = z.union([productTypeSchema, productTypePagedSchema]);
export const createProductTypeOutputSchema = productTypeSchema;
export const updateProductTypeOutputSchema = productTypeSchema;

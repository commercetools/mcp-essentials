import {z} from 'zod';

// Base Category schema
export const categorySchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    name: z.any(),
    slug: z.any(),
    description: z.any().optional(),
    ancestors: z.array(z.any()),
    parent: z.any().optional(),
    orderHint: z.string(),
    externalId: z.string().optional(),
    metaTitle: z.any().optional(),
    metaDescription: z.any().optional(),
    metaKeywords: z.any().optional(),
    custom: z.any().optional(),
    assets: z.array(z.any()).optional(),
    key: z.string().optional(),
  })
  .strict();

// Paged CategoryPagedQueryResponse schema
export const categoryPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readCategoryOutputSchema = z.union([categorySchema, categoryPagedSchema]);
export const createCategoryOutputSchema = categorySchema;
export const updateCategoryOutputSchema = categorySchema;

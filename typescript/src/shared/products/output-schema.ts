import {z} from 'zod';

// Base ProductProjection schema
export const productsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    productType: z.any(),
    name: z.any(),
    description: z.any().optional(),
    slug: z.any(),
    categories: z.array(z.any()),
    categoryOrderHints: z.any().optional(),
    metaTitle: z.any().optional(),
    metaDescription: z.any().optional(),
    metaKeywords: z.any().optional(),
    searchKeywords: z.any().optional(),
    hasStagedChanges: z.boolean().optional(),
    published: z.boolean().optional(),
    masterVariant: z.any(),
    variants: z.array(z.any()),
    taxCategory: z.any().optional(),
    state: z.any().optional(),
    reviewRatingStatistics: z.any().optional(),
    priceMode: z.any().optional(),
    attributes: z.array(z.any()),
  })
  .strict();

// Paged ProductProjectionPagedQueryResponse schema
export const productsPagedSchema = z
  .object({
    limit: z.number(),
    count: z.number(),
    total: z.number().optional(),
    offset: z.number(),
    results: z.array(z.any()),
  })
  .strict();

export const listProductsOutputSchema = z.union([productsSchema, productsPagedSchema]);
export const readProductsOutputSchema = z.union([productsSchema, productsPagedSchema]);
export const createProductOutputSchema = productsSchema;
export const updateProductOutputSchema = productsSchema;

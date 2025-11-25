import {z} from 'zod';

// Base ProductProjection schema
export const productSearchSchema = z
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

// Paged ProductProjectionPagedSearchResponse schema
export const productSearchPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
    facets: z.any().optional(),
  })
  .strict();

export const searchProductsOutputSchema = productSearchPagedSchema;

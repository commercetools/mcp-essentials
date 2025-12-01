import {z} from 'zod';

// Base Review schema
export const reviewsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    uniquenessValue: z.string().optional(),
    locale: z.string().optional(),
    authorName: z.string().optional(),
    title: z.string().optional(),
    text: z.string().optional(),
    target: z.union([z.any(), z.any()]).optional(),
    includedInStatistics: z.boolean(),
    rating: z.number().optional(),
    state: z.any().optional(),
    customer: z.any().optional(),
    custom: z.any().optional(),
  })
  .strict();

// Paged ReviewPagedQueryResponse schema
export const reviewsPagedSchema = z
  .object({
    limit: z.number(),
    count: z.number(),
    total: z.number().optional(),
    offset: z.number(),
    results: z.array(z.any()),
  })
  .strict();

export const readReviewOutputSchema = z.union([reviewsSchema, reviewsPagedSchema]);
export const createReviewOutputSchema = reviewsSchema;
export const updateReviewOutputSchema = reviewsSchema;

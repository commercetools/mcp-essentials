import {z} from 'zod';

// Base TaxCategory schema
export const taxCategorySchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    name: z.string(),
    description: z.string().optional(),
    rates: z.array(z.any()),
    key: z.string().optional(),
  })
  .strict();

// Paged TaxCategoryPagedQueryResponse schema
export const taxCategoryPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readTaxCategoryOutputSchema = z.union([taxCategorySchema, taxCategoryPagedSchema]);
export const createTaxCategoryOutputSchema = taxCategorySchema;
export const updateTaxCategoryOutputSchema = taxCategorySchema;

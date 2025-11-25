import {z} from 'zod';

// Base ProductDiscount schema
export const productDiscountSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    name: z.any(),
    key: z.string().optional(),
    description: z.any().optional(),
    value: z.any(),
    predicate: z.string(),
    sortOrder: z.string(),
    isActive: z.boolean(),
    references: z.array(z.any()),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
  })
  .strict();

// Paged ProductDiscountPagedQueryResponse schema
export const productDiscountPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readProductDiscountOutputSchema =
  productDiscountSchema || productDiscountPagedSchema;
export const createProductDiscountOutputSchema = productDiscountSchema;
export const updateProductDiscountOutputSchema = productDiscountSchema;

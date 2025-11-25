import {z} from 'zod';

// Base DiscountCode schema
export const discountCodeSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    name: z.any().optional(),
    description: z.any().optional(),
    code: z.string(),
    cartDiscounts: z.array(z.any()),
    cartPredicate: z.string().optional(),
    isActive: z.boolean(),
    references: z.array(z.any()),
    maxApplications: z.number().optional(),
    maxApplicationsPerCustomer: z.number().optional(),
    custom: z.any().optional(),
    groups: z.array(z.string()),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    applicationVersion: z.number().optional(),
  })
  .strict();

// Paged DiscountCodePagedQueryResponse schema
export const discountCodePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readDiscountCodeOutputSchema =
  discountCodeSchema || discountCodePagedSchema;
export const createDiscountCodeOutputSchema = discountCodeSchema;
export const updateDiscountCodeOutputSchema = discountCodeSchema;

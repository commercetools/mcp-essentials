import {z} from 'zod';

// Generated schemas for cart-discount
// DO NOT EDIT - This file is auto-generated

// Base CartDiscount schema
export const cartDiscountSchema = z
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
    cartPredicate: z.string(),
    target: z.any().optional(),
    sortOrder: z.string(),
    stores: z.array(z.any()),
    isActive: z.boolean(),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    requiresDiscountCode: z.boolean(),
    references: z.array(z.any()),
    stackingMode: z.any(),
    custom: z.any().optional(),
    discountGroup: z.any().optional(),
  })
  .strict();

// Paged CartDiscountPagedQueryResponse schema
export const cartDiscountPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readCartDiscountOutputSchema =
  cartDiscountSchema || cartDiscountPagedSchema;
export const createCartDiscountOutputSchema = cartDiscountSchema;
export const updateCartDiscountOutputSchema = cartDiscountSchema;

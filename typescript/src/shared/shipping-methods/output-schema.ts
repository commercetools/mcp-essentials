import {z} from 'zod';

// Base ShippingMethod schema
export const shippingMethodsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    name: z.string(),
    localizedName: z.any().optional(),
    description: z.string().optional(),
    localizedDescription: z.any().optional(),
    taxCategory: z.any(),
    zoneRates: z.array(z.any()),
    active: z.boolean(),
    isDefault: z.boolean(),
    predicate: z.string().optional(),
    custom: z.any().optional(),
  })
  .strict();

// Paged ShippingMethodPagedQueryResponse schema
export const shippingMethodsPagedSchema = z
  .object({
    limit: z.number().optional(),
    count: z.number(),
    total: z.number().optional(),
    offset: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readShippingMethodsOutputSchema = z.union([shippingMethodsSchema, shippingMethodsPagedSchema]);
export const createShippingMethodsOutputSchema = shippingMethodsSchema;
export const updateShippingMethodsOutputSchema = shippingMethodsSchema;

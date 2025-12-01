import {z} from 'zod';

// Base StandalonePrice schema
export const standalonePriceSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    sku: z.string(),
    value: z.any(),
    country: z.string().optional(),
    customerGroup: z.any().optional(),
    channel: z.any().optional(),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    tiers: z.array(z.any()).optional(),
    discounted: z.any().optional(),
    custom: z.any().optional(),
    staged: z.any().optional(),
    active: z.boolean(),
    recurrencePolicy: z.any().optional(),
  })
  .strict();

// Paged StandalonePricePagedQueryResponse schema
export const standalonePricePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readStandalonePriceOutputSchema = z.union([standalonePriceSchema, standalonePricePagedSchema]);
export const createStandalonePriceOutputSchema = standalonePriceSchema;
export const updateStandalonePriceOutputSchema = standalonePriceSchema;

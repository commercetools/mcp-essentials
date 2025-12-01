import {z} from 'zod';

// Base Store schema
export const storeSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string(),
    name: z.any().optional(),
    languages: z.array(z.string()),
    countries: z.array(z.any()),
    distributionChannels: z.array(z.any()),
    supplyChannels: z.array(z.any()),
    productSelections: z.array(z.any()),
    custom: z.any().optional(),
  })
  .strict();

// Paged StorePagedQueryResponse schema
export const storePagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readStoreOutputSchema = z.union([storeSchema, storePagedSchema]);
export const createStoreOutputSchema = storeSchema;
export const updateStoreOutputSchema = storeSchema;

import {z} from 'zod';

// Base Extension schema
export const extensionsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    destination: z.any(),
    triggers: z.array(z.any()),
    timeoutInMs: z.number().optional(),
  })
  .strict();

// Paged ExtensionPagedQueryResponse schema
export const extensionsPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readExtensionOutputSchema = z.union([extensionsSchema, extensionsPagedSchema]);
export const createExtensionOutputSchema = extensionsSchema;
export const updateExtensionOutputSchema = extensionsSchema;

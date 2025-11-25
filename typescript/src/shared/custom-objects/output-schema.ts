import {z} from 'zod';

// Generated schemas for custom-objects
// DO NOT EDIT - This file is auto-generated

// Base CustomObject schema
export const customObjectsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    container: z.string(),
    key: z.string(),
    value: z.any(),
  })
  .strict();

// Paged CustomObjectPagedQueryResponse schema
export const customObjectsPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readCustomObjectOutputSchema =
  customObjectsSchema || customObjectsPagedSchema;
export const createCustomObjectOutputSchema = customObjectsSchema;
export const updateCustomObjectOutputSchema = customObjectsSchema;

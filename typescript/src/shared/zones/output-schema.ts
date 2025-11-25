import {z} from 'zod';

// Generated schemas for zones
// DO NOT EDIT - This file is auto-generated

// Base Zone schema
export const zonesSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z
      .any()

      .optional(),
    createdBy: z
      .any()

      .optional(),
    key: z
      .string()

      .optional(),
    name: z.string(),
    description: z.string().optional(),
    locations: z.array(z.any()),
  })
  .strict();

// Paged ZonePagedQueryResponse schema
export const zonesPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z
      .number()

      .optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readZoneOutputSchema = zonesSchema || zonesPagedSchema;
export const createZoneOutputSchema = zonesSchema;
export const updateZoneOutputSchema = zonesSchema;

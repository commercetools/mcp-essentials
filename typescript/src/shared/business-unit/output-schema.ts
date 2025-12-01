import {z} from 'zod';

// Base BusinessUnit schema
export const businessUnitSchema = z.object({
  id: z.string(),
  version: z.number(),
  createdAt: z.string(),
  lastModifiedAt: z.string(),
  lastModifiedBy: z.any().optional(),
  createdBy: z.any().optional(),
});

// Paged BusinessUnitPagedQueryResponse schema
export const businessUnitPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readBusinessUnitOutputSchema = z.union([businessUnitSchema, businessUnitPagedSchema]);

export const createBusinessUnitOutputSchema = businessUnitSchema;
export const updateBusinessUnitOutputSchema = businessUnitSchema;

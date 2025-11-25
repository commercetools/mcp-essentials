import {z} from 'zod';

// Generated schemas for business-unit
// DO NOT EDIT - This file is auto-generated

// Base BusinessUnit schema
export const businessUnitSchema = z.union([z.any(), z.any()]);

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

export const readBusinessUnitOutputSchema =
  businessUnitSchema || businessUnitPagedSchema;

export const createBusinessUnitOutputSchema = businessUnitSchema;
export const updateBusinessUnitOutputSchema = businessUnitSchema;

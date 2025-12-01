import {z} from 'zod';

// Base CustomerGroup schema
export const customerGroupSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    name: z.string(),
    custom: z.any().optional(),
  })
  .strict();

// Paged CustomerGroupPagedQueryResponse schema
export const customerGroupPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readCustomerGroupOutputSchema = z.union([customerGroupSchema, customerGroupPagedSchema]);
export const createCustomerGroupOutputSchema = customerGroupSchema;
export const updateCustomerGroupOutputSchema = customerGroupSchema;

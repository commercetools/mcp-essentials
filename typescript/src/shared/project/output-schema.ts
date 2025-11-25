import {z} from 'zod';

// Generated schemas for project
// DO NOT EDIT - This file is auto-generated

// Base Project schema
export const projectSchema = z
  .object({
    version: z.number(),
    key: z.string(),
    name: z.string(),
    countries: z.array(z.string()),
    currencies: z.array(z.string()),
    languages: z.array(z.string()),
    createdAt: z.string(),
    trialUntil: z.string().optional(),
    messages: z.any(),
    carts: z.any(),
    shoppingLists: z.any().optional(),
    shippingRateInputType: z.any().optional(),
    externalOAuth: z.any().optional(),
    searchIndexing: z.any().optional(),
    businessUnits: z.any().optional(),
  })
  .strict();

export const readProjectOutputSchema = projectSchema;
export const updateProjectOutputSchema = projectSchema;

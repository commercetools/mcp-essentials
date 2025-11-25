import {z} from 'zod';

// Generated schemas for recurring-orders
// DO NOT EDIT - This file is auto-generated

// Base RecurringOrder schema
export const recurringOrdersSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    cart: z.any(),
    originOrder: z.any(),
    startsAt: z.string(),
    resumesAt: z.string().optional(),
    expiresAt: z.string().optional(),
    lastOrderAt: z.string().optional(),
    nextOrderAt: z.string().optional(),
    skipConfiguration: z.any().optional(),
    store: z.any().optional(),
    businessUnit: z.any().optional(),
    state: z.any().optional(),
    recurringOrderState: z.any(),
    schedule: z.any(),
    customer: z.any().optional(),
    customerEmail: z.string().optional(),
    custom: z.any().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
  })
  .strict();

// Paged RecurringOrderPagedQueryResponse schema
export const recurringOrdersPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readRecurringOrdersOutputSchema =
  recurringOrdersSchema || recurringOrdersPagedSchema;
export const createRecurringOrdersOutputSchema = recurringOrdersSchema;
export const updateRecurringOrdersOutputSchema = recurringOrdersSchema;

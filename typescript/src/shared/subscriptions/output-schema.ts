import {z} from 'zod';

// Generated schemas for subscriptions
// DO NOT EDIT - This file is auto-generated

// Base Subscription schema
export const subscriptionsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    destination: z.any(),
    key: z.string().optional(),
    messages: z.array(z.any()),
    changes: z.array(z.any()),
    events: z.array(z.any()),
    format: z.any(),
    status: z.any(),
  })
  .strict();

// Paged SubscriptionPagedQueryResponse schema
export const subscriptionsPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readSubscriptionOutputSchema =
  subscriptionsSchema || subscriptionsPagedSchema;
export const createSubscriptionOutputSchema = subscriptionsSchema;
export const updateSubscriptionOutputSchema = subscriptionsSchema;

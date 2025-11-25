import {z} from 'zod';

// Generated schemas for transactions
// DO NOT EDIT - This file is auto-generated

// Base Transaction schema
export const transactionsSchema = z
  .object({
    id: z.string(),
    timestamp: z.string().optional(),
    type: z.any(),
    amount: z.any(),
    interactionId: z.string().optional(),
    state: z.any(),
    custom: z.any().optional(),
  })
  .strict();

export const readTransactionOutputSchema = transactionsSchema;
export const createTransactionOutputSchema = transactionsSchema;

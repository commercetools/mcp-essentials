import {z} from 'zod';

// Base Payment schema
export const paymentsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    customer: z.any().optional(),
    anonymousId: z.string().optional(),
    interfaceId: z.string().optional(),
    amountPlanned: z.any(),
    paymentMethodInfo: z.any(),
    paymentStatus: z.any(),
    transactions: z.array(z.any()),
    interfaceInteractions: z.array(z.any()),
    custom: z.any().optional(),
    key: z.string().optional(),
  })
  .strict();

// Paged PaymentPagedQueryResponse schema
export const paymentsPagedSchema = z
  .object({
    limit: z.number(),
    count: z.number(),
    total: z.number().optional(),
    offset: z.number(),
    results: z.array(z.any()),
  })
  .strict();

export const readPaymentsOutputSchema = paymentsSchema || paymentsPagedSchema;
export const createPaymentsOutputSchema = paymentsSchema;
export const updatePaymentsOutputSchema = paymentsSchema;

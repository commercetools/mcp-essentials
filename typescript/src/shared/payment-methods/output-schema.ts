import {z} from 'zod';

// Base PaymentMethod schema
export const paymentMethodsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    name: z.any().optional(),
    customer: z.any().optional(),
    businessUnit: z.any().optional(),
    method: z.string().optional(),
    paymentInterface: z.string().optional(),
    interfaceAccount: z.string().optional(),
    token: z.any().optional(),
    paymentMethodStatus: z.any(),
    default: z.boolean(),
    custom: z.any().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
  })
  .strict();

// Paged PaymentMethodPagedQueryResponse schema
export const paymentMethodsPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readPaymentMethodsOutputSchema =
  paymentMethodsSchema || paymentMethodsPagedSchema;
export const createPaymentMethodsOutputSchema = paymentMethodsSchema;
export const updatePaymentMethodsOutputSchema = paymentMethodsSchema;

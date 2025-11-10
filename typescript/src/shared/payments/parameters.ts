import {z} from 'zod';

// Parameters for reading a payment
export const readPaymentParameters = z.object({
  id: z.string().optional().describe('The ID of the payment to fetch'),
  key: z.string().optional().describe('The key of the payment to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe('Query predicates for filtering payments'),
  limit: z
    .number()
    .min(1)
    .max(500)
    .default(10)
    .describe('Number of payments to return'),
  offset: z.number().min(0).default(0).describe('Number of items to skip'),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort criteria for the results'),
  expand: z
    .array(z.string())
    .optional()
    .describe('Fields to expand in the response'),
});

// Parameters for creating a payment
export const createPaymentParameters = z.object({
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier for the payment'),
  interfaceId: z.string().optional().describe('Interface ID for the payment'),
  amountPlanned: z
    .object({
      type: z.literal('centPrecision'),
      currencyCode: z.string(),
      centAmount: z.number(),
      fractionDigits: z.number().optional(),
    })
    .describe('Planned amount for the payment'),
  paymentMethodInfo: z
    .object({
      paymentInterface: z.string().optional(),
      method: z.string().optional(),
      name: z.record(z.string()).optional(),
    })
    .optional()
    .describe('Payment method information'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.any()),
    })
    .optional()
    .describe('Custom fields for the payment'),
  transaction: z
    .object({
      id: z.string(),
      timestamp: z.string().optional(),
      type: z.enum([
        'Authorization',
        'CancelAuthorization',
        'Charge',
        'Refund',
        'Chargeback',
      ]),
      amount: z.object({
        type: z.literal('centPrecision'),
        currencyCode: z.string(),
        centAmount: z.number(),
        fractionDigits: z.number().optional(),
      }),
      state: z.enum(['Initial', 'Pending', 'Success', 'Failure']).optional(),
      interactionId: z.string().optional(),
    })
    .optional()
    .describe('Transaction details'),
});

// Parameters for updating a payment
export const updatePaymentParameters = z.object({
  id: z.string().optional().describe('The ID of the payment to update'),
  key: z.string().optional().describe('The key of the payment to update'),
  version: z.number().describe('Current version of the payment'),
  actions: z
    .array(
      z
        .object({
          action: z.string(),
        })
        .passthrough()
    )
    .describe('Update actions to perform'),
});

export type ReadPaymentParameters = z.infer<typeof readPaymentParameters>;
export type CreatePaymentParameters = z.infer<typeof createPaymentParameters>;
export type UpdatePaymentParameters = z.infer<typeof updatePaymentParameters>;

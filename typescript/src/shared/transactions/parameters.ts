import {z} from 'zod';

// Parameters for reading transactions
export const readTransactionParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the transaction to retrieve'),

  // Optional key for getting by key
  key: z.string().optional().describe('The key of the transaction to retrieve'),

  // List parameters (used when neither id nor key is provided)
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Number of results requested. Default: 20, Minimum: 1, Maximum: 500'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe('Number of elements skipped. Default: 0, Maximum: 10000'),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["createdAt desc", "key asc"]'
    ),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["key=\\"transaction-key\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["application", "cart", "order"]'
    ),
});

// Parameters for creating a transaction
export const createTransactionParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the transaction'),
  application: z
    .object({
      id: z.string().optional(),
      key: z.string().optional(),
      typeId: z.literal('application'),
    })
    .describe(
      'Application for which the payment is executed. Provide either id or key.'
    ),
  cart: z
    .object({
      id: z.string().optional(),
      key: z.string().optional(),
      typeId: z.literal('cart'),
    })
    .describe(
      'Cart for which the payment must be executed. Provide either id or key.'
    ),
  transactionItems: z
    .array(
      z.object({
        paymentIntegration: z
          .object({
            id: z.string().optional(),
            key: z.string().optional(),
            typeId: z.literal('payment-integration'),
          })
          .describe(
            'Resource Identifier of the Payment Integration to use to execute the payment. Provide either id or key.'
          ),
        amount: z
          .object({
            centAmount: z.number().int().describe('Amount in cents'),
            currencyCode: z.string().describe('Currency code'),
          })
          .describe('Money value of the Transaction Item'),
      })
    )
    .min(1)
    .max(1)
    .describe(
      'Transaction Item associated with the Transaction. Must contain exactly one item.'
    ),
});

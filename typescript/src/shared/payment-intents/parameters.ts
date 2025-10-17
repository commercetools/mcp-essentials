import {z} from 'zod';

// Parameters for managing payment intents
export const updatePaymentIntentParameters = z.object({
  // Required payment ID
  paymentId: z.string().describe('The ID of the payment to manage'),

  // Actions array (min 1, max 1)
  actions: z
    .array(
      z.union([
        // Capture Payment action
        z.object({
          action: z.literal('capturePayment'),
          amount: z
            .object({
              centAmount: z.number().int().describe('Amount in cents'),
              currencyCode: z.string().describe('Currency code'),
            })
            .describe(
              'Amount to be captured. It must be less than or equal to the authorized amount.'
            ),
          merchantReference: z
            .string()
            .optional()
            .describe(
              "A merchant-defined identifier associated with the Payment to track and reconcile the Payment Intent Action on the merchant's side. For example, an invoice number."
            ),
        }),
        // Refund Payment action
        z.object({
          action: z.literal('refundPayment'),
          amount: z
            .object({
              centAmount: z.number().int().describe('Amount in cents'),
              currencyCode: z.string().describe('Currency code'),
            })
            .describe(
              'Amount to be refunded. It must be less than or equal to the captured amount.'
            ),
          transactionId: z
            .string()
            .optional()
            .describe(
              'The identifier of the capture transaction that is associated with the refund action.'
            ),
          merchantReference: z
            .string()
            .optional()
            .describe(
              "A merchant-defined identifier associated with the Payment to track and reconcile the Payment Intent Action on the merchant's side. For example, an invoice number."
            ),
        }),
        // Cancel Payment action
        z.object({
          action: z.literal('cancelPayment'),
          merchantReference: z
            .string()
            .optional()
            .describe(
              "A merchant-defined identifier associated with the Payment to track and reconcile the Payment Intent Action on the merchant's side. For example, an invoice number."
            ),
        }),
        // Reverse Payment action
        z.object({
          action: z.literal('reversePayment'),
          merchantReference: z
            .string()
            .optional()
            .describe(
              "A merchant-defined identifier associated with the Payment to track and reconcile the Payment Intent Action on the merchant's side. For example, an invoice number."
            ),
        }),
      ])
    )
    .min(1)
    .max(1)
    .describe(
      'Action to execute for the given Payment. MinItems: 1, MaxItems: 1'
    ),
});

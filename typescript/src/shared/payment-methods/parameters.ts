import {z} from 'zod';

// Parameters for reading payment methods
export const readPaymentMethodParameters = z.object({
  id: z.string().optional().describe('The ID of the payment method to fetch'),
  key: z.string().optional().describe('The key of the payment method to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe('Query predicates for filtering payment methods'),
  limit: z
    .number()
    .min(1)
    .max(500)
    .default(10)
    .describe('Number of payment methods to return'),
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

// Parameters for creating a payment method
export const createPaymentMethodParameters = z.object({
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier for the payment method'),
  name: z.record(z.string()).describe('Localized name of the payment method'),
  description: z
    .record(z.string())
    .optional()
    .describe('Localized description of the payment method'),
  paymentInterface: z
    .string()
    .optional()
    .describe('Payment interface identifier (e.g., "Adyen", "Stripe")'),
  method: z
    .string()
    .optional()
    .describe('Payment method type (e.g., "Card", "PayPal", "BankTransfer")'),
  interfaceAccount: z
    .string()
    .optional()
    .describe('Interface account identifier for the payment provider'),
  default: z
    .boolean()
    .optional()
    .describe('Whether this is the default payment method'),
  paymentMethodStatus: z
    .enum(['Active', 'Inactive'])
    .optional()
    .describe('Status of the payment method'),
  customer: z
    .object({
      id: z.string(),
      typeId: z.literal('customer'),
    })
    .optional()
    .describe('Reference to the customer who owns this payment method'),
  businessUnit: z
    .object({
      id: z.string(),
      typeId: z.literal('business-unit'),
    })
    .optional()
    .describe('Reference to the business unit that owns this payment method'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.any()),
    })
    .optional()
    .describe('Custom fields for the payment method'),
});

// Parameters for updating a payment method
export const updatePaymentMethodParameters = z.object({
  id: z.string().optional().describe('The ID of the payment method to update'),
  key: z
    .string()
    .optional()
    .describe('The key of the payment method to update'),
  version: z.number().describe('Current version of the payment method'),
  actions: z
    .array(
      z
        .object({
          action: z.enum([
            'setKey',
            'setName',
            'setDescription',
            'setPaymentInterface',
            'setMethod',
            'setInterfaceAccount',
            'setDefault',
            'setPaymentMethodStatus',
            'setCustomer',
            'setBusinessUnit',
            'setCustomType',
            'setCustomField',
            'delete',
          ]),
        })
        .passthrough()
    )
    .describe('Update actions to perform on the payment method'),
});

export type ReadPaymentMethodParameters = z.infer<
  typeof readPaymentMethodParameters
>;
export type CreatePaymentMethodParameters = z.infer<
  typeof createPaymentMethodParameters
>;
export type UpdatePaymentMethodParameters = z.infer<
  typeof updatePaymentMethodParameters
>;

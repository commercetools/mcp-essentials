import {z} from 'zod';

// Parameters for reading recurring orders
export const readRecurringOrderParameters = z.object({
  // Optional ID for getting by ID
  id: z
    .string()
    .optional()
    .describe('The ID of the recurring order to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the recurring order to retrieve'),

  // List parameters (used when neither id nor key is provided)
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Number of results requested. Default: 20, Minimum: 0, Maximum: 500'
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
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["customerId=\\"customer-123\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["customer", "order"]'
    ),
});

// Parameters for creating a recurring order
export const createRecurringOrderParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the recurring order'),
  cart: z
    .object({
      id: z.string(),
      typeId: z.literal('cart'),
    })
    .describe('Reference to the Cart for the RecurringOrder'),
  startsAt: z
    .string()
    .optional()
    .describe(
      'Date and time (UTC) when the RecurringOrder starts creating new Orders'
    ),
  cartVersion: z.number().int().describe('Current version of the Cart'),
  expiresAt: z
    .string()
    .optional()
    .describe('Date and time (UTC) when the RecurringOrder expires'),
  state: z
    .object({
      id: z.string(),
      typeId: z.literal('state'),
    })
    .optional()
    .describe('State of the RecurringOrder in a custom workflow'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the recurring order'),
});

// Parameters for updating a recurring order
export const updateRecurringOrderParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the recurring order to update'),
  key: z
    .string()
    .optional()
    .describe('The key of the recurring order to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the recurring order on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Key action
        z.object({
          action: z.literal('changeKey'),
          key: z
            .string()
            .min(2)
            .max(256)
            .regex(/^[A-Za-z0-9_-]+$/)
            .describe('New key for the recurring order'),
        }),
        // Set Starts At action
        z.object({
          action: z.literal('setStartsAt'),
          startsAt: z
            .string()
            .describe(
              'Date and time (UTC) when the RecurringOrder starts creating new Orders'
            ),
        }),
        // Set Expires At action
        z.object({
          action: z.literal('setExpiresAt'),
          expiresAt: z
            .string()
            .describe('Date and time (UTC) when the RecurringOrder expires'),
        }),
        // Set Schedule action
        z.object({
          action: z.literal('setSchedule'),
          recurrencePolicy: z
            .object({
              id: z.string(),
              typeId: z.literal('recurrence-policy'),
            })
            .describe('Reference to the RecurrencePolicy'),
        }),
        // Set CustomType action
        z.object({
          action: z.literal('setCustomType'),
          type: z
            .object({
              id: z.string(),
              typeId: z.literal('type'),
            })
            .optional()
            .describe(
              'The Type that extends the recurring order with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the recurring order'),
        }),
        // Set CustomField action
        z.object({
          action: z.literal('setCustomField'),
          name: z.string().describe('Name of the custom field'),
          value: z
            .any()
            .optional()
            .describe('Value to set for the custom field'),
        }),
      ])
    )
    .describe('Update actions to be performed on the recurring order'),
});

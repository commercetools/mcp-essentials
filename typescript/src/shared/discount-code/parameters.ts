import {z} from 'zod';

export const readDiscountCodeParameters = z.object({
  id: z.string().optional().describe('The ID of the discount code to read'),
  key: z.string().optional().describe('The key of the discount code to read'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 10.'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The number of items to skip before starting to collect the result set.'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]'
    ),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["code = \\"SAVE10\\""]'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["cartDiscounts[*]", "references[*]"]'
    ),
});

export const createDiscountCodeParameters = z.object({
  code: z.string().describe('The string value of the discount code.'),
  name: z
    .record(z.string(), z.string())
    .describe('The name of the discount code.'),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Description of the discount code.'),
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier of the discount code.'),
  cartDiscounts: z
    .array(
      z.object({
        id: z.string(),
        typeId: z.literal('cart-discount'),
      })
    )
    .min(1)
    .max(10)
    .describe(
      'References to cart discounts that can be applied when using the discount code.'
    ),
  cartPredicate: z
    .string()
    .optional()
    .describe(
      'Discount code can only be applied to carts that match this predicate.'
    ),
  isActive: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      'Indicates if the discount code is active and can be applied to the cart.'
    ),
  maxApplications: z
    .number()
    .int()
    .optional()
    .describe('Number of times the discount code can be applied.'),
  maxApplicationsPerCustomer: z
    .number()
    .int()
    .optional()
    .describe('Number of times the discount code can be applied per customer.'),
  groups: z
    .array(z.string())
    .optional()
    .describe('Groups to which the discount code belongs.'),
  validFrom: z
    .string()
    .optional()
    .describe('Date and time (UTC) from which the discount code is effective.'),
  validUntil: z
    .string()
    .optional()
    .describe(
      'Date and time (UTC) until which the discount code is effective.'
    ),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the discount code.'),
});

export const updateDiscountCodeParameters = z.object({
  id: z.string().optional().describe('The ID of the discount code to update'),
  key: z.string().optional().describe('The key of the discount code to update'),
  version: z
    .number()
    .int()
    .describe('The current version of the discount code'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the discount code. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

import {z} from 'zod';

// Parameters for reading a quote request
export const readQuoteRequestParameters = z.object({
  id: z.string().optional().describe('The ID of the quote request to fetch'),
  key: z.string().optional().describe('The key of the quote request to fetch'),
  customerId: z
    .string()
    .optional()
    .describe('The customer ID to fetch the quote request for'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering quote requests. Example: ["customerId=\\"1001\\""]'
    ),
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
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["customer", "lineItems[*].variant"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the quote request from'),
});

// Parameters for creating a quote request
export const createQuoteRequestParameters = z.object({
  cart: z
    .object({
      id: z.string(),
      typeId: z.literal('cart'),
    })
    .describe('Reference to the cart to create the quote request from'),
  cartVersion: z
    .number()
    .int()
    .describe('Version of the cart to create the quote request from'),
  comment: z
    .string()
    .optional()
    .describe('Comment describing the quote request'),
  custom: z
    .record(z.string(), z.any())
    .optional()
    .describe('Custom fields for the quote request'),
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier of the quote request'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the quote request in'),
});

// Parameters for updating a quote request
export const updateQuoteRequestParameters = z.object({
  id: z.string().optional().describe('The ID of the quote request to update'),
  key: z.string().optional().describe('The key of the quote request to update'),
  version: z
    .number()
    .int()
    .describe('The current version of the quote request'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the quote request. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the quote request belongs to'),
});

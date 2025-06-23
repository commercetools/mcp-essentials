import {z} from 'zod';

// Parameters for reading a quote
export const readQuoteParameters = z.object({
  id: z.string().optional().describe('The ID of the quote to fetch'),
  key: z.string().optional().describe('The key of the quote to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering quotes. Example: ["customer(id=\\"1001\\")"]'
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
      'An array of field paths to expand. Example: ["customer", "quoteRequest"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the quote from'),
  businessUnitKey: z
    .string()
    .optional()
    .describe('Key of the business unit to read the quote from'),
  associateId: z
    .string()
    .optional()
    .describe('ID of the associate acting on behalf of the business unit'),
});

// Parameters for creating a quote
export const createQuoteParameters = z.object({
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier for the Quote'),
  stagedQuote: z
    .object({
      id: z.string().optional().describe('ID of the staged quote'),
      key: z.string().optional().describe('Key of the staged quote'),
      typeId: z.literal('staged-quote'),
    })
    .describe('Reference to the staged quote'),
  stagedQuoteVersion: z
    .number()
    .int()
    .describe('Current version of the staged quote'),
  stagedQuoteStateToSent: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, the stagedQuoteState of the referenced StagedQuote will be set to Sent'
    ),
  state: z
    .object({
      id: z.string().optional().describe('ID of the state'),
      typeId: z.literal('state'),
    })
    .optional()
    .describe('Reference to a State'),
  custom: z
    .object({
      type: z.object({
        id: z.string().optional().describe('ID of the custom type'),
        key: z.string().optional().describe('Key of the custom type'),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()).optional(),
    })
    .optional()
    .describe('Custom fields for the quote'),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["customer", "quoteRequest"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the quote in'),
  businessUnitKey: z
    .string()
    .optional()
    .describe('Key of the business unit to create the quote in'),
  associateId: z
    .string()
    .optional()
    .describe('ID of the associate acting on behalf of the business unit'),
});

// Parameters for updating a quote
export const updateQuoteParameters = z.object({
  id: z.string().optional().describe('The ID of the quote to update'),
  key: z.string().optional().describe('The key of the quote to update'),
  version: z.number().int().describe('The expected version of the quote'),
  actions: z
    .array(
      z.union([
        z.object({
          action: z.literal('changeQuoteState'),
          quoteState: z.enum([
            'Pending',
            'Declined',
            'DeclinedForRenegotiation',
            'RenegotiationAddressed',
            'Accepted',
            'Withdrawn',
          ]),
        }),
        z.object({
          action: z.literal('requestQuoteRenegotiation'),
          buyerComment: z.string().optional(),
        }),
        z.object({
          action: z.literal('setCustomType'),
          type: z
            .object({
              id: z.string().optional(),
              key: z.string().optional(),
              typeId: z.literal('type'),
            })
            .optional(),
          fields: z.record(z.string(), z.any()).optional(),
        }),
        z.object({
          action: z.literal('setCustomField'),
          name: z.string(),
          value: z.any().optional(),
        }),
        z.object({
          action: z.literal('transitionState'),
          state: z.object({
            id: z.string().optional(),
            key: z.string().optional(),
            typeId: z.literal('state'),
          }),
          force: z.boolean().optional().default(false),
        }),
        z.object({
          action: z.literal('changeCustomer'),
          customer: z.object({
            id: z.string().optional(),
            key: z.string().optional(),
            typeId: z.literal('customer'),
          }),
        }),
      ])
    )
    .describe('Update actions to be performed on the quote'),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["customer", "quoteRequest"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to update the quote in'),
  businessUnitKey: z
    .string()
    .optional()
    .describe('Key of the business unit to update the quote in'),
  associateId: z
    .string()
    .optional()
    .describe('ID of the associate acting on behalf of the business unit'),
});

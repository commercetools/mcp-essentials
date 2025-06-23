import {z} from 'zod';

// Common fields for validation
const stagedQuoteReference = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
});

const customFieldsSchema = z.object({
  type: z.object({
    key: z.string(),
    typeId: z.literal('type').optional(),
  }),
  fields: z.record(z.any()).optional(),
});

// Read staged quote parameters
export const readStagedQuoteParameters = z.object({
  id: z.string().optional().describe('ID of the staged quote to retrieve'),
  key: z.string().optional().describe('Key of the staged quote to retrieve'),
  where: z
    .array(z.string())
    .optional()
    .describe('Query predicates for filtering staged quotes'),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort expressions for ordering results'),
  limit: z
    .number()
    .min(1)
    .max(500)
    .optional()
    .describe('Number of results to return (max 500)'),
  offset: z.number().min(0).optional().describe('Number of results to skip'),
  expand: z
    .array(z.string())
    .optional()
    .describe('Fields to expand in the response'),
  storeKey: z
    .string()
    .optional()
    .describe('Store key for store-scoped operations'),
});

// Create staged quote parameters
export const createStagedQuoteParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the StagedQuote'),
  quoteRequest: z
    .object({
      typeId: z.literal('quote-request'),
      id: z.string().optional(),
      key: z.string().optional(),
    })
    .describe('QuoteRequest from which the StagedQuote is created'),
  quoteRequestVersion: z
    .number()
    .describe('Current version of the QuoteRequest'),
  quoteRequestStateToAccepted: z
    .boolean()
    .optional()
    .describe(
      'If true, the quoteRequestState of the referenced QuoteRequest will be set to Accepted'
    ),
  state: z
    .object({
      typeId: z.literal('state'),
      id: z.string().optional(),
      key: z.string().optional(),
    })
    .optional()
    .describe(
      'State of the Staged Quote. This reference can point to a State in a custom workflow'
    ),
  custom: customFieldsSchema
    .optional()
    .describe(
      'Custom Fields to be added to the StagedQuote. If specified, the Custom Fields are merged with the Custom Fields on the referenced QuoteRequest and added to the StagedQuote. If empty, the Custom Fields on the referenced QuoteRequest are added to the StagedQuote automatically'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Store key for store-scoped creation'),
});

// Update staged quote parameters
export const updateStagedQuoteParameters = z.object({
  id: z.string().optional().describe('ID of the staged quote to update'),
  key: z.string().optional().describe('Key of the staged quote to update'),
  version: z
    .number()
    .describe('Current version of the staged quote for optimistic locking'),
  actions: z
    .array(
      z
        .object({
          action: z.string(),
        })
        .passthrough()
    )
    .describe('Update actions to apply to the staged quote'),
  storeKey: z
    .string()
    .optional()
    .describe('Store key for store-scoped operations'),
});

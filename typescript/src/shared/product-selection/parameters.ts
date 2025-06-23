import {z} from 'zod';

export const readProductSelectionParameters = z.object({
  id: z.string().optional().describe('ID of the ProductSelection to fetch'),
  key: z.string().optional().describe('Key of the ProductSelection to fetch'),
  expand: z
    .array(z.string())
    .optional()
    .describe('References to expand in the returned object'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering ProductSelections'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe('Maximum number of results to return (default: 20, max: 500)'),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Number of results to skip'),
});

export const createProductSelectionParameters = z.object({
  key: z
    .string()
    .optional()
    .describe('User-defined unique identifier for the ProductSelection'),
  name: z
    .record(z.string(), z.string())
    .describe('Localized name of the ProductSelection'),
  mode: z
    .enum(['Individual', 'IndividualExclusion'])
    .default('Individual')
    .describe(
      'Specifies in which way the Products are assigned to the ProductSelection'
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
    .describe('Custom fields for the ProductSelection'),
});

export const updateProductSelectionParameters = z.object({
  id: z.string().optional().describe('ID of the ProductSelection to update'),
  key: z.string().optional().describe('Key of the ProductSelection to update'),
  version: z.number().int().describe('Current version of the ProductSelection'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the ProductSelection. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

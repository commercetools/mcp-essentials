import {z} from 'zod';

export const readProductTypeParameters = z.object({
  id: z.string().describe('The ID of the product type to retrieve').optional(),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["attributes[*].type"]'
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
    .describe(
      'Sort criteria for the results. Example: ["name asc", "createdAt desc"]'
    ),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["name = \\"Standard product type\\""]'
    ),
});

const attributeTypeDefinition = z.object({
  name: z.string().describe('The name of the attribute'),
  label: z
    .record(z.string(), z.string())
    .describe('The localized label for the attribute'),
  isRequired: z
    .boolean()
    .optional()
    .describe('Whether the attribute is required'),
  isSearchable: z
    .boolean()
    .optional()
    .describe('Whether the attribute is searchable'),
  type: z
    .object({
      name: z
        .string()
        .describe('The type name (e.g., text, number, boolean, enum, etc.)'),
    })
    .and(z.record(z.string(), z.any()).optional())
    .describe('The type definition of the attribute'),
  attributeConstraint: z
    .enum(['None', 'Unique', 'CombinationUnique', 'SameForAll'])
    .optional()
    .describe('The constraint of the attribute'),
  inputTip: z
    .record(z.string(), z.string())
    .optional()
    .describe('The input tip for the attribute'),
  inputHint: z
    .enum(['SingleLine', 'MultiLine'])
    .optional()
    .describe('The input hint for the attribute'),
});

export const createProductTypeParameters = z.object({
  key: z.string().describe('The unique key of the product type'),
  name: z.string().describe('The name of the product type'),
  description: z.string().describe('The description of the product type'),
  attributes: z
    .array(attributeTypeDefinition)
    .optional()
    .describe('The attributes of the product type'),
});

export const updateProductTypeParameters = z.object({
  id: z.string().describe('The ID of the product type to update'),
  version: z.number().int().describe('The current version of the product type'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the product type. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

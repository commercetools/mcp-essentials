import {z} from 'zod';

export const readCategoryParameters = z.object({
  id: z.string().optional().describe('The ID of the category to fetch'),
  key: z.string().optional().describe('The key of the category to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering categories. Example: ["name(en = \\"Clothes\\")"]'
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
      'Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["parent", "ancestors[*]"]'
    ),
});

export const createCategoryParameters = z.object({
  name: z
    .record(z.string(), z.string())
    .describe('Localized name of the category'),
  slug: z
    .record(z.string(), z.string())
    .describe(
      'Localized URL slug for the category. Unique across the project. Pattern: ^[A-Za-z0-9_-]{2,256}+$'
    ),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized description of the category'),
  key: z
    .string()
    .optional()
    .describe(
      'User-defined unique identifier for the category. Pattern: ^[A-Za-z0-9_-]+$'
    ),
  externalId: z
    .string()
    .optional()
    .describe('Additional identifier for external systems'),
  parent: z
    .object({
      id: z.string(),
      typeId: z.literal('category'),
    })
    .optional()
    .describe('Reference to the parent category'),
  orderHint: z
    .string()
    .optional()
    .describe(
      'Decimal value between 0 and 1 for ordering categories at the same level'
    ),
  metaTitle: z
    .record(z.string(), z.string())
    .optional()
    .describe('SEO meta title'),
  metaDescription: z
    .record(z.string(), z.string())
    .optional()
    .describe('SEO meta description'),
  metaKeywords: z
    .record(z.string(), z.string())
    .optional()
    .describe('SEO meta keywords'),
  assets: z
    .array(
      z.object({
        key: z.string().optional(),
        sources: z.array(
          z.object({
            uri: z.string(),
            key: z.string().optional(),
            dimensions: z
              .object({
                w: z.number(),
                h: z.number(),
              })
              .optional(),
            contentType: z.string().optional(),
          })
        ),
        name: z.record(z.string(), z.string()),
        description: z.record(z.string(), z.string()).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional()
    .describe('Media related to the category'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the category'),
});

export const updateCategoryParameters = z.object({
  id: z.string().optional().describe('The ID of the category to update'),
  key: z.string().optional().describe('The key of the category to update'),
  version: z.number().int().describe('The current version of the category'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the category. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

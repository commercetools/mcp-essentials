import {z} from 'zod';

export const searchProductsParameters = z.object({
  query: z
    .object({})
    .passthrough()
    .describe(
      'The search query against searchable Product fields, expressed in the search query language.'
    ),
  sort: z
    .array(
      z.object({
        field: z.string().describe('The field to sort by'),
        order: z
          .enum(['asc', 'desc'])
          .describe('The sort order (ascending or descending)'),
        mode: z
          .enum(['min', 'max'])
          .optional()
          .describe('The sorting mode for multi-valued fields'),
      })
    )
    .optional()
    .describe(
      'Controls how results are sorted. If not provided, results are sorted by relevance score in descending order.'
    ),
  limit: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .describe(
      'The maximum number of search results to be returned in one page. Default: 20, Minimum: 0, Maximum: 100.'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe(
      'The number of search results to be skipped in the response for pagination. Default: 0, Minimum: 0, Maximum: 10000.'
    ),
  markMatchingVariants: z
    .boolean()
    .optional()
    .describe(
      'If query specifies an expression for a Product Variant field, set this to true to get additional information for each returned Product about which Product Variants match the search query.'
    ),
  productProjectionParameters: z
    .object({})
    .passthrough()
    .optional()
    .describe(
      'Controls data integration with Product Projection parameters. Set to an empty object to get the full ProductProjection or add parameters as needed.'
    ),
  facets: z
    .array(z.object({}).passthrough())
    .optional()
    .describe(
      'Facets to calculate counts, distinct values, or ranges on the result set.'
    ),
});

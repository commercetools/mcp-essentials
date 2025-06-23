import {z} from 'zod';

export const listProductsParameters = z.object({
  id: z.string().optional().describe('The ID of the product to read'),
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
      'Query predicates specified as strings. Example: ["masterData(current(name(en = "Product Name"))"]'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["masterData.current.categories[*]", "masterData.current.masterVariant.attributes[*]"]'
    ),
});

const productVariantDraft = z.object({
  sku: z.string().optional(),
  key: z.string().optional(),
  prices: z
    .array(
      z.object({
        value: z.object({
          type: z.literal('centPrecision'),
          currencyCode: z.string(),
          centAmount: z.number(),
          fractionDigits: z.number(),
        }),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        dimensions: z
          .object({
            w: z.number(),
            h: z.number(),
          })
          .optional(),
      })
    )
    .optional(),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.any(),
      })
    )
    .optional(),
});

export const createProductParameters = z.object({
  productType: z.object({
    id: z.string(),
    typeId: z.literal('product-type'),
  }),
  name: z.record(z.string(), z.string()),
  slug: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()).optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        typeId: z.literal('category'),
      })
    )
    .optional(),
  masterVariant: productVariantDraft.optional(),
  variants: z.array(productVariantDraft).optional(),
  key: z.string().optional(),
  metaTitle: z.record(z.string(), z.string()).optional(),
  metaDescription: z.record(z.string(), z.string()).optional(),
  metaKeywords: z.record(z.string(), z.string()).optional(),
  searchKeywords: z
    .record(
      z.string(),
      z.array(
        z.object({
          text: z.string(),
        })
      )
    )
    .optional(),
  taxCategory: z
    .object({
      id: z.string(),
      typeId: z.literal('tax-category'),
    })
    .optional(),
  state: z
    .object({
      id: z.string(),
      typeId: z.literal('state'),
    })
    .optional(),
});

export const updateProductParameters = z.object({
  id: z.string().describe('The ID of the product to update'),
  version: z.number().int().describe('The current version of the product'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the product. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

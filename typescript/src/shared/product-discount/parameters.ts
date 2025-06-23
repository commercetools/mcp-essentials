import {z} from 'zod';

export const readProductDiscountParameters = z.object({
  id: z.string().describe('The ID of the product discount to fetch').optional(),
  key: z
    .string()
    .describe('The key of the product discount to fetch')
    .optional(),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering product discounts. Example: ["name(en=\\"Summer Sale\\")"]'
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
    .describe('An array of field paths to expand. Example: ["references[*]"]'),
});

// ProductDiscountValue schemas
const productDiscountValueAbsoluteDraft = z.object({
  type: z.literal('absolute'),
  money: z.array(
    z.object({
      type: z.literal('centPrecision'),
      currencyCode: z.string(),
      centAmount: z.number(),
      fractionDigits: z.number().optional(),
    })
  ),
});

const productDiscountValueRelativeDraft = z.object({
  type: z.literal('relative'),
  permyriad: z.number().int().min(0).max(10000),
});

const productDiscountValueExternalDraft = z.object({
  type: z.literal('external'),
});

const productDiscountValueDraft = z.discriminatedUnion('type', [
  productDiscountValueAbsoluteDraft,
  productDiscountValueRelativeDraft,
  productDiscountValueExternalDraft,
]);

export const createProductDiscountParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier of the ProductDiscount.'),
  name: z
    .record(z.string(), z.string())
    .describe('Name of the ProductDiscount.'),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Description of the ProductDiscount.'),
  value: productDiscountValueDraft.describe(
    'Type of Discount and its corresponding value.'
  ),
  predicate: z.string().describe('Valid ProductDiscount predicate.'),
  sortOrder: z
    .string()
    .describe(
      'Unique decimal value between 0 and 1 (stored as String literal) defining the order of Product Discounts to apply in case more than one is applicable and active.'
    ),
  isActive: z
    .boolean()
    .optional()
    .describe(
      'If true the Product Discount is applied to Products matching the predicate.'
    ),
  validFrom: z
    .string()
    .optional()
    .describe('Date and time (UTC) from which the Discount is effective.'),
  validUntil: z
    .string()
    .optional()
    .describe('Date and time (UTC) until which the Discount is effective.'),
});

export const updateProductDiscountParameters = z.object({
  id: z
    .string()
    .describe('The ID of the product discount to update')
    .optional(),
  key: z
    .string()
    .describe('The key of the product discount to update')
    .optional(),
  version: z
    .number()
    .int()
    .describe('The current version of the product discount'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the product discount. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

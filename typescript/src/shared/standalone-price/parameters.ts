import {z} from 'zod';

export const readStandalonePriceParameters = z.object({
  id: z.string().describe('The ID of the standalone price to fetch').optional(),
  key: z
    .string()
    .describe('The key of the standalone price to fetch')
    .optional(),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering standalone prices. Example: ["sku=\\"A0E200000002E49\\""]'
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
      'Sort criteria for the results. Example: ["value.centAmount asc", "createdAt desc"]'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of field paths to expand. Example: ["customerGroup", "channel"]'
    ),
});

const priceTierDraft = z.object({
  minimumQuantity: z.number().int().min(2),
  value: z.object({
    type: z.literal('centPrecision'),
    currencyCode: z.string(),
    centAmount: z.number(),
    fractionDigits: z.number().optional(),
  }),
});

export const createStandalonePriceParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier of the StandalonePrice.'),
  sku: z
    .string()
    .describe('SKU of the ProductVariant to which this Price is associated.'),
  value: z
    .object({
      type: z.literal('centPrecision'),
      currencyCode: z.string(),
      centAmount: z.number(),
      fractionDigits: z.number().optional(),
    })
    .describe('Money value of this Price.'),
  country: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional()
    .describe('Country for which this Price is valid. Pattern: ^[A-Z]{2}$'),
  customerGroup: z
    .object({
      id: z.string(),
      typeId: z.literal('customer-group'),
    })
    .optional()
    .describe('CustomerGroup for which this Price is valid.'),
  channel: z
    .object({
      id: z.string(),
      typeId: z.literal('channel'),
    })
    .optional()
    .describe('Product distribution Channel for which this Price is valid.'),
  validFrom: z
    .string()
    .optional()
    .describe('Date from which the Price is valid.'),
  validUntil: z.string().optional().describe('Date until the Price is valid.'),
  tiers: z
    .array(priceTierDraft)
    .optional()
    .describe('Price tiers if any are defined.'),
  active: z
    .boolean()
    .optional()
    .describe('Whether the price is active or not.'),
  discounted: z
    .object({
      value: z.object({
        type: z.literal('centPrecision'),
        currencyCode: z.string(),
        centAmount: z.number(),
        fractionDigits: z.number().optional(),
      }),
      discount: z.object({
        id: z.string(),
        typeId: z.literal('product-discount'),
      }),
    })
    .optional()
    .describe('Set if a matching ProductDiscount exists.'),
  staged: z.boolean().optional().describe('Whether to create a staged price.'),
});

export const updateStandalonePriceParameters = z.object({
  id: z
    .string()
    .describe('The ID of the standalone price to update')
    .optional(),
  key: z
    .string()
    .describe('The key of the standalone price to update')
    .optional(),
  version: z
    .number()
    .int()
    .describe('The current version of the standalone price'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the standalone price. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

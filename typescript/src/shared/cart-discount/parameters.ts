import {z} from 'zod';

export const readCartDiscountParameters = z.object({
  id: z.string().describe('The ID of the cart discount to fetch').optional(),
  key: z.string().describe('The key of the cart discount to fetch').optional(),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering cart discounts. Example: ["name(en=\\"Black Friday Sale\\")"]'
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
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the cart discount from'),
});

// CartDiscountValue schemas
const cartDiscountValueAbsoluteDraft = z.object({
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

const cartDiscountValueRelativeDraft = z.object({
  type: z.literal('relative'),
  permyriad: z.number().int().min(0).max(10000),
});

const cartDiscountValueFixedDraft = z.object({
  type: z.literal('fixed'),
  money: z.array(
    z.object({
      type: z.literal('centPrecision'),
      currencyCode: z.string(),
      centAmount: z.number(),
      fractionDigits: z.number().optional(),
    })
  ),
});

const cartDiscountValueGiftLineItemDraft = z.object({
  type: z.literal('giftLineItem'),
  product: z.object({
    id: z.string(),
    typeId: z.literal('product'),
  }),
  variantId: z.number(),
  distributionChannel: z
    .object({
      id: z.string(),
      typeId: z.literal('channel'),
    })
    .optional(),
  supplyChannel: z
    .object({
      id: z.string(),
      typeId: z.literal('channel'),
    })
    .optional(),
});

const cartDiscountValueDraft = z.discriminatedUnion('type', [
  cartDiscountValueAbsoluteDraft,
  cartDiscountValueRelativeDraft,
  cartDiscountValueFixedDraft,
  cartDiscountValueGiftLineItemDraft,
]);

// CartDiscountTarget schemas
const cartDiscountLineItemsTarget = z.object({
  type: z.literal('lineItems'),
  predicate: z.string(),
});

const cartDiscountCustomLineItemsTarget = z.object({
  type: z.literal('customLineItems'),
  predicate: z.string(),
});

const cartDiscountShippingCostTarget = z.object({
  type: z.literal('shipping'),
});

const cartDiscountTotalPriceTarget = z.object({
  type: z.literal('totalPrice'),
});

const multiBuyLineItemsTarget = z.object({
  type: z.literal('multiBuyLineItems'),
  predicate: z.string(),
  triggerQuantity: z.number().int().positive(),
  discountedQuantity: z.number().int().positive(),
  maxOccurrence: z.number().int().positive().optional(),
  selectionMode: z.enum(['Cheapest', 'MostExpensive']).optional(),
});

const multiBuyCustomLineItemsTarget = z.object({
  type: z.literal('multiBuyCustomLineItems'),
  predicate: z.string(),
  triggerQuantity: z.number().int().positive(),
  discountedQuantity: z.number().int().positive(),
  maxOccurrence: z.number().int().positive().optional(),
  selectionMode: z.enum(['Cheapest', 'MostExpensive']).optional(),
});

const cartDiscountPatternTarget = z.object({
  type: z.literal('pattern'),
  components: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('countOnLineItemUnits'),
        predicate: z.string(),
        count: z.number().int().positive(),
      }),
      z.object({
        type: z.literal('countOnCustomLineItemUnits'),
        predicate: z.string(),
        count: z.number().int().positive(),
      }),
    ])
  ),
});

const cartDiscountTargetDraft = z.discriminatedUnion('type', [
  cartDiscountLineItemsTarget,
  cartDiscountCustomLineItemsTarget,
  cartDiscountShippingCostTarget,
  cartDiscountTotalPriceTarget,
  multiBuyLineItemsTarget,
  multiBuyCustomLineItemsTarget,
  cartDiscountPatternTarget,
]);

export const createCartDiscountParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier of the CartDiscount.'),
  name: z.record(z.string(), z.string()).describe('Name of the CartDiscount.'),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Description of the CartDiscount.'),
  value: cartDiscountValueDraft.describe(
    'Type of Discount and its corresponding value.'
  ),
  cartPredicate: z.string().describe('Valid Cart predicate.'),
  target: cartDiscountTargetDraft
    .optional()
    .describe('Segment of the Cart that is discounted.'),
  sortOrder: z
    .string()
    .describe(
      'Unique decimal value between 0 and 1 (stored as String literal) defining the order of Cart Discounts to apply in case more than one is applicable and active.'
    ),
  isActive: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      'If true the Cart Discount is applied to Carts matching the cartPredicate.'
    ),
  validFrom: z
    .string()
    .optional()
    .describe('Date and time (UTC) from which the Discount is effective.'),
  validUntil: z
    .string()
    .optional()
    .describe('Date and time (UTC) until which the Discount is effective.'),
  requiresDiscountCode: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'When true the discount can only be applied if a valid Discount Code is provided during the checkout.'
    ),
  stackingMode: z
    .enum(['Stacking', 'StopAfterThisDiscount'])
    .optional()
    .default('Stacking')
    .describe(
      'Specifies whether the application of this discount causes the following discounts to be ignored.'
    ),
  stores: z
    .array(
      z.object({
        typeId: z.literal('store'),
        key: z.string(),
      })
    )
    .optional()
    .describe(
      'The stores that this discount applies to. If empty, the discount applies to all stores.'
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
    .describe('Custom fields for the Cart Discount.'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the cart discount in.'),
});

export const updateCartDiscountParameters = z.object({
  id: z.string().describe('The ID of the cart discount to update').optional(),
  key: z.string().describe('The key of the cart discount to update').optional(),
  version: z
    .number()
    .int()
    .describe('The current version of the cart discount'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the cart discount. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to update the cart discount in.'),
});

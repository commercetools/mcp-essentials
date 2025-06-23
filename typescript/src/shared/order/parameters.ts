import {z} from 'zod';

export const readOrderParameters = z.object({
  id: z.string().optional().describe('The ID of the order to fetch'),
  orderNumber: z
    .string()
    .optional()
    .describe('The order number of the order to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering orders. Example: ["orderNumber=\\"1001\\""]'
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
      'An array of field paths to expand. Example: ["customer", "lineItems[*].variant"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read orders from'),
});

const createOrderFromCartParameters = z.object({
  id: z
    .string()
    .optional()
    .describe('The ID of the cart to create the order from'),
  version: z.number().int().describe('The current version of the cart'),
  orderNumber: z
    .string()
    .optional()
    .describe('User-defined identifier of the Order'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the order in'),
});

const createOrderFromQuoteParameters = z.object({
  quoteId: z.string().describe('The ID of the quote to create the order from'),
  version: z.number().int().describe('The current version of the quote'),
  orderNumber: z
    .string()
    .optional()
    .describe('User-defined identifier of the Order'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the order in'),
});

const createOrderByImportParameters = z.object({
  orderNumber: z
    .string()
    .optional()
    .describe('User-defined identifier of the Order'),
  customerId: z
    .string()
    .optional()
    .describe('ID of the customer that the Order belongs to'),
  customerEmail: z
    .string()
    .optional()
    .describe('Email address of the Customer'),
  store: z
    .object({
      key: z.string(),
      typeId: z.literal('store'),
    })
    .optional()
    .describe('Reference to a Store the Order belongs to'),
  lineItems: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string(),
        name: z.record(z.string(), z.string()),
        productSlug: z.record(z.string(), z.string()).optional(),
        variant: z.object({
          id: z.number(),
          sku: z.string().optional(),
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
        }),
        quantity: z.number().int().positive(),
      })
    )
    .optional()
    .describe('Line items in the order'),
  totalPrice: z
    .object({
      currencyCode: z.string(),
      centAmount: z.number(),
    })
    .describe('Total price of the order'),
});

export const createOrderParameters = z
  .object({
    // Cart creation parameters
    id: z
      .string()
      .optional()
      .describe('The ID of the cart to create the order from'),
    version: z.number().int().describe('The current version of the cart'),
    orderNumber: z
      .string()
      .optional()
      .describe('User-defined identifier of the Order'),
    storeKey: z
      .string()
      .optional()
      .describe('Key of the store to create the order in'),

    // Quote creation parameters
    quoteId: z
      .string()
      .optional()
      .describe('The ID of the quote to create the order from'),

    // Import parameters
    customerId: z
      .string()
      .optional()
      .describe('ID of the customer that the Order belongs to'),
    customerEmail: z
      .string()
      .optional()
      .describe('Email address of the Customer'),
    store: z
      .object({
        key: z.string(),
        typeId: z.literal('store'),
      })
      .optional()
      .describe('Reference to a Store the Order belongs to'),
    lineItems: z
      .array(
        z.object({
          id: z.string(),
          productId: z.string(),
          name: z.record(z.string(), z.string()),
          productSlug: z.record(z.string(), z.string()).optional(),
          variant: z.object({
            id: z.number(),
            sku: z.string().optional(),
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
          }),
          quantity: z.number().int().positive(),
        })
      )
      .optional()
      .describe('Line items in the order'),
    totalPrice: z
      .object({
        currencyCode: z.string(),
        centAmount: z.number(),
      })
      .describe('Total price of the order'),
  })
  .refine(
    (data) => {
      // Validate cart creation
      if (data.version && !data.quoteId && !data.totalPrice) {
        return true;
      }
      // Validate quote creation
      if (data.quoteId && data.version && !data.totalPrice) {
        return true;
      }
      // Validate import
      if (data.totalPrice && (data.customerId || data.customerEmail)) {
        return true;
      }
      return false;
    },
    {
      message:
        'Invalid parameter combination. Must provide either cart parameters, quote parameters, or import parameters with required fields.',
    }
  );

export const updateOrderParameters = z.object({
  id: z.string().optional().describe('The ID of the order to update'),
  orderNumber: z
    .string()
    .optional()
    .describe('The order number of the order to update'),
  version: z.number().int().describe('The current version of the order'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the order belongs to'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the order. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

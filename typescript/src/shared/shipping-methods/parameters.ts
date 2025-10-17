import {z} from 'zod';

// Parameters for reading shipping methods
export const readShippingMethodParameters = z.object({
  // Optional ID for getting by ID
  id: z
    .string()
    .optional()
    .describe('The ID of the shipping method to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the shipping method to retrieve'),

  // List parameters (used when neither id nor key is provided)
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Number of results requested. Default: 20, Minimum: 0, Maximum: 500'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe('Number of elements skipped. Default: 0, Maximum: 10000'),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["name=\\"Standard Shipping\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["zoneRates[*].zone"]'
    ),
});

// Parameters for creating a shipping method
export const createShippingMethodParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the shipping method'),
  name: z.string().describe('Name of the shipping method'),
  description: z
    .string()
    .optional()
    .describe('Description of the shipping method'),
  zoneRates: z
    .array(
      z.object({
        zone: z.object({
          id: z.string(),
          typeId: z.literal('zone'),
        }),
        shippingRates: z.array(
          z.object({
            price: z.object({
              type: z.literal('centPrecision'),
              currencyCode: z.string(),
              centAmount: z.number(),
              fractionDigits: z.number(),
            }),
            freeAbove: z
              .object({
                type: z.literal('centPrecision'),
                currencyCode: z.string(),
                centAmount: z.number(),
                fractionDigits: z.number(),
              })
              .optional(),
            tiers: z
              .array(
                z.object({
                  type: z.literal('CartValue'),
                  minimumCentAmount: z.number(),
                  price: z.object({
                    type: z.literal('centPrecision'),
                    currencyCode: z.string(),
                    centAmount: z.number(),
                    fractionDigits: z.number(),
                  }),
                })
              )
              .optional(),
          })
        ),
      })
    )
    .describe('Zone rates for the shipping method'),
  isDefault: z
    .boolean()
    .optional()
    .describe('Whether this is the default shipping method'),
  taxCategory: z
    .object({
      id: z.string(),
      typeId: z.literal('tax-category'),
    })
    .optional()
    .describe('Tax category for the shipping method'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the shipping method'),
});

// Parameters for updating a shipping method
export const updateShippingMethodParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the shipping method to update'),
  key: z
    .string()
    .optional()
    .describe('The key of the shipping method to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the shipping method on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Name action
        z.object({
          action: z.literal('changeName'),
          name: z.string().describe('New name for the shipping method'),
        }),
        // Set Description action
        z.object({
          action: z.literal('setDescription'),
          description: z
            .string()
            .optional()
            .describe('New description for the shipping method'),
        }),
        // Add Zone Rate action
        z.object({
          action: z.literal('addZoneRate'),
          zoneRate: z.object({
            zone: z.object({
              id: z.string(),
              typeId: z.literal('zone'),
            }),
            shippingRates: z.array(
              z.object({
                price: z.object({
                  type: z.literal('centPrecision'),
                  currencyCode: z.string(),
                  centAmount: z.number(),
                  fractionDigits: z.number(),
                }),
                freeAbove: z
                  .object({
                    type: z.literal('centPrecision'),
                    currencyCode: z.string(),
                    centAmount: z.number(),
                    fractionDigits: z.number(),
                  })
                  .optional(),
                tiers: z
                  .array(
                    z.object({
                      type: z.literal('CartValue'),
                      minimumCentAmount: z.number(),
                      price: z.object({
                        type: z.literal('centPrecision'),
                        currencyCode: z.string(),
                        centAmount: z.number(),
                        fractionDigits: z.number(),
                      }),
                    })
                  )
                  .optional(),
              })
            ),
          }),
        }),
        // Remove Zone Rate action
        z.object({
          action: z.literal('removeZoneRate'),
          zone: z.object({
            id: z.string(),
            typeId: z.literal('zone'),
          }),
        }),
        // Set Default action
        z.object({
          action: z.literal('setDefault'),
        }),
        // Set Tax Category action
        z.object({
          action: z.literal('setTaxCategory'),
          taxCategory: z
            .object({
              id: z.string(),
              typeId: z.literal('tax-category'),
            })
            .optional(),
        }),
        // Set Custom Type action
        z.object({
          action: z.literal('setCustomType'),
          type: z
            .object({
              id: z.string(),
              typeId: z.literal('type'),
            })
            .optional()
            .describe(
              'The Type that extends the shipping method with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the shipping method'),
        }),
        // Set Custom Field action
        z.object({
          action: z.literal('setCustomField'),
          name: z.string().describe('Name of the custom field'),
          value: z
            .any()
            .optional()
            .describe('Value to set for the custom field'),
        }),
      ])
    )
    .describe('Update actions to be performed on the shipping method'),
});

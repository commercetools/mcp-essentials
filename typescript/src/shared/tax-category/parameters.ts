import {z} from 'zod';

// Parameters for reading tax categories
export const readTaxCategoryParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the tax category to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the tax category to retrieve'),

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
    .describe(
      'Sort criteria for the results. Example: ["name asc", "createdAt desc"]'
    ),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["name=\\"Standard Tax\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["custom.type"]'
    ),
});

// Parameters for creating a tax category
export const createTaxCategoryParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the tax category'),
  name: z.string().describe('Name of the tax category'),
  description: z
    .string()
    .optional()
    .describe('Description of the tax category'),
  rates: z
    .array(
      z.object({
        name: z.string().describe('Name of the tax rate'),
        amount: z
          .number()
          .min(0)
          .max(1)
          .describe('Tax rate as a decimal (e.g., 0.19 for 19%)'),
        includedInPrice: z
          .boolean()
          .optional()
          .describe('Whether the tax is included in the price'),
        country: z
          .string()
          .length(2)
          .describe('Country code (ISO 3166-1 alpha-2)'),
        state: z
          .string()
          .optional()
          .describe('State or region within the country'),
        id: z
          .string()
          .optional()
          .describe('Unique identifier for the tax rate'),
        key: z
          .string()
          .optional()
          .describe('User-defined unique identifier for the tax rate'),
        subRates: z
          .array(
            z.object({
              name: z.string().describe('Name of the sub-rate'),
              amount: z
                .number()
                .min(0)
                .max(1)
                .describe('Sub-rate as a decimal'),
              id: z
                .string()
                .optional()
                .describe('Unique identifier for the sub-rate'),
              key: z
                .string()
                .optional()
                .describe('User-defined unique identifier for the sub-rate'),
            })
          )
          .optional()
          .describe('Sub-rates for this tax rate'),
      })
    )
    .describe('Tax rates for this category'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the tax category'),
});

// Parameters for updating a tax category
export const updateTaxCategoryParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the tax category to update'),
  key: z.string().optional().describe('The key of the tax category to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the tax category on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Name action
        z.object({
          action: z.literal('changeName'),
          name: z.string().describe('New name for the tax category'),
        }),
        // Set Description action
        z.object({
          action: z.literal('setDescription'),
          description: z
            .string()
            .optional()
            .describe('New description for the tax category'),
        }),
        // Replace Tax Rate action
        z.object({
          action: z.literal('replaceTaxRate'),
          taxRateId: z.string().describe('ID of the tax rate to replace'),
          taxRate: z
            .object({
              name: z.string().describe('Name of the tax rate'),
              amount: z
                .number()
                .min(0)
                .max(1)
                .describe('Tax rate as a decimal'),
              includedInPrice: z
                .boolean()
                .optional()
                .describe('Whether the tax is included in the price'),
              country: z
                .string()
                .length(2)
                .describe('Country code (ISO 3166-1 alpha-2)'),
              state: z
                .string()
                .optional()
                .describe('State or region within the country'),
              id: z
                .string()
                .optional()
                .describe('Unique identifier for the tax rate'),
              key: z
                .string()
                .optional()
                .describe('User-defined unique identifier for the tax rate'),
              subRates: z
                .array(
                  z.object({
                    name: z.string().describe('Name of the sub-rate'),
                    amount: z
                      .number()
                      .min(0)
                      .max(1)
                      .describe('Sub-rate as a decimal'),
                    id: z
                      .string()
                      .optional()
                      .describe('Unique identifier for the sub-rate'),
                    key: z
                      .string()
                      .optional()
                      .describe(
                        'User-defined unique identifier for the sub-rate'
                      ),
                  })
                )
                .optional()
                .describe('Sub-rates for this tax rate'),
            })
            .describe('New tax rate data'),
        }),
        // Remove Tax Rate action
        z.object({
          action: z.literal('removeTaxRate'),
          taxRateId: z.string().describe('ID of the tax rate to remove'),
        }),
        // Add Tax Rate action
        z.object({
          action: z.literal('addTaxRate'),
          taxRate: z
            .object({
              name: z.string().describe('Name of the tax rate'),
              amount: z
                .number()
                .min(0)
                .max(1)
                .describe('Tax rate as a decimal'),
              includedInPrice: z
                .boolean()
                .optional()
                .describe('Whether the tax is included in the price'),
              country: z
                .string()
                .length(2)
                .describe('Country code (ISO 3166-1 alpha-2)'),
              state: z
                .string()
                .optional()
                .describe('State or region within the country'),
              id: z
                .string()
                .optional()
                .describe('Unique identifier for the tax rate'),
              key: z
                .string()
                .optional()
                .describe('User-defined unique identifier for the tax rate'),
              subRates: z
                .array(
                  z.object({
                    name: z.string().describe('Name of the sub-rate'),
                    amount: z
                      .number()
                      .min(0)
                      .max(1)
                      .describe('Sub-rate as a decimal'),
                    id: z
                      .string()
                      .optional()
                      .describe('Unique identifier for the sub-rate'),
                    key: z
                      .string()
                      .optional()
                      .describe(
                        'User-defined unique identifier for the sub-rate'
                      ),
                  })
                )
                .optional()
                .describe('Sub-rates for this tax rate'),
            })
            .describe('Tax rate data to add'),
        }),
        // Set Key action
        z.object({
          action: z.literal('setKey'),
          key: z
            .string()
            .min(2)
            .max(256)
            .regex(/^[A-Za-z0-9_-]+$/)
            .optional()
            .describe('New key for the tax category'),
        }),
        // Set CustomType action
        z.object({
          action: z.literal('setCustomType'),
          type: z
            .object({
              id: z.string(),
              typeId: z.literal('type'),
            })
            .optional()
            .describe(
              'The Type that extends the tax category with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the tax category'),
        }),
        // Set CustomField action
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
    .describe('Update actions to be performed on the tax category'),
});

import {z} from 'zod';

// Parameters for reading a store
export const readStoreParameters = z.object({
  id: z.string().optional().describe('The ID of the store to fetch'),
  key: z.string().optional().describe('The key of the store to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering stores. Example: ["name=\\"My Store\\""]'
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
      'An array of field paths to expand. Example: ["distributionChannels[*]", "supplyChannels[*]"]'
    ),
});

// Schema for Store Country
const storeCountryDraft = z.object({
  code: z.string().describe('Two-digit country code as per ISO 3166-1 alpha-2'),
});

// Schema for Product Selection Setting
const productSelectionSettingDraft = z.object({
  productSelection: z
    .object({
      key: z.string().optional(),
      id: z.string().optional(),
      typeId: z.literal('product-selection'),
    })
    .describe('Reference to a Product Selection'),
  active: z
    .boolean()
    .optional()
    .describe('If true, the Product Selection is active for the Store'),
});

// Parameters for creating a store
export const createStoreParameters = z.object({
  key: z
    .string()
    .describe(
      'User-defined unique and immutable identifier for the Store. Min: 2, Max: 256, Pattern: ^[A-Za-z0-9_-]+$'
    ),
  name: z
    .record(z.string(), z.string())
    .describe('Name of the Store as a localized string'),
  languages: z
    .array(z.string())
    .optional()
    .describe('Languages configured for the Store (locale strings)'),
  countries: z
    .array(storeCountryDraft)
    .optional()
    .describe('Countries defined for the Store'),
  distributionChannels: z
    .array(
      z.object({
        key: z.string().optional(),
        id: z.string().optional(),
        typeId: z.literal('channel'),
      })
    )
    .optional()
    .describe('Product Distribution Channels allowed for the Store. Max: 100'),
  supplyChannels: z
    .array(
      z.object({
        key: z.string().optional(),
        id: z.string().optional(),
        typeId: z.literal('channel'),
      })
    )
    .optional()
    .describe('Inventory Supply Channels allowed for the Store. Max: 100'),
  productSelections: z
    .array(productSelectionSettingDraft)
    .optional()
    .describe(
      'Controls availability of Products for this Store via Product Selections. Max: 100'
    ),
  custom: z
    .object({
      type: z.object({
        key: z.string().optional(),
        id: z.string().optional(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()).optional(),
    })
    .optional()
    .describe('Custom fields for the Store'),
});

// Parameters for updating a store
export const updateStoreParameters = z.object({
  id: z.string().optional().describe('The ID of the store to update'),
  key: z.string().optional().describe('The key of the store to update'),
  version: z.number().int().describe('Current version of the Store'),
  actions: z
    .array(
      z
        .object({
          action: z.string(),
        })
        .passthrough()
    )
    .describe('Update actions to be performed on the Store'),
});

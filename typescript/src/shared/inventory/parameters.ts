import {z} from 'zod';

// Parameters for reading inventory entries
export const readInventoryParameters = z.object({
  // Optional ID for getting by ID
  id: z
    .string()
    .optional()
    .describe('The ID of the inventory entry to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the inventory entry to retrieve'),

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
      'Query predicates specified as strings. Example: ["sku=\\"ABC123\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["supplyChannel"]'
    ),
});

// Parameters for creating an inventory entry
export const createInventoryParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the inventory entry'),
  sku: z.string().describe('ProductVariant SKU of the inventory entry'),
  supplyChannel: z
    .object({
      id: z.string(),
      typeId: z.literal('channel'),
    })
    .optional()
    .describe('Channel that supplies this inventory entry'),
  quantityOnStock: z.number().int().describe('Overall amount of stock'),
  restockableInDays: z
    .number()
    .int()
    .optional()
    .describe('How often the inventory entry is restocked (in days)'),
  expectedDelivery: z
    .string()
    .optional()
    .describe('Date and time of the next restock (ISO 8601 format)'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the inventory entry'),
});

// Parameters for updating an inventory entry
export const updateInventoryParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the inventory entry to update'),
  key: z
    .string()
    .optional()
    .describe('The key of the inventory entry to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the inventory entry on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Add Quantity action
        z.object({
          action: z.literal('addQuantity'),
          quantity: z
            .number()
            .int()
            .describe('Value to add to quantityOnStock'),
        }),
        // Remove Quantity action
        z.object({
          action: z.literal('removeQuantity'),
          quantity: z
            .number()
            .int()
            .describe('Value to remove from quantityOnStock'),
        }),
        // Change Quantity action
        z.object({
          action: z.literal('changeQuantity'),
          quantity: z
            .number()
            .int()
            .describe('Value to set for quantityOnStock'),
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
            .describe('Value to set'),
        }),
        // Set RestockableInDays action
        z.object({
          action: z.literal('setRestockableInDays'),
          restockableInDays: z
            .number()
            .int()
            .optional()
            .describe('Value to set'),
        }),
        // Set ExpectedDelivery action
        z.object({
          action: z.literal('setExpectedDelivery'),
          expectedDelivery: z
            .string()
            .optional()
            .describe('Value to set (ISO 8601 format)'),
        }),
        // Set SupplyChannel action
        z.object({
          action: z.literal('setSupplyChannel'),
          supplyChannel: z
            .object({
              id: z.string(),
              typeId: z.literal('channel'),
            })
            .optional()
            .describe('Value to set'),
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
              'The Type that extends the inventory entry with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the inventory entry'),
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
        // Delete action (for backward compatibility)
        z.object({
          action: z.literal('delete'),
        }),
      ])
    )
    .describe('Update actions to be performed on the inventory entry'),
});

// Parameters for deleting an inventory entry by ID
export const deleteInventoryByIdParameters = z.object({
  id: z.string().describe('The ID of the inventory entry to delete'),
  version: z
    .number()
    .int()
    .describe('The current version of the inventory entry'),
});

// Parameters for deleting an inventory entry by key
export const deleteInventoryByKeyParameters = z.object({
  key: z.string().describe('The key of the inventory entry to delete'),
  version: z
    .number()
    .int()
    .describe('The current version of the inventory entry'),
});

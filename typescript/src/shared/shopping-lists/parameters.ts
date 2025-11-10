import {z} from 'zod';

// Parameters for reading shopping lists
export const readShoppingListParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the shopping list to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the shopping list to retrieve'),

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
      'Query predicates specified as strings. Example: ["customer(id=\\"customer-123\\")"]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["customer", "lineItems[*].variant"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the shopping list from'),
});

// Parameters for creating a shopping list
export const createShoppingListParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the shopping list'),
  name: z
    .record(z.string(), z.string())
    .describe('Name of the shopping list (localized string)'),
  slug: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      'Human-readable identifiers usually used as deep-link URL to the related ShoppingList'
    ),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Description of the shopping list (localized string)'),
  customer: z
    .object({
      id: z.string(),
      typeId: z.literal('customer'),
    })
    .optional()
    .describe('Reference to a Customer associated with the ShoppingList'),
  store: z
    .object({
      key: z.string(),
      typeId: z.literal('store'),
    })
    .optional()
    .describe('Reference to a Store the ShoppingList is associated with'),
  businessUnit: z
    .object({
      key: z.string(),
      typeId: z.literal('business-unit'),
    })
    .optional()
    .describe(
      'Reference to a Business Unit the ShoppingList is associated with'
    ),
  lineItems: z
    .array(
      z.object({
        productId: z.string().optional().describe('ID of the Product'),
        sku: z.string().optional().describe('SKU of the Product Variant'),
        variantId: z.number().optional().describe('ID of the Product Variant'),
        quantity: z.number().int().min(1).describe('Quantity of the line item'),
        addedAt: z
          .string()
          .optional()
          .describe(
            'Date and time (UTC) the line item was added to the ShoppingList'
          ),
        custom: z
          .record(z.string(), z.any())
          .optional()
          .describe('Custom fields for the line item'),
      })
    )
    .optional()
    .describe('Line Items (containing Products) of the ShoppingList'),
  textLineItems: z
    .array(
      z.object({
        name: z
          .record(z.string(), z.string())
          .describe('Name of the text line item (localized string)'),
        description: z
          .record(z.string(), z.string())
          .optional()
          .describe('Description of the text line item (localized string)'),
        quantity: z
          .number()
          .int()
          .min(1)
          .describe('Quantity of the text line item'),
        addedAt: z
          .string()
          .optional()
          .describe(
            'Date and time (UTC) the text line item was added to the ShoppingList'
          ),
        custom: z
          .record(z.string(), z.any())
          .optional()
          .describe('Custom fields for the text line item'),
      })
    )
    .optional()
    .describe('Line Items (containing text values) of the ShoppingList'),
  deleteDaysAfterLastModification: z
    .number()
    .int()
    .min(1)
    .max(365250)
    .optional()
    .describe(
      'Number of days after the last modification before a ShoppingList is deleted'
    ),
  anonymousId: z
    .string()
    .optional()
    .describe('Identifies ShoppingLists belonging to an anonymous session'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the shopping list'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the shopping list in'),
});

// Parameters for updating a shopping list
export const updateShoppingListParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the shopping list to update'),
  key: z.string().optional().describe('The key of the shopping list to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the shopping list on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Name action
        z.object({
          action: z.literal('changeName'),
          name: z
            .record(z.string(), z.string())
            .describe('New name for the shopping list (localized string)'),
        }),
        // Change Description action
        z.object({
          action: z.literal('changeDescription'),
          description: z
            .record(z.string(), z.string())
            .optional()
            .describe(
              'New description for the shopping list (localized string)'
            ),
        }),
        // Add Line Item action
        z.object({
          action: z.literal('addLineItem'),
          productId: z.string().describe('ID of the Product'),
          variantId: z
            .number()
            .optional()
            .describe('ID of the Product Variant'),
          sku: z.string().optional().describe('SKU of the Product Variant'),
          quantity: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Quantity of the line item'),
          addedAt: z
            .string()
            .optional()
            .describe('Date and time (UTC) the line item was added'),
          custom: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the line item'),
        }),
        // Remove Line Item action
        z.object({
          action: z.literal('removeLineItem'),
          lineItemId: z.string().describe('ID of the line item to remove'),
        }),
        // Change Line Item Quantity action
        z.object({
          action: z.literal('changeLineItemQuantity'),
          lineItemId: z
            .string()
            .describe('ID of the line item to change quantity'),
          quantity: z
            .number()
            .int()
            .min(1)
            .describe('New quantity for the line item'),
        }),
        // Add Text Line Item action
        z.object({
          action: z.literal('addTextLineItem'),
          name: z
            .record(z.string(), z.string())
            .describe('Name of the text line item (localized string)'),
          description: z
            .record(z.string(), z.string())
            .optional()
            .describe('Description of the text line item (localized string)'),
          quantity: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Quantity of the text line item'),
          addedAt: z
            .string()
            .optional()
            .describe('Date and time (UTC) the text line item was added'),
          custom: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the text line item'),
        }),
        // Remove Text Line Item action
        z.object({
          action: z.literal('removeTextLineItem'),
          textLineItemId: z
            .string()
            .describe('ID of the text line item to remove'),
        }),
        // Change Text Line Item Quantity action
        z.object({
          action: z.literal('changeTextLineItemQuantity'),
          textLineItemId: z
            .string()
            .describe('ID of the text line item to change quantity'),
          quantity: z
            .number()
            .int()
            .min(1)
            .describe('New quantity for the text line item'),
        }),
        // Change Text Line Item Name action
        z.object({
          action: z.literal('changeTextLineItemName'),
          textLineItemId: z
            .string()
            .describe('ID of the text line item to change name'),
          name: z
            .record(z.string(), z.string())
            .describe('New name for the text line item (localized string)'),
        }),
        // Change Text Line Item Description action
        z.object({
          action: z.literal('changeTextLineItemDescription'),
          textLineItemId: z
            .string()
            .describe('ID of the text line item to change description'),
          description: z
            .record(z.string(), z.string())
            .optional()
            .describe(
              'New description for the text line item (localized string)'
            ),
        }),
        // Set Delete Days After Last Modification action
        z.object({
          action: z.literal('setDeleteDaysAfterLastModification'),
          deleteDaysAfterLastModification: z
            .number()
            .int()
            .min(1)
            .max(365250)
            .optional()
            .describe(
              'Number of days after the last modification before deletion'
            ),
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
              'The Type that extends the shopping list with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the shopping list'),
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
    .describe('Update actions to be performed on the shopping list'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the shopping list belongs to'),
});

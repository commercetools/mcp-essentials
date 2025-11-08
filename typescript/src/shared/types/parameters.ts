import {z} from 'zod';

// Field type definitions
const fieldTypeSchema = z.union([
  z.object({
    name: z.literal('Boolean'),
  }),
  z.object({
    name: z.literal('String'),
  }),
  z.object({
    name: z.literal('LocalizedString'),
  }),
  z.object({
    name: z.literal('Enum'),
    values: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
      })
    ),
  }),
  z.object({
    name: z.literal('LocalizedEnum'),
    values: z.array(
      z.object({
        key: z.string(),
        label: z.record(z.string()),
      })
    ),
  }),
  z.object({
    name: z.literal('Number'),
  }),
  z.object({
    name: z.literal('Money'),
  }),
  z.object({
    name: z.literal('Date'),
  }),
  z.object({
    name: z.literal('Time'),
  }),
  z.object({
    name: z.literal('DateTime'),
  }),
  z.object({
    name: z.literal('Reference'),
    referenceTypeId: z.string(),
  }),
  z.object({
    name: z.literal('Set'),
    elementType: z.any(),
  }),
]);

// Parameters for reading types
export const readTypeParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the type to retrieve'),

  // Optional key for getting by key
  key: z.string().optional().describe('The key of the type to retrieve'),

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
      'Query predicates specified as strings. Example: ["key=\\"my-type\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["fieldDefinitions[*].type"]'
    ),
});

// Parameters for creating a type
export const createTypeParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .describe('User-defined unique identifier for the type'),
  name: z.string().describe('Name of the type'),
  description: z.string().optional().describe('Description of the type'),
  resourceTypeIds: z
    .array(z.string())
    .describe(
      'Resource types that can be customized with this type (e.g., ["category", "product"])'
    ),
  fieldDefinitions: z
    .array(
      z.object({
        name: z.string().describe('Name of the field definition'),
        label: z
          .record(z.string())
          .describe('Localized label for the field definition'),
        required: z
          .boolean()
          .optional()
          .describe('Whether the field is required'),
        inputHint: z
          .enum(['SingleLine', 'MultiLine'])
          .optional()
          .describe('Input hint for String fields'),
        type: fieldTypeSchema.describe('Type of the field definition'),
      })
    )
    .optional()
    .describe('Field definitions for the type'),
});

// Parameters for updating a type
export const updateTypeParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the type to update'),
  key: z.string().optional().describe('The key of the type to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the type on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Key action
        z.object({
          action: z.literal('changeKey'),
          key: z
            .string()
            .min(2)
            .max(256)
            .regex(/^[A-Za-z0-9_-]+$/)
            .describe('New key for the type'),
        }),
        // Change Name action
        z.object({
          action: z.literal('changeName'),
          name: z.string().describe('New name for the type'),
        }),
        // Set Description action
        z.object({
          action: z.literal('setDescription'),
          description: z
            .string()
            .optional()
            .describe('New description for the type'),
        }),
        // Add Field Definition action
        z.object({
          action: z.literal('addFieldDefinition'),
          fieldDefinition: z
            .object({
              name: z.string().describe('Name of the field definition'),
              label: z
                .record(z.string())
                .describe('Localized label for the field definition'),
              required: z
                .boolean()
                .optional()
                .describe('Whether the field is required'),
              inputHint: z
                .enum(['SingleLine', 'MultiLine'])
                .optional()
                .describe('Input hint for String fields'),
              type: fieldTypeSchema.describe('Type of the field definition'),
            })
            .describe('Field definition to add'),
        }),
        // Remove Field Definition action
        z.object({
          action: z.literal('removeFieldDefinition'),
          fieldName: z
            .string()
            .describe('Name of the field definition to remove'),
        }),
        // Change Label action
        z.object({
          action: z.literal('changeLabel'),
          fieldName: z.string().describe('Name of the field to update'),
          label: z
            .record(z.string())
            .describe('New localized label for the field'),
        }),
        // Change Field Definition Order action
        z.object({
          action: z.literal('changeFieldDefinitionOrder'),
          fieldNames: z
            .array(z.string())
            .describe('New order of field definitions (array of field names)'),
        }),
        // Set Input Hint action
        z.object({
          action: z.literal('setInputHint'),
          fieldName: z.string().describe('Name of the field to update'),
          inputHint: z
            .enum(['SingleLine', 'MultiLine'])
            .describe('New input hint for the field'),
        }),
      ])
    )
    .describe('Update actions to be performed on the type'),
});

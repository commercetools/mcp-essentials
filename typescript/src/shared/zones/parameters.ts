import {z} from 'zod';

// Parameters for reading zones
export const readZoneParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the zone to retrieve'),

  // Optional key for getting by key
  key: z.string().optional().describe('The key of the zone to retrieve'),

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
      'Query predicates specified as strings. Example: ["name=\\"Europe\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe('An array of reference paths to expand. Example: ["locations"]'),
});

// Parameters for creating a zone
export const createZoneParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the zone'),
  name: z.string().describe('Name of the zone'),
  description: z.string().optional().describe('Description of the zone'),
  locations: z
    .array(
      z.object({
        country: z
          .string()
          .length(2)
          .describe('Country code (ISO 3166-1 alpha-2)'),
        state: z
          .string()
          .optional()
          .describe('State or region within the country'),
      })
    )
    .optional()
    .describe('Array of locations that belong to the zone'),
});

// Parameters for updating a zone
export const updateZoneParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the zone to update'),
  key: z.string().optional().describe('The key of the zone to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the zone on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Name action
        z.object({
          action: z.literal('changeName'),
          name: z.string().describe('New name for the zone'),
        }),
        // Set Description action
        z.object({
          action: z.literal('setDescription'),
          description: z
            .string()
            .optional()
            .describe('New description for the zone'),
        }),
        // Add Location action
        z.object({
          action: z.literal('addLocation'),
          location: z
            .object({
              country: z
                .string()
                .length(2)
                .describe('Country code (ISO 3166-1 alpha-2)'),
              state: z
                .string()
                .optional()
                .describe('State or region within the country'),
            })
            .describe('Location to add to the zone'),
        }),
        // Remove Location action
        z.object({
          action: z.literal('removeLocation'),
          location: z
            .object({
              country: z
                .string()
                .length(2)
                .describe('Country code (ISO 3166-1 alpha-2)'),
              state: z
                .string()
                .optional()
                .describe('State or region within the country'),
            })
            .describe('Location to remove from the zone'),
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
            .describe('New key for the zone'),
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
            .describe('The Type that extends the zone with custom fields'),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the zone'),
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
    .describe('Update actions to be performed on the zone'),
});

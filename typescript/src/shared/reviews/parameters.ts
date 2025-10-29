import {z} from 'zod';

// Parameters for reading reviews
export const readReviewParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the review to retrieve'),

  // Optional key for getting by key
  key: z.string().optional().describe('The key of the review to retrieve'),

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
      'Query predicates specified as strings. Example: ["rating > 50"]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["customer", "target"]'
    ),
});

// Parameters for creating a review
export const createReviewParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .optional()
    .describe('User-defined unique identifier for the review'),
  uniquenessValue: z
    .string()
    .optional()
    .describe(
      'Must be unique among reviews. Used to ensure only one review per specified scope'
    ),
  locale: z
    .record(z.string(), z.any())
    .optional()
    .describe('Language in which the content is written'),
  authorName: z
    .string()
    .optional()
    .describe('Name of the author of the review'),
  title: z.string().optional().describe('Title of the review'),
  text: z.string().optional().describe('Text content of the review'),
  target: z
    .union([
      z.object({
        id: z.string().optional(),
        key: z.string().optional(),
        typeId: z.literal('product'),
      }),
      z.object({
        id: z.string().optional(),
        key: z.string().optional(),
        typeId: z.literal('channel'),
      }),
    ])
    .optional()
    .describe('Identifies the target of the review (Product or Channel)'),
  state: z
    .object({
      id: z.string().optional(),
      key: z.string().optional(),
      typeId: z.literal('state'),
    })
    .optional()
    .describe('State of the review. Used for approval processes'),
  rating: z
    .number()
    .int()
    .min(-100)
    .max(100)
    .optional()
    .describe('Rating of the Product or Channel. Minimum: -100, Maximum: 100'),
  customer: z
    .object({
      id: z.string().optional(),
      key: z.string().optional(),
      typeId: z.literal('customer'),
    })
    .optional()
    .describe('Customer who created the review'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()).optional(),
    })
    .optional()
    .describe('Custom fields for the review'),
});

// Parameters for updating a review
export const updateReviewParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the review to update'),
  key: z.string().optional().describe('The key of the review to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the review on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
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
        // Set Author Name action
        z.object({
          action: z.literal('setAuthorName'),
          authorName: z.string().optional().describe('Value to set'),
        }),
        // Set Title action
        z.object({
          action: z.literal('setTitle'),
          title: z.string().optional().describe('Value to set'),
        }),
        // Set Text action
        z.object({
          action: z.literal('setText'),
          text: z.string().optional().describe('Value to set'),
        }),
        // Set Target action
        z.object({
          action: z.literal('setTarget'),
          target: z
            .union([
              z.object({
                id: z.string(),
                typeId: z.literal('product'),
              }),
              z.object({
                id: z.string(),
                typeId: z.literal('channel'),
              }),
            ])
            .optional()
            .describe('Value to set'),
        }),
        // Set Rating action
        z.object({
          action: z.literal('setRating'),
          rating: z
            .number()
            .int()
            .min(-100)
            .max(100)
            .optional()
            .describe('Value to set'),
        }),
        // Set Customer action
        z.object({
          action: z.literal('setCustomer'),
          customer: z
            .object({
              id: z.string(),
              typeId: z.literal('customer'),
            })
            .optional()
            .describe('Value to set'),
        }),
        // Set State action
        z.object({
          action: z.literal('setState'),
          state: z
            .object({
              id: z.string(),
              typeId: z.literal('state'),
            })
            .optional()
            .describe('Value to set'),
        }),
        // Transition State action
        z.object({
          action: z.literal('transitionState'),
          state: z.object({
            id: z.string(),
            typeId: z.literal('state'),
          }),
          force: z
            .boolean()
            .optional()
            .describe('Force transition even if validation fails'),
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
            .describe('The Type that extends the review with custom fields'),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the review'),
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
    .describe('Update actions to be performed on the review'),
});

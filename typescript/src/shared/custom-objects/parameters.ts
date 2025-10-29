import {z} from 'zod';

// Parameters for reading custom objects
export const readCustomObjectParameters = z.object({
  // Optional container and key for getting by container and key
  container: z
    .string()
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .optional()
    .describe('Container of the custom object to retrieve'),
  key: z
    .string()
    .min(1)
    .max(256)
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .optional()
    .describe('Key of the custom object to retrieve'),

  // List parameters (used when container is provided but key is not)
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
      'Sort criteria for the results. Example: ["createdAt desc", "key asc"]'
    ),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["container=\\"myContainer\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["value.order"]'
    ),
});

// Parameters for creating a custom object
export const createCustomObjectParameters = z.object({
  container: z
    .string()
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe('Namespace to group custom objects'),
  key: z
    .string()
    .min(1)
    .max(256)
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe(
      'User-defined unique identifier of the custom object within the defined container'
    ),
  value: z
    .any()
    .describe(
      'Can be any JSON standard type, such as number, string, boolean, array, object, or a common API data type'
    ),
});

// Parameters for updating a custom object
export const updateCustomObjectParameters = z.object({
  // Identifier options (container and key must be provided)
  container: z
    .string()
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe('Container of the custom object to update'),
  key: z
    .string()
    .min(1)
    .max(256)
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe('Key of the custom object to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the custom object on which the changes should be applied'
    ),

  value: z
    .any()
    .describe(
      'Can be any JSON standard type, such as number, string, boolean, array, object, or a common API data type'
    ),

  // Actions to perform
  // actions: z
  //   .array(
  //     z.union([
  //       // Set Value action
  //       z.object({
  //         action: z.literal('setValue'),
  //         value: z.any().describe('New value for the custom object'),
  //       }),
  //     ])
  //   )
  //   .describe('Update actions to be performed on the custom object'),
});

// Parameters for deleting a custom object by container and key
export const deleteCustomObjectParameters = z.object({
  container: z
    .string()
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe('Container of the custom object to delete'),
  key: z
    .string()
    .min(1)
    .max(256)
    .regex(/^[-_~.a-zA-Z0-9]+$/)
    .describe('Key of the custom object to delete'),
  version: z
    .number()
    .int()
    .describe('The current version of the custom object'),
  dataErasure: z
    .boolean()
    .optional()
    .describe(
      'To erase all related personal data in compliance with GDPR, set to true. Default: false'
    ),
});

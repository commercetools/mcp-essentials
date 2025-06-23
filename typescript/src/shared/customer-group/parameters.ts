import {z} from 'zod';

// Common schemas
export const customerGroupReferenceSchema = z.object({
  id: z.string(),
  typeId: z.literal('customer-group'),
});

export const customerGroupResourceIdentifierSchema = z
  .object({
    id: z.string().optional(),
    key: z.string().optional(),
    typeId: z.literal('customer-group'),
  })
  .refine((data) => data.id !== undefined || data.key !== undefined, {
    message: 'Either id or key must be provided',
  });

// Custom fields related schemas
export const customFieldsSchema = z.object({
  type: z.object({
    id: z.string(),
    typeId: z.literal('type'),
  }),
  fields: z.record(z.any()),
});

export const customFieldsDraftSchema = customFieldsSchema;

// Read customer group parameters
export const readCustomerGroupByIdParametersSchema = z.object({
  id: z.string(),
  expand: z.array(z.string()).optional(),
});

export const readCustomerGroupByKeyParametersSchema = z.object({
  key: z.string(),
  expand: z.array(z.string()).optional(),
});

export const queryCustomerGroupsParametersSchema = z.object({
  where: z.array(z.string()).optional(),
  sort: z.array(z.string()).optional(),
  limit: z.number().min(1).max(500).optional(),
  offset: z.number().min(0).optional(),
  expand: z.array(z.string()).optional(),
});

// Create customer group parameters
export const customerGroupDraftSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),
  groupName: z.string(),
  custom: customFieldsDraftSchema.optional(),
});

export const createCustomerGroupParametersSchema = customerGroupDraftSchema;

// Update customer group parameters
export const changeNameActionSchema = z.object({
  action: z.literal('changeName'),
  name: z.string(),
});

export const setKeyActionSchema = z.object({
  action: z.literal('setKey'),
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),
});

export const setCustomTypeActionSchema = z.object({
  action: z.literal('setCustomType'),
  type: z
    .object({
      id: z.string(),
      typeId: z.literal('type'),
    })
    .optional(),
  fields: z.record(z.any()).optional(),
});

export const setCustomFieldActionSchema = z.object({
  action: z.literal('setCustomField'),
  name: z.string(),
  value: z.any().optional(),
});

export const customerGroupUpdateActionSchema = z.discriminatedUnion('action', [
  changeNameActionSchema,
  setKeyActionSchema,
  setCustomTypeActionSchema,
  setCustomFieldActionSchema,
]);

export const updateCustomerGroupByIdParametersSchema = z.object({
  id: z.string(),
  version: z.number(),
  actions: z.array(customerGroupUpdateActionSchema),
});

export const updateCustomerGroupByKeyParametersSchema = z.object({
  key: z.string(),
  version: z.number(),
  actions: z.array(customerGroupUpdateActionSchema),
});

// Types based on the schemas
export type CustomerGroupReference = z.infer<
  typeof customerGroupReferenceSchema
>;
export type CustomerGroupResourceIdentifier = z.infer<
  typeof customerGroupResourceIdentifierSchema
>;
export type CustomFields = z.infer<typeof customFieldsSchema>;
export type CustomFieldsDraft = z.infer<typeof customFieldsDraftSchema>;
export type ReadCustomerGroupByIdParameters = z.infer<
  typeof readCustomerGroupByIdParametersSchema
>;
export type ReadCustomerGroupByKeyParameters = z.infer<
  typeof readCustomerGroupByKeyParametersSchema
>;
export type QueryCustomerGroupsParameters = z.infer<
  typeof queryCustomerGroupsParametersSchema
>;
export type CustomerGroupDraft = z.infer<typeof customerGroupDraftSchema>;
export type CreateCustomerGroupParameters = z.infer<
  typeof createCustomerGroupParametersSchema
>;
export type CustomerGroupUpdateAction = z.infer<
  typeof customerGroupUpdateActionSchema
>;
export type UpdateCustomerGroupByIdParameters = z.infer<
  typeof updateCustomerGroupByIdParametersSchema
>;
export type UpdateCustomerGroupByKeyParameters = z.infer<
  typeof updateCustomerGroupByKeyParametersSchema
>;

// Define parameter schemas directly here for simplicity
export const readCustomerGroupParameters = z.object({
  id: z.string().optional().describe('The ID of the customer group to fetch'),
  key: z.string().optional().describe('The key of the customer group to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering customer groups. Example: ["name=\\"Webshop user\\""]'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["name asc", "createdAt desc"]'
    ),
  limit: z
    .number()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 10.'
    ),
  offset: z
    .number()
    .min(0)
    .optional()
    .describe(
      'The number of items to skip before starting to collect the result set.'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe('An array of field paths to expand. Example: ["custom.type"]'),
});

const createCustomerGroupParameters = z.object({
  groupName: z
    .string()
    .describe('Unique name of the customer group in the project'),
  key: z
    .string()
    .optional()
    .describe(
      'User-defined unique identifier for the Customer Group. Pattern: ^[A-Za-z0-9_-]+$, Min length: 2, Max length: 256'
    ),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the Customer Group'),
});

export const updateCustomerGroupParameters = z
  .object({
    id: z
      .string()
      .optional()
      .describe('The ID of the customer group to update'),
    key: z
      .string()
      .optional()
      .describe('The key of the customer group to update'),
    version: z.number().describe('The current version of the customer group'),
    actions: z.array(
      z
        .object({
          action: z
            .string()
            .describe('The name of the update action to perform'),
        })
        .and(z.record(z.string(), z.any()).optional())
        .describe(
          'Array of update actions to perform on the customer group. Each action should have an "action" field and other fields specific to that action type.'
        )
    ),
  })
  .refine((data) => data.id !== undefined || data.key !== undefined, {
    message: 'Either id or key must be provided',
  });

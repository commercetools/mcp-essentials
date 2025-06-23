import {z} from 'zod';

// Common schemas
const businessUnitReference = z.object({
  id: z.string(),
  typeId: z.literal('business-unit'),
});

const businessUnitKeyReference = z.object({
  key: z.string(),
  typeId: z.literal('business-unit'),
});

const storeKeyReference = z.object({
  key: z.string(),
  typeId: z.literal('store'),
});

const address = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  title: z.string().optional(),
  salutation: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  streetName: z.string().optional(),
  streetNumber: z.string().optional(),
  additionalStreetInfo: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  state: z.string().optional(),
  country: z.string().describe('Country code in ISO 3166-1 alpha-2 format'),
  company: z.string().optional(),
  department: z.string().optional(),
  building: z.string().optional(),
  apartment: z.string().optional(),
  pOBox: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  additionalAddressInfo: z.string().optional(),
  externalId: z.string().optional(),
  custom: z.record(z.string(), z.any()).optional(),
});

const associateRoleAssignmentDraft = z.object({
  associateRole: z.object({
    key: z.string(),
    typeId: z.literal('associate-role'),
  }),
  inheritance: z.enum(['Enabled', 'Disabled']).optional(),
});

const associateDraft = z.object({
  customer: z.object({
    id: z.string(),
    typeId: z.literal('customer'),
  }),
  associateRoleAssignments: z.array(associateRoleAssignmentDraft),
});

// Parameters for reading a business unit
export const readBusinessUnitParameters = z.object({
  id: z.string().optional().describe('The ID of the business unit to fetch'),
  key: z.string().optional().describe('The key of the business unit to fetch'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering business units. Example: ["status=\\"Active\\""]'
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
      'An array of field paths to expand. Example: ["associates[*].customer"]'
    ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read the business unit from'),
});

// Parameters for creating a business unit
export const createBusinessUnitParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .describe(
      'User-defined unique and immutable identifier of the Business Unit'
    ),
  name: z.string().describe('Name of the Business Unit'),
  unitType: z
    .enum(['Company', 'Division'])
    .describe('Type of the Business Unit'),
  contactEmail: z
    .string()
    .email()
    .optional()
    .describe('Email address of the Business Unit'),
  status: z
    .enum(['Active', 'Inactive'])
    .optional()
    .describe('Status of the Business Unit. Defaults to Active'),
  stores: z
    .array(storeKeyReference)
    .optional()
    .describe('References to Stores the Business Unit is associated with'),
  storeMode: z
    .enum(['Explicit', 'FromParent'])
    .optional()
    .describe('Mode that defines how Stores are inherited'),
  parentUnit: z
    .union([businessUnitReference, businessUnitKeyReference])
    .optional()
    .describe('Parent Business Unit of the Business Unit'),
  addresses: z
    .array(address)
    .optional()
    .describe('Addresses of the Business Unit'),
  shippingAddressIds: z
    .array(z.string())
    .optional()
    .describe('IDs of addresses suitable for shipping'),
  defaultShippingAddressId: z
    .string()
    .optional()
    .describe('ID of the address suitable for shipping'),
  billingAddressIds: z
    .array(z.string())
    .optional()
    .describe('IDs of addresses suitable for billing'),
  defaultBillingAddressId: z
    .string()
    .optional()
    .describe('ID of the address suitable for billing'),
  associates: z
    .array(associateDraft)
    .optional()
    .describe('Associates of the Business Unit'),
  associateMode: z
    .enum(['Explicit', 'ExplicitAndFromParent'])
    .optional()
    .describe('Mode that defines how Associates are inherited'),
  approvalRuleMode: z
    .enum(['Explicit', 'ExplicitAndFromParent'])
    .optional()
    .describe('Mode that defines how Approval Rules are inherited'),
  custom: z
    .record(z.string(), z.any())
    .optional()
    .describe('Custom fields for the Business Unit'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create the business unit in'),
});

// Parameters for updating a business unit
export const updateBusinessUnitParameters = z.object({
  id: z.string().optional().describe('The ID of the business unit to update'),
  key: z.string().optional().describe('The key of the business unit to update'),
  version: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The current version of the business unit (optional - will be fetched automatically if not provided)'
    ),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the business unit. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the business unit belongs to'),
});

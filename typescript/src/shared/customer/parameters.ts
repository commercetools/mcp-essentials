import {z} from 'zod';

export const createCustomerParameters = z.object({
  email: z.string().email().describe('Customer email address'),
  storeKey: z.string().optional().describe('Store key'),
  password: z.string().describe('Customer password'),
  firstName: z.string().optional().describe('Customer first name'),
  lastName: z.string().optional().describe('Customer last name'),
  middleName: z.string().optional().describe('Customer middle name'),
  title: z
    .string()
    .optional()
    .describe('Customer title (e.g., Mr., Mrs., Dr.)'),
  dateOfBirth: z
    .string()
    .optional()
    .describe('Customer date of birth in ISO 8601 format (YYYY-MM-DD)'),
  companyName: z.string().optional().describe('Customer company name'),
  vatId: z.string().optional().describe('Customer VAT identification number'),
  addresses: z
    .array(
      z.object({
        streetName: z.string().describe('Street name'),
        streetNumber: z.string().optional().describe('Street number'),
        additionalStreetInfo: z
          .string()
          .optional()
          .describe('Additional street information'),
        postalCode: z.string().describe('Postal code'),
        city: z.string().describe('City'),
        region: z.string().optional().describe('Region'),
        state: z.string().optional().describe('State'),
        country: z.string().describe('Country code (ISO 3166-1 alpha-2)'),
        company: z.string().optional().describe('Company name'),
        department: z.string().optional().describe('Department'),
        building: z.string().optional().describe('Building'),
        apartment: z.string().optional().describe('Apartment'),
        pOBox: z.string().optional().describe('P.O. Box'),
        phone: z.string().optional().describe('Phone'),
        mobile: z.string().optional().describe('Mobile phone'),
        email: z.string().email().optional().describe('Email'),
        fax: z.string().optional().describe('Fax'),
        additionalAddressInfo: z
          .string()
          .optional()
          .describe('Additional address information'),
      })
    )
    .optional()
    .describe('Customer addresses'),
  defaultShippingAddress: z
    .number()
    .int()
    .optional()
    .describe('Index of default shipping address in the addresses array'),
  defaultBillingAddress: z
    .number()
    .int()
    .optional()
    .describe('Index of default billing address in the addresses array'),
  shippingAddresses: z
    .array(z.number().int())
    .optional()
    .describe('Indices of shipping addresses in the addresses array'),
  billingAddresses: z
    .array(z.number().int())
    .optional()
    .describe('Indices of billing addresses in the addresses array'),
  isEmailVerified: z
    .boolean()
    .optional()
    .describe('Whether the customer email is verified'),
  externalId: z.string().optional().describe('Customer external ID'),
  customerGroup: z
    .object({
      id: z.string(),
      typeId: z.literal('customer-group'),
    })
    .optional()
    .describe('Customer group reference'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields'),
  locale: z.string().optional().describe('Customer locale'),
  salutation: z.string().optional().describe('Customer salutation'),
  key: z.string().optional().describe('Customer key'),
});

export const readCustomerParameters = z.object({
  id: z.string().optional().describe('Customer ID'),
  storeKey: z.string().optional().describe('Store key'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["email = \\"customer@example.com\\""]'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["firstName asc", "createdAt desc"]'
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
  expand: z
    .array(z.string())
    .optional()
    .describe('Fields to expand. Example: ["customerGroup"]'),
});

export const updateCustomerParameters = z.object({
  id: z.string().describe('The ID of the customer to update'),
  version: z.number().int().describe('The current version of the customer'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the customer. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

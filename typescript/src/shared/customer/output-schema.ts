import {z} from 'zod';

// Generated schemas for customer
// DO NOT EDIT - This file is auto-generated

// Base Customer schema
export const customerSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    key: z.string().optional(),
    customerNumber: z.string().optional(),
    externalId: z.string().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    email: z.string(),
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    title: z.string().optional(),
    dateOfBirth: z.string().optional(),
    companyName: z.string().optional(),
    vatId: z.string().optional(),
    addresses: z.array(z.any()),
    defaultShippingAddressId: z.string().optional(),
    shippingAddressIds: z.array(z.string()).optional(),
    defaultBillingAddressId: z.string().optional(),
    billingAddressIds: z.array(z.string()).optional(),
    isEmailVerified: z.boolean(),
    customerGroup: z.any().optional(),
    customerGroupAssignments: z.array(z.any()).optional(),
    custom: z.any().optional(),
    locale: z.string().optional(),
    salutation: z.string().optional(),
    stores: z.array(z.any()),
    authenticationMode: z.any(),
  })
  .strict();

// Paged CustomerPagedQueryResponse schema
export const customerPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const createCustomerOutputSchema = customerSchema;
export const readCustomerOutputSchema = customerSchema || customerPagedSchema;
export const updateCustomerOutputSchema = customerSchema;

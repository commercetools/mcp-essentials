import {z} from 'zod';

// Base ShoppingList schema
export const shoppingListsSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    name: z.any(),
    key: z.string().optional(),
    customer: z.any().optional(),
    slug: z.any().optional(),
    description: z.any().optional(),
    lineItems: z.array(z.any()),
    textLineItems: z.array(z.any()),
    deleteDaysAfterLastModification: z.number().optional(),
    anonymousId: z.string().optional(),
    store: z.any().optional(),
    businessUnit: z.any().optional(),
    custom: z.any().optional(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
  })
  .strict();

// Paged ShoppingListPagedQueryResponse schema
export const shoppingListsPagedSchema = z
  .object({
    limit: z.number(),
    count: z.number(),
    total: z.number().optional(),
    offset: z.number(),
    results: z.array(z.any()),
  })
  .strict();

export const readShoppingListOutputSchema =
  shoppingListsSchema || shoppingListsPagedSchema;
export const createShoppingListOutputSchema = shoppingListsSchema;
export const updateShoppingListOutputSchema = shoppingListsSchema;

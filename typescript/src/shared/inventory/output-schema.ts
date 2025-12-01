import {z} from 'zod';

// Base InventoryEntry schema
export const inventorySchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string().optional(),
    sku: z.string(),
    supplyChannel: z.any().optional(),
    quantityOnStock: z.number(),
    availableQuantity: z.number(),
    minCartQuantity: z.number().optional(),
    maxCartQuantity: z.number().optional(),
    restockableInDays: z.number().optional(),
    expectedDelivery: z.string().optional(),
    custom: z.any().optional(),
  })
  .strict();

// Paged InventoryPagedQueryResponse schema
export const inventoryPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readInventoryOutputSchema = z.union([inventorySchema, inventoryPagedSchema]);
export const createInventoryOutputSchema = inventorySchema;
export const updateInventoryOutputSchema = inventorySchema;

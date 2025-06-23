export const readInventoryPrompt = `
Read inventory entries from the commercetools platform. You can:
- Get a single inventory entry by providing either its ID or key
- List multiple inventory entries with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific inventory entry to retrieve (optional)
- key: The key of a specific inventory entry to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["sku=\\"ABC123\\""])
- expand: Reference paths to expand (e.g., ["supplyChannel"])

Examples:
// Get by ID
inventory.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
inventory.read({
  key: "inventory-key-123"
})

// List with filtering
inventory.read({
  limit: 10,
  where: ["sku=\\"product-sku-123\\""]
})
`;

export const createInventoryPrompt = `
Create a new inventory entry in the commercetools platform.

Parameters:
- key: User-defined unique identifier (optional)
- sku: ProductVariant SKU (required)
- supplyChannel: Channel reference that supplies this inventory entry (optional)
- quantityOnStock: Overall amount of stock (required)
- restockableInDays: How often the inventory entry is restocked in days (optional)
- expectedDelivery: Date and time of the next restock in ISO 8601 format (optional)
- custom: Custom fields for the inventory entry (optional)

Example:
inventory.create({
  key: "inventory-key-123",
  sku: "product-sku-123",
  quantityOnStock: 100,
  restockableInDays: 7
})
`;

export const updateInventoryPrompt = `
Update or delete an inventory entry in the commercetools platform. You must identify the entry using either ID or key.

Parameters:
- id: The ID of the inventory entry to update/delete (optional if key is provided)
- key: The key of the inventory entry to update/delete (optional if id is provided)
- version: Expected version of the inventory entry (required)
- actions: Array of update actions (required)

Available update actions:
- addQuantity: Add to quantityOnStock
- removeQuantity: Remove from quantityOnStock
- changeQuantity: Set quantityOnStock
- setKey: Set the key
- setRestockableInDays: Set restockableInDays
- setExpectedDelivery: Set expectedDelivery
- setSupplyChannel: Set supplyChannel
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field
- delete: Delete the inventory entry

Examples:
// Update by ID
inventory.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "addQuantity",
      quantity: 10
    }
  ]
})

// Update by key
inventory.update({
  key: "inventory-key-123",
  version: 1,
  actions: [
    {
      action: "changeQuantity",
      quantity: 50
    }
  ]
})

// Delete by ID
inventory.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "delete"
    }
  ]
})
`;

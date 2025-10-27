export const readShoppingListPrompt = `
Read shopping lists from the commercetools platform. You can:
- Get a single shopping list by providing either its ID or key
- List multiple shopping lists with optional filtering, sorting, and pagination
- Filter by customer, store, or business unit

Parameters:
- id: The ID of a specific shopping list to retrieve (optional)
- key: The key of a specific shopping list to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["name asc", "createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["customer(id=\\"customer-123\\")"])
- expand: Reference paths to expand (e.g., ["customer", "lineItems[*].variant"])
- storeKey: Key of the store to read the shopping list from (optional)

Examples:
// Get by ID
shoppingList.read({
  id: "shopping-list-123"
})
// Get by key
shoppingList.read({
  key: "my-wishlist"
})
// List with limit and sort
shoppingList.read({
  limit: 5,
  sort: ["name asc"]
})
// Filter by customer
shoppingList.read({
  where: ["customer(id=\\"customer-123\\")"]
})
// Store-specific shopping list
shoppingList.read({
  id: "shopping-list-123",
  storeKey: "my-store"
})
`;

export const createShoppingListPrompt = `
Create a new shopping list in the commercetools platform.

Parameters:
- name: Name of the shopping list (localized string, required)
- slug: Human-readable identifiers usually used as deep-link URL (localized string, optional)
- description: Description of the shopping list (localized string, optional)
- customer: Reference to a Customer associated with the ShoppingList (optional)
- store: Reference to a Store the ShoppingList is associated with (optional)
- businessUnit: Reference to a Business Unit the ShoppingList is associated with (optional)
- lineItems: Line Items (containing Products) of the ShoppingList (optional)
  - productId: ID of the Product (string, optional)
  - sku: SKU of the Product Variant (string, optional)
  - variantId: ID of the Product Variant (number, optional)
  - quantity: Quantity of the line item (number, required, minimum: 1)
  - addedAt: Date and time (UTC) the line item was added (string, optional)
  - custom: Custom fields for the line item (object, optional)
- textLineItems: Line Items (containing text values) of the ShoppingList (optional)
  - name: Name of the text line item (localized string, required)
  - description: Description of the text line item (localized string, optional)
  - quantity: Quantity of the text line item (number, required, minimum: 1)
  - addedAt: Date and time (UTC) the text line item was added (string, optional)
  - custom: Custom fields for the text line item (object, optional)
- deleteDaysAfterLastModification: Number of days after the last modification before deletion (number, optional, 1-365250)
- anonymousId: Identifies ShoppingLists belonging to an anonymous session (string, optional)
- custom: Custom fields for the shopping list (object, optional)
- key: User-defined unique identifier for the shopping list (string, optional, 2-256 chars, pattern: ^[A-Za-z0-9_-]+$)
- storeKey: Key of the store to create the shopping list in (string, optional)

Examples:
// Create a simple shopping list
shoppingList.create({
  name: {en: "My Wishlist"},
  description: {en: "Items I want to buy later"}
})
// Create with line items
shoppingList.create({
  name: {en: "Grocery List"},
  lineItems: [
    {
      productId: "product-123",
      variantId: 1,
      quantity: 2
    }
  ],
  key: "grocery-list-2024"
})
// Create with text line items
shoppingList.create({
  name: {en: "Birthday Party List"},
  textLineItems: [
    {
      name: {en: "Balloons"},
      quantity: 1
    },
    {
      name: {en: "Cake"},
      quantity: 1
    }
  ]
})
// Create in store
shoppingList.create({
  name: {en: "Store Wishlist"},
  storeKey: "my-store",
  customer: {
    id: "customer-123",
    typeId: "customer"
  }
})
`;

export const updateShoppingListPrompt = `
Update an existing shopping list in the commercetools platform. You must provide either the 'id' or 'key' of the shopping list to update, along with its current 'version' and an array of 'actions' to apply.

Parameters:
- id: The ID of the shopping list to update (string, required if key is not provided)
- key: The key of the shopping list to update (string, required if id is not provided)
- version: The current version of the shopping list (number, required)
- actions: An array of update actions to apply to the shopping list (array of objects, required)
  - Each action object must specify an 'action' type and relevant fields for that action.
  - Available actions: changeName, changeDescription, addLineItem, removeLineItem, changeLineItemQuantity, addTextLineItem, removeTextLineItem, changeTextLineItemQuantity, changeTextLineItemName, changeTextLineItemDescription, setDeleteDaysAfterLastModification, setCustomType, setCustomField
- storeKey: Key of the store the shopping list belongs to (string, optional)

Examples:
// Change the name of a shopping list by ID
shoppingList.update({
  id: "shopping-list-123",
  version: 1,
  actions: [
    {
      action: "changeName",
      name: {en: "Updated Shopping List"}
    }
  ]
})
// Add a line item
shoppingList.update({
  key: "my-wishlist",
  version: 2,
  actions: [
    {
      action: "addLineItem",
      productId: "product-456",
      variantId: 1,
      quantity: 1
    }
  ]
})
// Add a text line item
shoppingList.update({
  id: "shopping-list-123",
  version: 3,
  actions: [
    {
      action: "addTextLineItem",
      name: {en: "Remember to buy milk"},
      quantity: 1
    }
  ]
})
// Change line item quantity
shoppingList.update({
  id: "shopping-list-123",
  version: 4,
  actions: [
    {
      action: "changeLineItemQuantity",
      lineItemId: "line-item-789",
      quantity: 3
    }
  ]
})
// Remove a line item
shoppingList.update({
  key: "my-wishlist",
  version: 5,
  actions: [
    {
      action: "removeLineItem",
      lineItemId: "line-item-789"
    }
  ]
})
// Set custom field
shoppingList.update({
  id: "shopping-list-123",
  version: 6,
  actions: [
    {
      action: "setCustomField",
      name: "priority",
      value: "high"
    }
  ]
})
`;

export const readRecurringOrderPrompt = `
Read recurring orders from the commercetools platform. You can:
- Get a single recurring order by providing either its ID or key
- List multiple recurring orders with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific recurring order to retrieve (optional)
- key: The key of a specific recurring order to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["customerId=\\"customer-123\\""])
- expand: Reference paths to expand (e.g., ["customer", "cart"])

Examples:
// Get by ID
recurringOrders.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
recurringOrders.read({
  key: "recurring-order-key-123"
})

// List with filtering
recurringOrders.read({
  limit: 10,
  where: ["customerId=\\"customer-123\\""]
})
`;

export const createRecurringOrderPrompt = `
Create a new recurring order in the commercetools platform.

Parameters:
- key: User-defined unique identifier (optional)
- customerId: ID of the customer who owns this recurring order (required)
- orderNumber: Order number for the recurring order (optional)
- originOrder: Reference to the original Order that generated this RecurringOrder (required)
- cart: Reference to the Cart from which the RecurringOrder is created (required)
- cartVersion: The version of the Cart (required)
- schedule: Schedule for the recurring order (required)
- startsAt: Date and time (UTC) when the RecurringOrder starts creating new Orders (optional)
- expiresAt: Date and time (UTC) when the RecurringOrder stops creating new Orders (optional)
- store: Reference to the Store that the RecurringOrder belongs to (optional)
- businessUnit: Reference to the Business Unit that the RecurringOrder belongs to (optional)
- state: Reference to the current state of the RecurringOrder (optional)
- custom: Custom fields for the recurring order (optional)

Example:
recurringOrders.create({
  key: "recurring-order-key-123",
  customerId: "customer-123",
  originOrder: {
    id: "order-123",
    typeId: "order"
  },
  cart: {
    id: "cart-123",
    typeId: "cart"
  },
  cartVersion: 1,
  schedule: {
    type: "standard",
    value: 1,
    intervalUnit: "Months"
  }
})
`;

export const updateRecurringOrderPrompt = `
Update a recurring order in the commercetools platform. You must identify the entry using either ID or key.

Parameters:
- id: The ID of the recurring order to update (optional if key is provided)
- key: The key of the recurring order to update (optional if id is provided)
- version: Expected version of the recurring order (required)
- actions: Array of update actions (required)

Available update actions:
- changeKey: Change the key of the recurring order
- setOrderNumber: Set or remove the order number
- setSchedule: Set the schedule for the recurring order
- setStartsAt: Set the starts at date
- setExpiresAt: Set the expires at date
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field

Examples:
// Update by ID
recurringOrders.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "changeKey",
      key: "new-recurring-order-key"
    }
  ]
})

// Update by key
recurringOrders.update({
  key: "recurring-order-key-123",
  version: 1,
  actions: [
    {
      action: "setSchedule",
      schedule: {
        type: "standard",
        value: 2,
        intervalUnit: "Weeks"
      }
    }
  ]
})

// Set custom field
recurringOrders.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "setCustomField",
      name: "customField",
      value: "customValue"
    }
  ]
})
`;

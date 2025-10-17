export const readShippingMethodPrompt = `
Read shipping methods from the commercetools platform. You can:
- Get a single shipping method by providing either its ID or key
- List multiple shipping methods with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific shipping method to retrieve (optional)
- key: The key of a specific shipping method to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["name asc", "createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["isDefault = true"])
- expand: Reference paths to expand (e.g., ["taxCategory"])

Examples:
// Get by ID
shippingMethod.read({
  id: "shipping-method-123"
})

// Get by key
shippingMethod.read({
  key: "standard-shipping"
})

// List with filtering
shippingMethod.read({
  limit: 10,
  where: ["isDefault = true"]
})

// Find shipping methods for specific zone
shippingMethod.read({
  where: ["zoneRates(zone(id=\\"europe-zone-id\\"))"]
})
`;

export const createShippingMethodPrompt = `
Create a new shipping method in the commercetools platform.

Parameters:
- key: User-defined unique identifier (optional)
- name: Name of the shipping method (required)
- description: Description of the shipping method (optional)
- taxCategory: Reference to a tax category (optional)
- zoneRates: Array of zone rates with shipping rates (required)
- isDefault: Whether this is the default shipping method (optional)
- predicate: Predicate for when this shipping method applies (optional)
- custom: Custom fields for the shipping method (optional)

Example:
shippingMethod.create({
  key: "standard-shipping",
  name: "Standard Shipping",
  description: "Standard shipping to Europe",
  zoneRates: [{
    zone: { id: "europe-zone-id", typeId: "zone" },
    shippingRates: [{
      price: {
        type: "centPrecision",
        currencyCode: "EUR",
        centAmount: 1000,
        fractionDigits: 2
      }
    }]
  }],
  isDefault: true
})
`;

export const updateShippingMethodPrompt = `
Update a shipping method in the commercetools platform. You must identify the method using either ID or key.

Parameters:
- id: The ID of the shipping method to update (optional if key is provided)
- key: The key of the shipping method to update (optional if id is provided)
- version: Expected version of the shipping method (required)
- actions: Array of update actions (required)

Available update actions:
- changeName: Change the name of the shipping method
- setDescription: Set or remove the description
- changeTaxCategory: Change the tax category
- addZone: Add a new zone rate
- removeZone: Remove a zone rate
- changeZone: Change an existing zone rate
- setDefault: Set or unset as default shipping method
- setPredicate: Set or remove the predicate
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field

Examples:
// Update by ID
shippingMethod.update({
  id: "shipping-method-123",
  version: 1,
  actions: [
    {
      action: "changeName",
      name: "Express Shipping"
    }
  ]
})

// Update by key
shippingMethod.update({
  key: "standard-shipping",
  version: 2,
  actions: [
    {
      action: "addZone",
      zone: { id: "us-zone-id", typeId: "zone" },
      shippingRates: [{
        price: {
          type: "centPrecision",
          currencyCode: "USD",
          centAmount: 1500,
          fractionDigits: 2
        }
      }]
    }
  ]
})

// Set as default shipping method
shippingMethod.update({
  id: "shipping-method-123",
  version: 3,
  actions: [
    {
      action: "setDefault",
      isDefault: true
    }
  ]
})
`;

export const readTaxCategoryPrompt = `
Read tax categories from the commercetools platform. You can:
- Get a single tax category by providing either its ID or key
- List multiple tax categories with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific tax category to retrieve (optional)
- key: The key of a specific tax category to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["name asc", "createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["name = \\"Standard Tax\\""])
- expand: Reference paths to expand (e.g., ["rates[*]"])

Examples:
// Get by ID
taxCategory.read({
  id: "tax-category-123"
})
// Get by key
taxCategory.read({
  key: "standard-tax"
})
// List with limit and sort
taxCategory.read({
  limit: 5,
  sort: ["name asc"]
})
`;

export const createTaxCategoryPrompt = `
Create a new tax category in the commercetools platform.

Parameters:
- name: The name of the tax category (string, required)
- description: A description of the tax category (string, optional)
- rates: An array of tax rates for the tax category (array of objects, required)
  - name: The name of the tax rate (string, required)
  - amount: The tax rate amount as a decimal (number, required, e.g., 0.19 for 19%)
  - includedInPrice: Whether the tax is included in the price (boolean, required)
  - country: The country code for this tax rate (string, required, ISO 3166-1 alpha-2)
  - state: The state or region for this tax rate (string, optional)
  - id: The ID of the tax rate (string, optional)
  - key: The key of the tax rate (string, optional)
  - subRates: An array of sub-rates for this tax rate (array of objects, optional)
    - name: The name of the sub-rate (string, required)
    - amount: The sub-rate amount as a decimal (number, required)
    - country: The country code for this sub-rate (string, required)
- key: User-defined unique identifier for the tax category (string, optional)

Examples:
// Create a simple tax category
taxCategory.create({
  name: "Standard Tax",
  description: "Standard tax rate for most products",
  rates: [
    {
      name: "Standard Rate",
      amount: 0.19,
      includedInPrice: false,
      country: "DE"
    }
  ]
})
// Create a tax category with multiple rates
taxCategory.create({
  name: "Multi-Country Tax",
  description: "Tax rates for multiple countries",
  rates: [
    {
      name: "Germany Standard",
      amount: 0.19,
      includedInPrice: false,
      country: "DE"
    },
    {
      name: "France Standard",
      amount: 0.20,
      includedInPrice: false,
      country: "FR"
    }
  ],
  key: "multi-country-tax"
})
`;

export const updateTaxCategoryPrompt = `
Update an existing tax category in the commercetools platform. You must provide either the 'id' or 'key' of the tax category to update, along with its current 'version' and an array of 'actions' to apply.

Parameters:
- id: The ID of the tax category to update (string, required if key is not provided)
- key: The key of the tax category to update (string, required if id is not provided)
- version: The current version of the tax category (number, required)
- actions: An array of update actions to apply to the tax category (array of objects, required)
  - Each action object must specify an 'action' type (e.g., "changeName", "setDescription", "addTaxRate", "removeTaxRate", "replaceTaxRate", "setKey", "setCustomField", "setCustomType") and relevant fields for that action.

Examples:
// Change the name of a tax category by ID
taxCategory.update({
  id: "tax-category-123",
  version: 1,
  actions: [
    {
      action: "changeName",
      name: "Updated Tax Category"
    }
  ]
})
// Set the description of a tax category by key
taxCategory.update({
  key: "standard-tax",
  version: 2,
  actions: [
    {
      action: "setDescription",
      description: "Updated description for standard tax"
    }
  ]
})
// Add a new tax rate
taxCategory.update({
  id: "tax-category-123",
  version: 3,
  actions: [
    {
      action: "addTaxRate",
      taxRate: {
        name: "New Tax Rate",
        amount: 0.21,
        includedInPrice: false,
        country: "IT"
      }
    }
  ]
})
// Replace an existing tax rate
taxCategory.update({
  id: "tax-category-123",
  version: 4,
  actions: [
    {
      action: "replaceTaxRate",
      taxRateId: "existing-rate-id",
      taxRate: {
        name: "Updated Tax Rate",
        amount: 0.22,
        includedInPrice: false,
        country: "IT"
      }
    }
  ]
})
`;

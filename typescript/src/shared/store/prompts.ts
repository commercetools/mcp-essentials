export const readStorePrompt = `
This tool will fetch information about a commercetools store.

It can be used in three ways:
1. To fetch a single store by its ID
2. To fetch a single store by its key
3. To query multiple stores based on criteria

It takes these parameters:
- id (string, optional): The ID of the store to fetch
- key (string, optional): The key of the store to fetch
- where (string array, optional): Query predicates for filtering stores. Example: ["name(en)=\\"My Store\\""]
- limit (int, optional): The number of stores to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["distributionChannels[*]", "supplyChannels[*]"]

At least one of id, key, or where should be provided to narrow down the results.
`;

export const createStorePrompt = `
This tool will create a new Store in commercetools.

It takes these required arguments:
- key (string): User-defined unique and immutable identifier for the Store (min: 2, max: 256, pattern: ^[A-Za-z0-9_-]+$)
- name (object): Name of the Store as a localized string object (e.g., {"en": "My Store", "de": "Mein Geschäft"})

It takes these optional arguments:
- languages (array, optional): Languages configured for the Store as locale strings (e.g., ["en", "de"])
- countries (array, optional): Countries defined for the Store with code field (e.g., [{"code": "US"}, {"code": "DE"}])
- distributionChannels (array, optional): Product Distribution Channels allowed for the Store (max: 100)
- supplyChannels (array, optional): Inventory Supply Channels allowed for the Store (max: 100)
- productSelections (array, optional): Product Selections that control availability of Products for this Store (max: 100)
- custom (object, optional): Custom fields for the Store

Stores let you model the context your customers shop in, such as physical retail locations, brand stores, or regions.
`;

export const updateStorePrompt = `
This tool will update a Store in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the store
- actions (array): An array of update actions to perform on the store. Each action should have an "action" field indicating the action type

It also requires ONE of these identifiers:
- id (string, optional): The ID of the store to update
- key (string, optional): The key of the store to update

Example actions from commercetools API include:
- addDistributionChannel: Add a distribution channel to the store
- addProductSelection: Add a product selection to the store
- addSupplyChannel: Add a supply channel to the store
- changeProductSelectionActive: Change the active status of a product selection
- removeDistributionChannel: Remove a distribution channel from the store
- removeProductSelection: Remove a product selection from the store
- removeSupplyChannel: Remove a supply channel from the store
- setCountries: Set the countries for the store
- setCustomField: Set a custom field on the store
- setCustomType: Set a custom type on the store
- setDistributionChannels: Set the distribution channels for the store
- setLanguages: Set the languages for the store
- setName: Set the name of the store
- setProductSelections: Set the product selections for the store
- setSupplyChannels: Set the supply channels for the store

Each action type requires specific fields according to the commercetools API.
`;

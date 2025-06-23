export const readProductSelectionPrompt = `
This tool will fetch ProductSelections from commercetools.

It can be used in two ways:

1. To fetch a specific ProductSelection by providing either:
   - id (string, optional): The ID of the ProductSelection to fetch, or
   - key (string, optional): The key of the ProductSelection to fetch.
   - expand (string array, optional): References to expand in the returned object.

2. To query a list of ProductSelections by providing any of these optional parameters:
   - where (string array, optional): Query predicates for filtering. Example: ["name(en=\\"Summer Collection\\")"]
   - sort (string array, optional): Sort criteria. Example: ["name.en asc", "createdAt desc"]
   - limit (number, optional): Maximum number of results to return (default: 20, max: 500)
   - offset (number, optional): Number of results to skip
   - expand (string array, optional): References to expand in the returned objects

Note: When querying (without id/key), the response will be a paged object containing 'results' array.
`;

export const createProductSelectionPrompt = `
This tool will create a new ProductSelection in commercetools.

It takes these arguments:
- name (localized-string, required): The localized name of the ProductSelection.
- key (string, optional): User-defined unique identifier for the ProductSelection.
- mode (enum, optional): Specifies in which way the Products are assigned to the ProductSelection. Values: "Individual" or "IndividualExclusion". Default: "Individual"
  - Individual: Each Product that should be part of the selection is added explicitly.
  - IndividualExclusion: Each Product that should NOT be part of the selection is excluded explicitly.
- custom (object, optional): Custom fields for the ProductSelection.

Use project settings to get the language code for the localized strings.
`;

export const updateProductSelectionPrompt = `
This tool will update a ProductSelection in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer, required): The current version of the ProductSelection.
- id (string, optional): The ID of the ProductSelection to update.
- key (string, optional): The key of the ProductSelection to update.
- actions (array, required): An array of update actions to perform on the ProductSelection. Each action should have an "action" field indicating the action type.

Note: Either id or key must be provided.

Example actions from commercetools API include:
- addProduct: Add a Product to the ProductSelection
- removeProduct: Remove a Product from the ProductSelection
- setKey: Set a new key for the ProductSelection
- changeName: Change the name of the ProductSelection
- setCustomType: Set a custom type for the ProductSelection
- setCustomField: Set a custom field for the ProductSelection
- setVariantSelection: Set variant selection for a product (when mode is Individual)
- setVariantExclusion: Set variant exclusion for a product (when mode is IndividualExclusion)

Each action type requires specific fields according to the commercetools API.
`;

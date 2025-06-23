export const readDiscountCodePrompt = `
This tool will fetch a Discount Code from commercetools or a list of Discount Codes from commercetools.

It takes these parameters:
- id (string, optional): The ID of the discount code to retrieve. Either id or key must be provided.
- key (string, optional): The key of the discount code to retrieve. Either id or key must be provided.
- limit (int, optional): The number of discount codes to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- where (string array, optional): Query predicates specified as strings. Example: ["code = \\"SAVE10\\""]
- expand (string array, optional): An array of field paths to expand. Example: ["cartDiscounts[*]", "references[*]"]
`;

export const createDiscountCodePrompt = `
This tool will create a new Discount Code in commercetools.

It takes these required arguments:
- code (string): The string value of the discount code.
- name (localized-string): The name of the discount code.
- cartDiscounts (array): References to cart discounts that can be applied when using the discount code. Limited to 10 cart discounts.

It takes these optional arguments:
- description (localized-string, optional): Description of the discount code.
- key (string, optional): User-defined unique identifier of the discount code. Must be between 2-256 characters with only alphanumeric, underscore, and hyphen characters.
- cartPredicate (string, optional): Discount code can only be applied to carts that match this predicate.
- isActive (boolean, optional): Indicates if the discount code is active and can be applied to the cart. Default: true.
- maxApplications (int, optional): Number of times the discount code can be applied.
- maxApplicationsPerCustomer (int, optional): Number of times the discount code can be applied per customer.
- groups (string array, optional): Groups to which the discount code belongs.
- validFrom (string, optional): Date and time (UTC) from which the discount code is effective.
- validUntil (string, optional): Date and time (UTC) until which the discount code is effective.
- custom (object, optional): Custom fields for the discount code.

Use project settings to get the language code for localized strings.
`;

export const updateDiscountCodePrompt = `
This tool will update a Discount Code in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the discount code.
- actions (array): An array of update actions to perform on the discount code. Each action should have an "action" field indicating the action type.

And one of these:
- id (string, optional): The ID of the discount code to update. Either id or key must be provided.
- key (string, optional): The key of the discount code to update. Either id or key must be provided.

Example actions from commercetools API include:
- changeIsActive: Change the active status of the discount code.
- setDescription: Set the description of the discount code.
- setCartDiscounts: Set the cart discounts that can be applied with this code.
- setCartPredicate: Set the cart predicate that must be matched for the discount code to be applied.
- setMaxApplications: Set the maximum number of applications for this discount code.
- setMaxApplicationsPerCustomer: Set the maximum number of applications per customer.
- setName: Set the name of the discount code.
- setValidFrom: Set the valid from date of the discount code.
- setValidUntil: Set the valid until date of the discount code.
- setValidFromAndUntil: Set both valid from and valid until dates.
- changeGroups: Change the groups the discount code belongs to.
- setCustomType: Set the custom type of the discount code.
- setCustomField: Set a custom field on the discount code.

Each action type requires specific fields according to the commercetools API.
`;

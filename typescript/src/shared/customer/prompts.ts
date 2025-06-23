export const createCustomerPrompt = `
This tool will create a new Customer in commercetools or a specific store in commercetools.

It takes these required arguments:
- email (string): Customer email address.
- password (string): Customer password.
- storeKey (string, optional): The key of the store to create the customer in.

It takes these optional arguments:
- firstName (string, optional): Customer first name.
- lastName (string, optional): Customer last name.
- middleName (string, optional): Customer middle name.
- title (string, optional): Customer title (e.g., Mr., Mrs., Dr.).
- dateOfBirth (string, optional): Customer date of birth in ISO 8601 format (YYYY-MM-DD).
- companyName (string, optional): Customer company name.
- vatId (string, optional): Customer VAT identification number.
- addresses (array, optional): An array of customer addresses.
- defaultShippingAddress (integer, optional): Index of default shipping address in the addresses array.
- defaultBillingAddress (integer, optional): Index of default billing address in the addresses array.
- shippingAddresses (array of integers, optional): Indices of shipping addresses in the addresses array.
- billingAddresses (array of integers, optional): Indices of billing addresses in the addresses array.
- isEmailVerified (boolean, optional): Whether the customer email is verified.
- externalId (string, optional): Customer external ID.
- customerGroup (object, optional): Customer group reference.
- custom (object, optional): Custom fields.
- locale (string, optional): Customer locale.
- salutation (string, optional): Customer salutation.
- key (string, optional): Customer key.
`;

export const readCustomerPrompt = `
This tool will fetch a Customer by ID from commercetools or a specific store in commercetools or query customers from commercetools.

It takes these required arguments:
- id (string, optional): The ID of the customer to fetch.
- storeKey (string, optional): The key of the store to fetch the customer from.

It takes these optional arguments:
- where (array of strings, optional): Query predicates specified as strings. Example: ["email = \\"customer@example.com\\""]
- sort (array of strings, optional): Sort criteria for the results. Example: ["firstName asc", "createdAt desc"]
- limit (integer, optional): A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 10.
- offset (integer, optional): The number of items to skip before starting to collect the result set.
- expand (array of strings, optional): Fields to expand. Example: ["customerGroup"]
`;

export const updateCustomerPrompt = `
This tool will update a Customer in commercetools using update actions from the commercetools API.

It takes these required arguments:
- id (string): The ID of the customer to update.
- version (integer): The current version of the customer.
- actions (array): An array of update actions to perform on the customer. Each action should have an "action" field indicating the action type.

Example actions from commercetools API include:
- addAddress
- addBillingAddressId
- addShippingAddressId
- changeAddress
- changeEmail
- removeAddress
- removeBillingAddressId
- removeShippingAddressId
- setCompanyName
- setCustomField
- setCustomType
- setDateOfBirth
- setDefaultBillingAddress
- setDefaultShippingAddress
- setFirstName
- setLastName
- setLocale
- setMiddleName
- setSalutation
- setTitle
- setVatId

Each action type requires specific fields according to the commercetools API.
`;

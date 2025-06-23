export const readQuoteRequestPrompt = `
This tool will fetch information about a commercetools quote request.

It can be used in several ways:
1. To fetch a single quote request by its ID
2. To fetch a single quote request by its key
3. To fetch quote requests by customer ID
4. To query multiple quote requests based on criteria

It takes these parameters:
- id (string, optional): The ID of the quote request to fetch
- key (string, optional): The key of the quote request to fetch
- customerId (string, optional): The customer ID to fetch quote requests for
- where (string array, optional): Query predicates for filtering quote requests. Example: ["quoteRequestState=\\"Submitted\\""]
- limit (int, optional): The number of quote requests to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "cart"]
- storeKey (string, optional): Key of the store to read quote requests from

At least one of id, key, customerId, or where must be provided for specific queries, or no parameters for all quote requests.
`;

export const createQuoteRequestPrompt = `
This tool will create a new Quote Request in commercetools from an existing cart.

It takes these required arguments:
- cart (object): Reference to the cart to create the quote request from, containing id and typeId.
- cartVersion (integer): Version of the cart to create the quote request from.

It takes these optional arguments:
- comment (string, optional): Comment describing the quote request.
- custom (object, optional): Custom fields for the quote request.
- key (string, optional): User-defined unique identifier of the quote request.
- storeKey (string, optional): Key of the store to create the quote request in.

The quote request will be created from the specified cart and will include all the cart's line items, pricing, and customer information.
`;

export const updateQuoteRequestPrompt = `
This tool will update a Quote Request in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the quote request.
- actions (array): An array of update actions to perform on the quote request. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the quote request to update
- key (string, optional): The key of the quote request to update

It takes these optional arguments:
- storeKey (string, optional): Key of the store the quote request belongs to

Example actions from commercetools API include:
- changeQuoteRequestState: Change the state of the quote request (e.g., "Submitted", "UnderReview", "Accepted", "Declined", "Cancelled")
- setComment: Set or update the comment on the quote request
- setCustomField: Set a custom field on the quote request
- setCustomType: Set a custom type on the quote request
- setKey: Set the key of the quote request

Each action type requires specific fields according to the commercetools API.
`;

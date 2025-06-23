export const readQuotePrompt = `
This tool will fetch information about a commercetools quote.

It can be used in three ways:
1. To fetch a single quote by its ID
2. To fetch a single quote by its key
3. To query multiple quotes based on criteria

It takes these parameters:
- id (string, optional): The ID of the quote to fetch
- key (string, optional): The key of the quote to fetch
- where (string array, optional): Query predicates for filtering quotes. Example: ["customer(id=\\"1001\\")"]
- limit (int, optional): The number of quotes to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "quoteRequest"]
- storeKey (string, optional): Key of the store to read quotes from
- businessUnitKey (string, optional): Key of the business unit to read quotes from
- associateId (string, optional): ID of the associate acting on behalf of the business unit

At least one of id, key, or where must be provided.
`;

export const createQuotePrompt = `
This tool will create a new Quote in commercetools from a StagedQuote.

It takes these required arguments:
- stagedQuote (object): Reference to the StagedQuote containing id or key and typeId.
- stagedQuoteVersion (integer): The current version of the StagedQuote.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier for the Quote.
- stagedQuoteStateToSent (boolean, optional): If true, the stagedQuoteState of the referenced StagedQuote will be set to Sent. Default: false.
- state (object, optional): Reference to a State containing id or key and typeId.
- custom (object, optional): Custom fields for the quote containing type (reference to custom type) and fields (object with custom field values).
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "quoteRequest"]
- storeKey (string, optional): Key of the store to create the quote in
- businessUnitKey (string, optional): Key of the business unit to create the quote in
- associateId (string, optional): ID of the associate acting on behalf of the business unit

Quotes are created from StagedQuotes and represent formal pricing proposals from sellers to buyers.
`;

export const updateQuotePrompt = `
This tool will update a Quote in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the quote.
- actions (array): An array of update actions to perform on the quote. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the quote to update
- key (string, optional): The key of the quote to update

It takes these optional arguments:
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "quoteRequest"]
- storeKey (string, optional): Key of the store the quote belongs to
- businessUnitKey (string, optional): Key of the business unit the quote belongs to
- associateId (string, optional): ID of the associate acting on behalf of the business unit

Available update actions include:
- changeQuoteState: Change the state of the quote. Values: "Pending", "Declined", "DeclinedForRenegotiation", "RenegotiationAddressed", "Accepted", "Withdrawn"
- requestQuoteRenegotiation: Request renegotiation of the quote with optional buyer comment
- setCustomType: Set a custom type on the quote
- setCustomField: Set a custom field value on the quote
- transitionState: Transition the quote to a different state
- changeCustomer: Change the customer associated with the quote (business unit context only)

Each action type requires specific fields according to the commercetools API.
`;

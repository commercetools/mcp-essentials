export const readStagedQuotePrompt = `
Read a staged quote or query staged quotes in commercetools.

This function allows you to:
- Read a specific staged quote by ID
- Read a specific staged quote by key
- Query staged quotes with filters, sorting, and pagination

**Parameters:**
- \`id\`: (optional) ID of the staged quote to retrieve
- \`key\`: (optional) Key of the staged quote to retrieve  
- \`where\`: (optional) Array of query predicates for filtering
- \`sort\`: (optional) Array of sort expressions
- \`limit\`: (optional) Maximum number of results (1-500)
- \`offset\`: (optional) Number of results to skip
- \`expand\`: (optional) Array of fields to expand
- \`storeKey\`: (optional) Store key for store-scoped operations

**Examples:**
- Read by ID: \`{id: "staged-quote-id"}\`
- Read by key: \`{key: "my-staged-quote"}\`
- Query with filters: \`{where: ["stagedQuoteState=\\"InProgress\\""], limit: 20}\`
- Store-scoped query: \`{storeKey: "store-key", limit: 10}\`

**Access Control:**
- Store context: Can only access staged quotes within the specified store
- Admin context: Can access all staged quotes across all stores
`;

export const createStagedQuotePrompt = `
Create a new staged quote in commercetools from an existing quote request.

Staged quotes are used by sellers to prepare quotes for buyers based on quote requests.

**Required Parameters:**
- \`quoteRequest\`: Reference to the quote request (must include either \`id\` or \`key\`)
- \`quoteRequestVersion\`: Current version of the QuoteRequest

**Optional Parameters:**
- \`key\`: User-defined unique identifier for the StagedQuote (2-256 characters, alphanumeric with _ and -)
- \`quoteRequestStateToAccepted\`: If true, the quoteRequestState of the referenced QuoteRequest will be set to Accepted (default: false)
- \`state\`: State of the Staged Quote (reference to a State in a custom workflow)
- \`custom\`: Custom Fields to be added to the StagedQuote (merged with QuoteRequest custom fields)
- \`storeKey\`: Store key for store-scoped creation

**Examples:**
- Basic creation: \`{quoteRequest: {typeId: "quote-request", id: "quote-request-id"}, quoteRequestVersion: 1}\`
- With state acceptance: \`{quoteRequest: {typeId: "quote-request", key: "my-quote-request"}, quoteRequestVersion: 2, quoteRequestStateToAccepted: true}\`
- With custom key: \`{key: "my-staged-quote", quoteRequest: {typeId: "quote-request", id: "quote-request-id"}, quoteRequestVersion: 1}\`
- Store-scoped: \`{quoteRequest: {typeId: "quote-request", id: "quote-request-id"}, quoteRequestVersion: 1, storeKey: "store-key"}\`
- With custom state: \`{quoteRequest: {typeId: "quote-request", id: "quote-request-id"}, quoteRequestVersion: 1, state: {typeId: "state", key: "custom-state"}}\`

**Access Control:**
- Store context: Creates staged quotes within the specified store
- Admin context: Can create staged quotes in any store or globally
`;

export const updateStagedQuotePrompt = `
Update an existing staged quote in commercetools using update actions.

**Required Parameters:**
- Either \`id\` or \`key\`: Identifier of the staged quote to update
- \`version\`: Current version of the staged quote for optimistic locking
- \`actions\`: Array of update actions to apply

**Optional Parameters:**
- \`storeKey\`: Store key for store-scoped operations

**Common Update Actions:**
- \`changeStagedQuoteState\`: Change the state of the staged quote
- \`setSellerComment\`: Set or update the seller's comment
- \`setValidTo\`: Set the expiration date for the quote
- \`setCustomField\`: Set a custom field value
- \`setCustomType\`: Set or update the custom type

**Examples:**
- Change state: \`{id: "staged-quote-id", version: 1, actions: [{action: "changeStagedQuoteState", stagedQuoteState: "Sent"}]}\`
- Set comment: \`{key: "my-staged-quote", version: 2, actions: [{action: "setSellerComment", sellerComment: "Special discount applied"}]}\`
- Set expiration: \`{id: "staged-quote-id", version: 1, actions: [{action: "setValidTo", validTo: "2024-12-31T23:59:59.999Z"}]}\`

**Access Control:**
- Store context: Can only update staged quotes within the specified store
- Admin context: Can update any staged quote across all stores
`;

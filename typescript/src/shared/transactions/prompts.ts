export const readTransactionPrompt = `
Read transactions from the commercetools platform. You can:
- Get a single transaction by providing either its ID or key
- List multiple transactions with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific transaction to retrieve (optional)
- key: The key of a specific transaction to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc", "key asc"])
- where: Query predicates for filtering when listing (e.g., ["key=\\"transaction-key\\""])
- expand: Reference paths to expand (e.g., ["application", "cart", "order"])

Examples:
// Get by ID
transaction.read({
  id: "6d95b6c6-5ef0-4091-8478-b26077ca2b2f"
})

// Get by key
transaction.read({
  key: "transaction-key"
})

// List with filtering
transaction.read({
  limit: 10,
  where: ["key=\\"transaction-key\\""]
})
`;

export const createTransactionPrompt = `
Create a new transaction in the commercetools platform.

A Transaction represents a request to the Connector to initiate the payment and send payment information for a specific Cart to the payment service provider (PSP) or gift card management system.

Parameters:
- key: User-defined unique identifier for the transaction (optional, minLength: 2, maxLength: 256, pattern: ^[A-Za-z0-9_-]+$)
- application: Application for which the payment is executed (required)
  - id: ID of the application (optional if key is provided)
  - key: Key of the application (optional if id is provided)
  - typeId: Must be "application"
- cart: Cart for which the payment must be executed (required)
  - id: ID of the cart (optional if key is provided)
  - key: Key of the cart (optional if id is provided)
  - typeId: Must be "cart"
- transactionItems: Transaction Item associated with the Transaction (required, minItems: 1, maxItems: 1)
  - paymentIntegration: Resource Identifier of the Payment Integration to use to execute the payment (required)
    - id: ID of the payment integration (optional if key is provided)
    - key: Key of the payment integration (optional if id is provided)
    - typeId: Must be "payment-integration"
  - amount: Money value of the Transaction Item (required)
    - centAmount: Amount in cents (required)
    - currencyCode: Currency code (required)

Examples:
// Create a transaction
transaction.create({
  key: "transaction-key",
  application: {
    typeId: "application",
    id: "a84d4fe7-ae82-4c3f-8c6c-435e54204fdd"
  },
  cart: {
    typeId: "cart",
    id: "a0e60229-441c-44b0-952b-981a67cbd8c4"
  },
  transactionItems: [
    {
      paymentIntegration: {
        typeId: "payment-integration",
        id: "4c24762b-87df-4bd3-898a-bafed913a9ca"
      },
      amount: {
        centAmount: 1000,
        currencyCode: "EUR"
      }
    }
  ]
})
`;

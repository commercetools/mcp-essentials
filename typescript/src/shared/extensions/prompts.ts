export const readExtensionPrompt = `
Read extensions from the commercetools platform. You can:
- Get a single extension by providing either its ID or key
- List multiple extensions with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific extension to retrieve (optional)
- key: The key of a specific extension to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["key asc", "createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["key=\\"my-extension\\""])
- expand: Reference paths to expand (e.g., ["destination", "triggers"])

Examples:
// Get by ID
extension.read({
  id: "extension-123"
})
// Get by key
extension.read({
  key: "my-extension"
})
// List with limit and sort
extension.read({
  limit: 10,
  sort: ["createdAt desc"]
})
`;

export const createExtensionPrompt = `
Create a new API extension in the commercetools platform.

Parameters:
- key: User-defined unique identifier for the extension (string, optional, pattern: ^[A-Za-z0-9_-]+$)
- destination: The configuration for the extension, including its type, location and authentication (object, required)
  - HTTP destination:
    - type: "HTTP" (required)
    - url: URL of the HTTP endpoint (string, required)
    - authentication: Authentication configuration (object, optional)
      - AuthorizationHeader: type "AuthorizationHeader", headerValue (required)
      - AzureFunctions: type "AzureFunctions", key (optional)
  - AWS Lambda destination:
    - type: "AWSLambda" (required)
    - arn: ARN of the AWS Lambda function (string, required)
    - accessKey: AWS access key (string, required)
    - accessSecret: AWS access secret (string, required)
    - region: AWS region (string, required)
  - Google Cloud Function destination:
    - type: "GoogleCloudFunction" (required)
    - url: URL of the Google Cloud Function (string, required)
    - region: Google Cloud region (string, required)
- triggers: Describes what triggers the extension (array of objects, required)
  - resourceTypeId: Resource type that triggers the extension (required)
    - Allowed values: "cart", "order", "payment", "payment-method", "customer", "customer-group", "quote-request", "staged-quote", "quote", "business-unit", "shopping-list"
  - actions: Actions that trigger the extension (array, required)
    - Allowed values: "Create", "Update"
  - condition: Conditional predicate for triggering (string, optional)
- timeoutInMs: Maximum time in milliseconds for the extension to respond (number, optional, default: 2000, max: 10000)

Examples:
// Create an HTTP extension for cart validation
extension.create({
  key: "cart-validation",
  destination: {
    type: "HTTP",
    url: "https://api.example.com/cart-validation",
    authentication: {
      type: "AuthorizationHeader",
      headerValue: "Bearer token123"
    }
  },
  triggers: [
    {
      resourceTypeId: "cart",
      actions: ["Create", "Update"]
    }
  ],
  timeoutInMs: 2000
})
// Create an AWS Lambda extension
extension.create({
  key: "order-processing",
  destination: {
    type: "AWSLambda",
    arn: "arn:aws:lambda:us-east-1:123456789012:function:my-function",
    accessKey: "AKIAIOSFODNN7EXAMPLE",
    accessSecret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    region: "us-east-1"
  },
  triggers: [
    {
      resourceTypeId: "order",
      actions: ["Create"],
      condition: "totalPrice.centAmount > 1000"
    }
  ],
  timeoutInMs: 5000
})
// Create a Google Cloud Function extension
extension.create({
  key: "payment-processing",
  destination: {
    type: "GoogleCloudFunction",
    url: "https://us-central1-myproject.cloudfunctions.net/process-payment",
    region: "us-central1"
  },
  triggers: [
    {
      resourceTypeId: "payment",
      actions: ["Create", "Update"]
    }
  ]
})
`;

export const updateExtensionPrompt = `
Update an existing extension in the commercetools platform. You must provide either the 'id' or 'key' of the extension to update, along with its current 'version' and an array of 'actions' to apply.

Parameters:
- id: The ID of the extension to update (string, required if key is not provided)
- key: The key of the extension to update (string, required if id is not provided)
- version: The current version of the extension (number, required)
- actions: An array of update actions to apply to the extension (array of objects, required)
  - changeDestination: Change the destination configuration (object with destination field)
  - addTrigger: Add a new trigger (object with trigger field)
  - removeTrigger: Remove an existing trigger (object with trigger field)
  - changeTriggers: Change the triggers configuration (object with triggers array field)
  - setKey: Set or change the key of the extension (object with optional key field)
  - setTimeoutInMs: Set or change the timeout value (object with optional timeoutInMs field)

Examples:
// Change the destination by ID
extension.update({
  id: "extension-123",
  version: 1,
  actions: [
    {
      action: "changeDestination",
      destination: {
        type: "HTTP",
        url: "https://api.example.com/new-endpoint"
      }
    }
  ]
})
// Add a new trigger by key
extension.update({
  key: "my-extension",
  version: 2,
  actions: [
    {
      action: "addTrigger",
      trigger: {
        resourceTypeId: "order",
        actions: ["Create"]
      }
    }
  ]
})
// Set a new timeout value
extension.update({
  id: "extension-123",
  version: 3,
  actions: [
    {
      action: "setTimeoutInMs",
      timeoutInMs: 5000
    }
  ]
})
// Change multiple aspects at once
extension.update({
  key: "my-extension",
  version: 4,
  actions: [
    {
      action: "changeTriggers",
      triggers: [
        {
          resourceTypeId: "cart",
          actions: ["Create", "Update"]
        },
        {
          resourceTypeId: "order",
          actions: ["Create"]
        }
      ]
    },
    {
      action: "setTimeoutInMs",
      timeoutInMs: 3000
    }
  ]
})
`;

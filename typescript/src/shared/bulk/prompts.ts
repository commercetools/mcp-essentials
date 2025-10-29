export const CREATE_BULK_DESCRIPTION = `
Bulk create different types of entities in commercetools.

This function allows you to create multiple entities of different types in a single operation. All operations are executed in parallel using Promise.all.

The function accepts an array of items, where each item specifies:
- entityType: The type of entity to create (e.g., 'product', 'customer', etc.)
- data: The data for creating the entity, which should match the schema required by the corresponding create function

Supported entity types:
- product
- customer
- cart
- category
- channel
- discount-code
- cart-discount
- product-discount
- customer-group
- quote
- quote-request
- staged-quote
- standalone-price
- inventory
- store
- review

Parameters:
- items: An array of objects, each containing:
  - entityType: The type of entity to create
  - data: The data for creating the entity

Example request:
\`\`\`json
{
  "items": [
    {
      "entityType": "product",
      "data": {
        "productType": {
          "id": "product-type-id",
          "typeId": "product-type"
        },
        "name": {
          "en": "Sample Product 1"
        },
        "slug": {
          "en": "sample-product-1"
        }
      }
    },
    {
      "entityType": "customer",
      "data": {
        "email": "customer@example.com",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
\`\`\`

Example response:
\`\`\`json
{
  "success": true,
  "results": [
    {
      // Product creation result
    },
    {
      // Customer creation result
    }
  ]
}
\`\`\`

Errors:
- If any creation operation fails, the entire operation will fail
- The error message will indicate which entity type failed to be created
`;

export const CREATE_BULK_PROMPT = `
You are a specialized assistant for the commercetools platform, focusing on bulk entity creation.

# TASK
Create multiple entities in the commercetools platform in a single operation.

This tool accepts an array of items, where each item contains:
- "entityType": the type of entity (e.g., "product", "customer")
- "data": the creation parameters for that entity type

The supported entity types are:
- product
- customer
- cart
- category
- channel
- discount-code
- cart-discount
- product-discount
- customer-group
- quote
- quote-request
- staged-quote
- standalone-price
- inventory
- store
- review

# PARAMETERS
"items": [
  {
    "entityType": string,
    "data": object (matching the schema for the specified entity type)
  },
  ...
]

# RESPONSE FORMAT
The response will include:
- "success": boolean
- "results": array of responses from each creation operation

# EXAMPLE
Request:
\`\`\`json
{
  "items": [
    {
      "entityType": "product",
      "data": {
        "productType": {
          "id": "product-type-id",
          "typeId": "product-type"
        },
        "name": {
          "en": "Sample Product 1"
        },
        "slug": {
          "en": "sample-product-1"
        }
      }
    },
    {
      "entityType": "customer",
      "data": {
        "email": "customer@example.com",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "results": [
    {
      // Product creation result with details
    },
    {
      // Customer creation result with details
    }
  ]
}
\`\`\`

# OUTPUT
Focus on providing the essential parameters needed for each entity type and ensure that the entity types and their data are correctly structured.
`;

export const UPDATE_BULK_DESCRIPTION = `
Bulk update different types of entities in commercetools.

This function allows you to update multiple entities of different types in a single operation. All operations are executed in parallel using Promise.all.

The function accepts an array of items, where each item specifies:
- entityType: The type of entity to update (e.g., 'product', 'customer', etc.)
- data: The data for updating the entity, which should match the schema required by the corresponding update function

Supported entity types:
- product
- customer
- cart
- category
- channel
- discount-code
- cart-discount
- product-discount
- customer-group
- quote
- quote-request
- staged-quote
- standalone-price
- inventory
- order
- product-selection
- product-type
- store

Parameters:
- items: An array of objects, each containing:
  - entityType: The type of entity to update
  - data: The data for updating the entity

Example request:
\`\`\`json
{
  "items": [
    {
      "entityType": "product",
      "data": {
        "id": "product-id-1",
        "version": 1,
        "actions": [
          {
            "action": "changeName",
            "name": {
              "en": "Updated Product Name"
            }
          }
        ]
      }
    },
    {
      "entityType": "inventory",
      "data": {
        "id": "inventory-id-1",
        "version": 1,
        "actions": [
          {
            "action": "changeQuantity",
            "quantity": 50
          }
        ]
      }
    }
  ]
}
\`\`\`

Example response:
\`\`\`json
{
  "success": true,
  "results": [
    {
      // Product update result
    },
    {
      // Inventory update result
    }
  ]
}
\`\`\`

Errors:
- If any update operation fails, the entire operation will fail
- The error message will indicate which entity type failed to be updated
`;

export const UPDATE_BULK_PROMPT = `
You are a specialized assistant for the commercetools platform, focusing on bulk entity updates.

# TASK
Update multiple entities in the commercetools platform in a single operation.

This tool accepts an array of items, where each item contains:
- "entityType": the type of entity (e.g., "product", "inventory")
- "data": the update parameters for that entity type (including id/key, version, and actions)

The supported entity types are:
- product
- customer
- cart
- category
- discount-code
- cart-discount
- product-discount
- customer-group
- quote
- quote-request
- staged-quote
- standalone-price
- inventory
- order
- product-selection
- product-type
- review

# PARAMETERS
"items": [
  {
    "entityType": string,
    "data": object (matching the schema for the specified entity type update)
  },
  ...
]

# RESPONSE FORMAT
The response will include:
- "success": boolean
- "results": array of responses from each update operation

# EXAMPLE
Request:
\`\`\`json
{
  "items": [
    {
      "entityType": "product",
      "data": {
        "id": "product-id-1",
        "version": 1,
        "actions": [
          {
            "action": "changeName",
            "name": {
              "en": "Updated Product Name"
            }
          }
        ]
      }
    },
    {
      "entityType": "inventory",
      "data": {
        "id": "inventory-id-1",
        "version": 1,
        "actions": [
          {
            "action": "changeQuantity",
            "quantity": 50
          }
        ]
      }
    }
  ]
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "results": [
    {
      // Product update result with details
    },
    {
      // Inventory update result with details
    }
  ]
}
\`\`\`

# OUTPUT
Focus on providing the essential parameters needed for each entity type update and ensure that the entity types and their data are correctly structured.
`;

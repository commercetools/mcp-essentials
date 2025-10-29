export const readTypePrompt = `
Read types from the commercetools platform. You can:
- Get a single type by providing either its ID or key
- List multiple types with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific type to retrieve (optional)
- key: The key of a specific type to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["key=\\"my-type\\""])
- expand: Reference paths to expand (e.g., ["fieldDefinitions[*].type"])

Examples:
// Get by ID
types.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
types.read({
  key: "my-type-key"
})

// List with filtering
types.read({
  limit: 10,
  where: ["resourceTypeIds contains \\"product\\""]
})
`;

export const createTypePrompt = `
Create a new type in the commercetools platform.

Parameters:
- key: User-defined unique identifier (required)
- name: Name of the type (required)
- description: Description of the type (optional)
- resourceTypeIds: Array of resource types that can be customized with this type (required, e.g., ["category", "product"])
- fieldDefinitions: Array of field definitions for the type (optional)

Field Definition structure:
- name: Name of the field definition
- label: Localized label (object with language codes as keys)
- required: Whether the field is required (optional)
- inputHint: Input hint for String fields (optional: "SingleLine" or "MultiLine")
- type: Type of the field (Boolean, String, LocalizedString, Enum, LocalizedEnum, Number, Money, Date, Time, DateTime, Reference, Set)

Example:
types.create({
  key: "my-type-key",
  name: "My Custom Type",
  description: "Type for custom fields",
  resourceTypeIds: ["product", "category"],
  fieldDefinitions: [
    {
      name: "customField",
      label: {
        "en": "Custom Field",
        "de": "Benutzerdefiniertes Feld"
      },
      required: false,
      type: {
        name: "String"
      }
    }
  ]
})
`;

export const updateTypePrompt = `
Update a type in the commercetools platform. You must identify the type using either ID or key.

Parameters:
- id: The ID of the type to update/delete (optional if key is provided)
- key: The key of the type to update/delete (optional if id is provided)
- version: Expected version of the type (required)
- actions: Array of update actions (required)

Available update actions:
- changeKey: Change the key of the type
- changeName: Change the name of the type
- setDescription: Set or remove the description
- addFieldDefinition: Add a new field definition
- removeFieldDefinition: Remove a field definition
- changeLabel: Change the label of a field definition
- changeFieldDefinitionOrder: Change the order of field definitions
- setInputHint: Set the input hint for a String field

Examples:
// Update by ID
types.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "changeName",
      name: "Updated Type Name"
    }
  ]
})

// Update by key
types.update({
  key: "my-type-key",
  version: 1,
  actions: [
    {
      action: "addFieldDefinition",
      fieldDefinition: {
        name: "newField",
        label: {
          "en": "New Field"
        },
        type: {
          name: "String"
        }
      }
    }
  ]
})
`;

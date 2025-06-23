export const readProductTypePrompt = `
This tool will fetch a single Product Type from commercetools by its ID or a list of Product Types by optional parameters.


It takes these optional arguments:
- id (string, optional): The ID of the product type to retrieve.
- limit (int, optional): The number of product types to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name asc", "createdAt desc"]
- where (string array, optional): Query predicates specified as strings. Example: ["name = \\"Standard product type\\""]
- expand (string array, optional): An array of field paths to expand. Example: ["attributes[*].type"]`;

export const createProductTypePrompt = `
This tool will create a new Product Type in commercetools.

It takes these required arguments:
- key (string): The unique key of the product type.
- name (string): The name of the product type.
- description (string): The description of the product type.

It takes these optional arguments:
- attributes (array, optional): An array of attribute definitions for the product type. Each attribute should have:
  - name (string): The name of the attribute.
  - label (localized-string): The localized label for the attribute.
  - isRequired (boolean, optional): Whether the attribute is required.
  - isSearchable (boolean, optional): Whether the attribute is searchable.
  - type (object): The type definition of the attribute with a name field (e.g., text, number, boolean, enum).
  - attributeConstraint (enum, optional): The constraint of the attribute (None, Unique, CombinationUnique, SameForAll).
  - inputTip (localized-string, optional): The input tip for the attribute.
  - inputHint (enum, optional): The input hint for the attribute (SingleLine, MultiLine).

Example attribute types include:
- Text: { "name": "text" }
- Number: { "name": "number" }
- Boolean: { "name": "boolean" }
- Enum: { "name": "enum", "values": [{"key": "value1", "label": "Value 1"}] }
- LocalizedEnum: { "name": "lenum", "values": [{"key": "value1", "label": {"en": "Value 1"}}] }
- LocalizedText: { "name": "ltext" }
- Reference: { "name": "reference", "referenceTypeId": "product" }
`;

export const updateProductTypePrompt = `
This tool will update a Product Type in commercetools using update actions from the commercetools API.

It takes these required arguments:
- id (string): The ID of the product type to update.
- version (integer): The current version of the product type.
- actions (array): An array of update actions to perform on the product type. Each action should have an "action" field indicating the action type.

Example actions from commercetools API include:
- addAttributeDefinition
- removeAttributeDefinition
- changeAttributeDefinition
- changeName
- changeDescription
- changeAttributeOrder
- changeAttributeOrderByName
- changeEnumValueOrder
- changeLocalizedEnumValueOrder
- changeEnumValueLabel
- changeLocalizedEnumValueLabel
- addPlainEnumValue
- addLocalizedEnumValue
- removePlainEnumValue
- removeLocalizedEnumValue
- changeIsSearchable
- changeInputHint
- setKey
- setInputTip
- removeAttributeDefinition

Each action type requires specific fields according to the commercetools API.
`;

export const READ_CUSTOMER_GROUP_PROMPT = `
This tool will fetch CustomerGroups from commercetools.

It can be used in three ways:
1. To fetch a single category by its ID
2. To fetch a single category by its key
3. To query multiple categories based on criteria

It takes these parameters:
- id (string, optional): The ID of the customer group to fetch
- key (string, optional): The key of the customer group to fetch
- where (string array, optional): Query predicates for filtering customer groups. Example: ["name=\\"Webshop user\\""]
- limit (int, optional): The number of customer groups to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["name asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["custom.type"]

If both id and key are not provided, it will fetch a list of customer groups using query parameters.
`;

export const CREATE_CUSTOMER_GROUP_PROMPT = `
This tool will create a new Customer Group in commercetools.

It takes these required arguments:
- groupName (string): Unique name of the customer group in the project.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier for the Customer Group. Pattern: ^[A-Za-z0-9_-]+$, Min length: 2, Max length: 256
- custom (object, optional): Custom fields for the Customer Group.

Example custom object format:
{
  "type": {
    "id": "type-id",
    "typeId": "type"
  },
  "fields": {
    "exampleStringField": "value"
  }
}

Use project settings to get the available language codes for localized fields.
`;

export const UPDATE_CUSTOMER_GROUP_PROMPT = `
This tool will update a Customer Group in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the customer group
- actions (array): An array of update actions to perform on the customer group

It also requires ONE of these identifiers:
- id (string, optional): The ID of the customer group to update
- key (string, optional): The key of the customer group to update

Example actions from commercetools API include:
- changeName: Update the name of the customer group
- setKey: Set or remove the key of the customer group
- setCustomType: Set a custom type for the customer group
- setCustomField: Set a custom field for the customer group

Each action type requires specific fields according to the commercetools API.

Example update format:
{
  "id": "customer-group-id",
  "version": 1,
  "actions": [
    {
      "action": "changeName",
      "name": "New Name"
    }
  ]
}
`;

// Export all prompts for ease of use
export const PROMPTS = {
  READ_CUSTOMER_GROUP_PROMPT,
  CREATE_CUSTOMER_GROUP_PROMPT,
  UPDATE_CUSTOMER_GROUP_PROMPT,
};

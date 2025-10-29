export const readCustomObjectPrompt = `
Read custom objects from the commercetools platform. You can:
- Get a single custom object by providing its container and key
- List multiple custom objects in a container with optional filtering, sorting, and pagination

Parameters:
- container: Container of the custom object to retrieve (required)
- key: Key of the custom object to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc", "key asc"])
- where: Query predicates for filtering when listing (e.g., ["container=\\"myContainer\\""])
- expand: Reference paths to expand (e.g., ["value.order"])

Examples:
// Get by container and key
customObjects.read({
  container: "myContainer",
  key: "myKey"
})

// List all custom objects in a container
customObjects.read({
  container: "myContainer",
  limit: 10
})

// List with filtering
customObjects.read({
  container: "myContainer",
  where: ["key=\\"specific-key\\""]
})
`;

export const createCustomObjectPrompt = `
Create a new custom object in the commercetools platform.

Parameters:
- container: Namespace to group custom objects (required)
- key: User-defined unique identifier within the container (required)
- value: Can be any JSON standard type, such as number, string, boolean, array, object, or a common API data type (required)

Example:
customObjects.create({
  container: "myContainer",
  key: "myKey",
  value: {
    "text": {
      "de": "Das ist ein Text",
      "en": "This is a text"
    },
    "order": {
      "typeId": "order",
      "id": "<order-id>"
    }
  }
})
`;

export const updateCustomObjectPrompt = `
Update a custom object in the commercetools platform. You must identify the object using container and key.

Parameters:
- container: Container of the custom object to update (required)
- key: Key of the custom object to update (required)
- version: Expected version of the custom object (required)
- actions: Array of update actions (required)

Available update actions:
- setValue: Set a new value for the custom object

Examples:
// Update by container and key
customObjects.update({
  container: "myContainer",
  key: "myKey",
  version: 1,
  actions: [
    {
      action: "setValue",
      value: {
        "updatedText": "New value",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    }
  ]
})
`;

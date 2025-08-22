export const listAvailableToolsPrompt = `
This tool will list all available tools for a given resource type.

It takes these parameters:
- resourceType (enum): The type of resource to list available tools for
  - businessUnit
  - cart
  - cartDiscount
  - category
  - channel
  - customer
  - customerGroup
  - discountCode
  - order
  - inventory
  - product
  - project
  - productSearch
  - productSelection
  - quote
  - quoteRequest
  - stagedQuote
  - standalonePrice
  - productDiscount
  - productType
  - store

- isBulk (boolean, optional): Whether or not the user wants to use bulk operations

The output will be a list of tools that are available for the given resource type.
`;

export const injectToolsPrompt = `
This tool will inject a list of tools into the context.

It takes these required arguments:
- tools (array): The list of tools to inject.

The output will be a list of tools that were injected.
`;

export const executeToolPrompt = `
This tool will execute a tool by providing the tool method name and arguments.

It takes these required arguments:
- toolMethod (string): The name of the tool to execute
- arguments (object): The arguments to pass to the tool method

The output will be the result of the tool execution.
`;

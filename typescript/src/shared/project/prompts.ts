export const readProjectPrompt = `
This tool will fetch information about a commercetools project.

It takes these optional arguments:
- projectKey (string, optional): The key of the project to read. If not provided, the current project will be used.

The response will contain detailed information about the project including countries, currencies, languages, and more.
`;

export const updateProjectPrompt = `
This tool will update settings for a commercetools project. This is an admin-only operation.

It takes these arguments:
- version (number, optional): The current version of the project. If not provided, the current version will be fetched automatically.
- actions (array, required): The list of update actions to apply to the project.
- projectKey (string, optional): The key of the project to update. If not provided, the current project will be used.

Available update actions include:
- changeName: Update the project name
- changeCountries: Update the list of countries
- changeCurrencies: Update the list of currencies
- changeLanguages: Update the list of languages
- changeMessagesConfiguration: Update the Messages Query feature configuration
- changeCartsConfiguration: Update the Carts feature configuration
- changeCountryTaxRateFallbackEnabled: Change the country tax rate fallback setting
- changeShoppingListsConfiguration: Update the Shopping Lists feature configuration
- setShippingRateInputType: Set the shipping rate input type
- setExternalOAuth: Configure an external OAuth provider
- changeProductSearchIndexingEnabled: Enable/disable product search indexing
- changeOrderSearchStatus: Change the Order Search status
- changeCustomerSearchStatus: Change the Customer Search status
- changeBusinessUnitSearchStatus: Change the Business Unit Search status
- and more

The response will contain the updated project information.
`;

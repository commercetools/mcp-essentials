export const readChannelPrompt = `
This tool will fetch information about commercetools channels.

It can be used in three ways:
1. To fetch a single channel by its ID
2. To fetch a single channel by its key
3. To query multiple channels based on criteria

It takes these parameters:
- id (string, optional): The ID of the channel to fetch
- key (string, optional): The key of the channel to fetch
- where (string array, optional): Query predicates for filtering channels. Example: ["roles contains any \\"InventorySupply\\",\\"ProductDistribution\\""]
- limit (int, optional): The number of channels to return (default: 20, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["custom.type"]

If both id and key are not provided, it will fetch a list of channels using query parameters.
`;

export const createChannelPrompt = `
This tool will create a new Channel in commercetools.

It takes these required arguments:
- key (string): User-defined unique identifier for the Channel
- roles (array): Roles of the Channel. Each channel must have at least one role.
  Available roles: "InventorySupply", "ProductDistribution", "OrderExport", "OrderImport", "Primary"

It takes these optional arguments:
- name (object, optional): Localized name of the Channel (record mapping locale to string)
- description (object, optional): Localized description of the Channel (record mapping locale to string)
- address (object, optional): Address where the Channel is located
- geoLocation (object, optional): GeoJSON Point encoding the geo location of the Channel
- custom (object, optional): Custom fields for the Channel

Example name and description format:
{
  "en": "Main Warehouse",
  "de": "Hauptlager"
}

Example geoLocation format:
{
  "type": "Point",
  "coordinates": [13.377704, 52.516275]
}
`;

export const updateChannelPrompt = `
This tool will update a Channel in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the channel
- actions (array): An array of update actions to perform on the channel. Each action should have an "action" field indicating the action type

It also requires ONE of these identifiers:
- id (string, optional): The ID of the channel to update
- key (string, optional): The key of the channel to update

Example actions from commercetools API include:
- changeKey: Change the key of the channel
- changeName: Change the localized name of the channel
- changeDescription: Change the localized description of the channel
- setRoles: Set the roles of the channel
- addRoles: Add roles to the channel
- removeRoles: Remove roles from the channel
- setAddress: Set the address of the channel
- setGeoLocation: Set the geo location of the channel
- setCustomType: Set the custom type for the channel
- setCustomField: Set a custom field for the channel

Each action type requires specific fields according to the commercetools API.
`;

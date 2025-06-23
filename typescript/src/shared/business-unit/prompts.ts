export const readBusinessUnitPrompt = `
This tool will fetch information about a commercetools business unit.

It can be used in three ways:
1. To fetch a single business unit by its ID
2. To fetch a single business unit by its key
3. To query multiple business units based on criteria

It takes these parameters:
- id (string, optional): The ID of the business unit to fetch
- key (string, optional): The key of the business unit to fetch
- where (string array, optional): Query predicates for filtering business units. Example: ["status=\\"Active\\""]
- limit (int, optional): The number of business units to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["associates[*].customer"]
- storeKey (string, optional): Key of the store to read business units from

At least one of id, key, or where must be provided, or the tool will return all business units.
`;

export const createBusinessUnitPrompt = `
This tool will create a new Business Unit in commercetools.

It takes these required arguments:
- key (string): User-defined unique and immutable identifier of the Business Unit (2-256 characters, alphanumeric, underscore, and hyphen only).
- name (string): Name of the Business Unit.
- unitType (enum): Type of the Business Unit. Values: "Company", "Division".

It takes these optional arguments:
- contactEmail (string, optional): Email address of the Business Unit.
- status (enum, optional): Status of the Business Unit. Values: "Active", "Inactive". Defaults to "Active".
- stores (array, optional): References to Stores the Business Unit is associated with.
- storeMode (enum, optional): Mode that defines how Stores are inherited. Values: "Explicit", "FromParent".
- parentUnit (object, optional): Parent Business Unit of the Business Unit.
- addresses (array, optional): Addresses of the Business Unit.
- shippingAddressIds (array, optional): IDs of addresses suitable for shipping.
- defaultShippingAddressId (string, optional): ID of the address suitable for shipping.
- billingAddressIds (array, optional): IDs of addresses suitable for billing.
- defaultBillingAddressId (string, optional): ID of the address suitable for billing.
- associates (array, optional): Associates of the Business Unit.
- associateMode (enum, optional): Mode that defines how Associates are inherited. Values: "Explicit", "ExplicitAndFromParent".
- approvalRuleMode (enum, optional): Mode that defines how Approval Rules are inherited. Values: "Explicit", "ExplicitAndFromParent".
- custom (object, optional): Custom fields for the Business Unit.
- storeKey (string, optional): Key of the store to create the business unit in.

Business Units can be organized hierarchically up to a maximum of 5 levels, with the top level being a Business Unit of type Company.
`;

export const updateBusinessUnitPrompt = `
This tool will update a Business Unit in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the business unit.
- actions (array): An array of update actions to perform on the business unit. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the business unit to update
- key (string, optional): The key of the business unit to update

It takes these optional arguments:
- storeKey (string, optional): Key of the store the business unit belongs to

Example actions from commercetools API include:
- addAddress: Add an address to the business unit
- addAssociate: Add an associate to the business unit
- addBillingAddressId: Add a billing address ID
- addShippingAddressId: Add a shipping address ID
- addStore: Add a store to the business unit
- changeAddress: Change an address of the business unit
- changeAssociate: Change an associate of the business unit
- changeName: Change the name of the business unit
- changeParentUnit: Change the parent unit of the business unit
- changeStatus: Change the status of the business unit
- removeAddress: Remove an address from the business unit
- removeAssociate: Remove an associate from the business unit
- removeBillingAddressId: Remove a billing address ID
- removeShippingAddressId: Remove a shipping address ID
- removeStore: Remove a store from the business unit
- setAddressCustomField: Set a custom field on an address
- setAddressCustomType: Set a custom type on an address
- setAssociateMode: Set the associate mode of the business unit
- setContactEmail: Set the contact email of the business unit
- setCustomField: Set a custom field on the business unit
- setCustomType: Set a custom type on the business unit
- setDefaultBillingAddress: Set the default billing address
- setDefaultShippingAddress: Set the default shipping address
- setStoreMode: Set the store mode of the business unit
- setStores: Set the stores of the business unit

Each action type requires specific fields according to the commercetools API.
`;

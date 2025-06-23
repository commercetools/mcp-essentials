export const readCartPrompt = `
This tool will fetch information about a commercetools cart.

It can be used in three ways:
1. To fetch a single cart by its ID
2. To fetch a single cart by its key
3. To fetch a single cart by customer ID
4. To query multiple carts based on criteria

It takes these parameters:
- id (string, optional): The ID of the cart to fetch
- key (string, optional): The key of the cart to fetch
- customerId (string, optional): The customer ID to fetch the cart for
- where (string array, optional): Query predicates for filtering carts. Example: ["customerId=\\"1001\\""]
- limit (int, optional): The number of carts to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "lineItems[*].variant"]
- storeKey (string, optional): Key of the store to read carts from

At least one of id, key, customerId, or where must be provided.
`;

export const createCartPrompt = `
This tool will create a new Cart in commercetools.

It takes these required arguments:
- currency (string): The currency code for the cart.

It takes these optional arguments:
- customerEmail (string, optional): Email address of the Customer.
- customerId (string, optional): ID of the customer that the Cart belongs to.
- customerGroup (object, optional): Reference to a Customer Group.
- anonymousId (string, optional): Anonymous session ID.
- country (string, optional): Country for the cart.
- inventoryMode (enum, optional): The inventory mode of the cart. Values: "None", "TrackOnly", "ReserveOnOrder".
- taxMode (enum, optional): The tax mode of the cart. Values: "Platform", "External", "ExternalAmount", "Disabled".
- taxRoundingMode (enum, optional): The tax rounding mode of the cart. Values: "HalfEven", "HalfUp", "HalfDown".
- taxCalculationMode (enum, optional): The tax calculation mode of the cart. Values: "LineItemLevel", "UnitPriceLevel".
- store (object, optional): Reference to a Store.
- billingAddress (object, optional): Billing address for the cart.
- shippingAddress (object, optional): Shipping address for the cart.
- shippingMethod (object, optional): Reference to a Shipping Method.
- shippingMode (enum, optional): The shipping mode of the cart. Values: "Single", "Multiple".
- lineItems (array, optional): Line items to be added to the cart.
- customLineItems (array, optional): Custom line items to be added to the cart.
- discountCodes (array, optional): Array of discount codes to apply to the cart.
- key (string, optional): User-defined unique identifier of the Cart.
- locale (string, optional): Locale for the cart.
- origin (enum, optional): Origin of the cart. Values: "Customer", "Merchant".
- custom (object, optional): Custom fields for the cart.

Only one of customerId or anonymousId should be provided.
`;

export const replicateCartPrompt = `
This tool will replicate an existing Cart in commercetools to create a new one.

It takes these required arguments:
- reference (object): Reference to the cart to replicate containing id and typeId.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier for the new Cart.
- storeKey (string, optional): Key of the store to create the cart in.

The replicated cart will be a copy of the referenced cart with a new ID.
`;

export const updateCartPrompt = `
This tool will update a Cart in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the cart.
- actions (array): An array of update actions to perform on the cart. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the cart to update
- key (string, optional): The key of the cart to update

It takes these optional arguments:
- storeKey (string, optional): Key of the store the cart belongs to

Example actions from commercetools API include:
- addCustomLineItem: Add a custom line item to the cart
- addDiscountCode: Add a discount code to the cart
- addLineItem: Add a line item to the cart
- addPayment: Add a payment to the cart
- addShoppingList: Add all line items from a shopping list to the cart
- applyDeltaToCustomLineItemShippingDetailsTargets: Apply delta to custom line item shipping details targets
- applyDeltaToLineItemShippingDetailsTargets: Apply delta to line item shipping details targets
- changeCustomLineItemMoney: Change the money of a custom line item
- changeCustomLineItemQuantity: Change the quantity of a custom line item
- changeLineItemQuantity: Change the quantity of a line item
- changeTaxCalculationMode: Change the tax calculation mode of the cart
- changeTaxMode: Change the tax mode of the cart
- changeTaxRoundingMode: Change the tax rounding mode of the cart
- recalculate: Force recalculation of the cart
- removeCustomLineItem: Remove a custom line item from the cart
- removeDiscountCode: Remove a discount code from the cart
- removeLineItem: Remove a line item from the cart
- removePayment: Remove a payment from the cart
- setAnonymousId: Set the anonymous ID of the cart
- setBillingAddress: Set the billing address of the cart
- setCartTotalTax: Set the total tax amount of the cart
- setCountry: Set the country of the cart
- setCustomField: Set a custom field on the cart
- setCustomLineItemCustomField: Set a custom field on a custom line item
- setCustomLineItemCustomType: Set a custom type on a custom line item
- setCustomLineItemShippingDetails: Set shipping details on a custom line item
- setCustomLineItemTaxAmount: Set tax amount on a custom line item
- setCustomLineItemTaxRate: Set tax rate on a custom line item
- setCustomShippingMethod: Set a custom shipping method on the cart
- setCustomType: Set a custom type on the cart
- setCustomerEmail: Set the customer email on the cart
- setCustomerId: Set the customer ID on the cart
- setCustomerGroup: Set the customer group on the cart
- setDeleteDaysAfterLastModification: Set the number of days after which the cart will be deleted
- setDirectDiscounts: Set direct discounts on the cart
- setKey: Set the key of the cart
- setLineItemCustomField: Set a custom field on a line item
- setLineItemCustomType: Set a custom type on a line item
- setLineItemDistributionChannel: Set the distribution channel of a line item
- setLineItemPrice: Set the price of a line item
- setLineItemShippingDetails: Set shipping details on a line item
- setLineItemSupplyChannel: Set the supply channel of a line item
- setLineItemTaxAmount: Set tax amount on a line item
- setLineItemTaxRate: Set tax rate on a line item
- setLineItemTotalPrice: Set the total price of a line item
- setLocale: Set the locale of the cart
- setShippingAddress: Set the shipping address of the cart
- setShippingMethod: Set the shipping method of the cart
- setShippingMethodTaxAmount: Set tax amount on the shipping method
- setShippingMethodTaxRate: Set tax rate on the shipping method
- setShippingRateInput: Set the shipping rate input of the cart

Each action type requires specific fields according to the commercetools API.
`;

export const readOrderPrompt = `
This tool will fetch information about a commercetools order.

It can be used in three ways:
1. To fetch a single order by its ID
2. To fetch a single order by its order number
3. To query multiple orders based on criteria

It takes these parameters:
- id (string, optional): The ID of the order to fetch
- orderNumber (string, optional): The order number of the order to fetch
- where (string array, optional): Query predicates for filtering orders. Example: ["orderNumber=\\"1001\\""]
- limit (int, optional): The number of orders to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["customer", "lineItems[*].variant"]
- storeKey (string, optional): Key of the store to read orders from

Either id, orderNumber, or where must be provided.
`;

export const createOrderPrompt = `
This tool will create a new Order from a Cart or a Quote in commercetools or Import an Order.

1. Create an Order from a Cart
It takes these required arguments:
- version (integer): The current version of the cart.

It takes these optional arguments:
- id (string, optional): The ID of the cart to create the order from.
- orderNumber (string, optional): User-defined identifier of the Order.
- storeKey (string, optional): Key of the store to create the order in.

The cart ID is required unless provided through context.

2. Create an Order from a Quote
It takes these required arguments:
- quoteId (string): The ID of the quote to create the order from.
- version (integer): The current version of the quote.

It takes these optional arguments:
- orderNumber (string, optional): User-defined identifier of the Order.
- storeKey (string, optional): Key of the store to create the order in.

3. Create an Order by Import
It takes these required arguments:
- totalPrice (object): Total price of the order with currencyCode and centAmount.

It takes these optional arguments:
- orderNumber (string, optional): User-defined identifier of the Order.
- customerId (string, optional): ID of the customer that the Order belongs to.
- customerEmail (string, optional): Email address of the Customer.
- store (object, optional): Reference to a Store the Order belongs to.
- lineItems (array, optional): Line items in the order.

Either customerId or customerEmail must be provided.
`;

export const updateOrderPrompt = `
This tool will update an Order in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the order.
- actions (array): An array of update actions to perform on the order. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the order to update
- orderNumber (string, optional): The order number of the order to update

It takes these optional arguments:
- storeKey (string, optional): Key of the store the order belongs to

Example actions from commercetools API include:
- addDelivery: Add a new delivery to the order
- addParcelToDelivery: Add a parcel to a delivery
- addPayment: Add a payment to the order
- addReturnInfo: Add return information to the order
- changeOrderState: Change the state of the order
- changePaymentState: Change the payment state of the order
- changeShipmentState: Change the shipment state of the order
- importLineItemState: Import line item state
- removeDelivery: Remove a delivery from the order
- removeParcelFromDelivery: Remove a parcel from a delivery
- removePayment: Remove a payment from the order
- setCustomerEmail: Set the customer email of the order
- setCustomField: Set a custom field for the order
- setCustomType: Set a custom type for the order
- setDeliveryAddress: Set the address for a delivery
- setOrderNumber: Set the order number
- setParcelItems: Set the items of a parcel
- setParcelMeasurements: Set the measurements of a parcel
- setParcelTrackingData: Set the tracking data of a parcel
- setReturnPaymentState: Set the payment state of a return
- setReturnShipmentState: Set the shipment state of a return
- transitionLineItemState: Transition the state of a line item
- transitionState: Transition the state of the order
- updateSyncInfo: Update the sync info of the order

Each action type requires specific fields according to the commercetools API.
`;

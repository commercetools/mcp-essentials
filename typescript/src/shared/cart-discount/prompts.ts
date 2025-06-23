export const readCartDiscountPrompt = `
This tool will fetch Cart Discounts from commercetools.

It takes these optional arguments:
- id (string, optional): The ID of the cart discount to fetch.
- key (string, optional): The key of the cart discount to fetch.
- where (string array, optional): Query predicates specified as strings for filtering cart discounts. Example: ["name(en = \\"Black Friday Sale\\")"]
- limit (int, optional): The number of cart discounts to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["references[*]"]
- storeKey (string, optional): Key of the store to read the cart discount from.

If both id and key are omitted, this tool will return a list of cart discounts based on the other query parameters.
If either id or key is provided, this tool will return a single cart discount.
`;

export const createCartDiscountPrompt = `
This tool will create a new Cart Discount in commercetools.

It takes these required arguments:
- name (localized-string): The name of the cart discount. Example: { "en": "Summer Sale", "de": "Sommer Verkauf" }
- cartPredicate (string): Valid Cart predicate to determine which carts will be discounted.
- value (object): Type of discount and its corresponding value.
- sortOrder (string): Unique decimal value between 0 and 1 defining the order of Cart Discounts to apply.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier of the CartDiscount. Pattern: ^[A-Za-z0-9_-]+$, Min length: 2, Max length: 256
- description (localized-string, optional): The description of the cart discount. Example: { "en": "10% off all orders over $100", "de": "10% Rabatt auf alle Bestellungen über 100€" }
- target (object, optional): Segment of the Cart that is discounted. Empty if the value is giftLineItem.
- isActive (boolean, optional): If true the Cart Discount is applied to Carts matching the cartPredicate. Default: true
- validFrom (string, optional): Date and time (UTC) from which the Discount is effective. ISO 8601 format.
- validUntil (string, optional): Date and time (UTC) until which the Discount is effective. ISO 8601 format.
- requiresDiscountCode (boolean, optional): When true the discount can only be applied if a valid Discount Code is provided during checkout. Default: false
- stackingMode (enum, optional): Specifies whether the application of this discount causes the following discounts to be ignored. Values: "Stacking", "StopAfterThisDiscount". Default: "Stacking"
- stores (array, optional): The stores that this discount applies to. If empty, the discount applies to all stores. Maximum: 500 stores.
- custom (object, optional): Custom fields for the Cart Discount.
- storeKey (string, optional): Key of the store to create the cart discount in.

The value object must be one of these types:
1. Absolute discount:
   {
     "type": "absolute",
     "money": [
       {
         "type": "centPrecision",
         "currencyCode": "USD",
         "centAmount": 1000,
         "fractionDigits": 2
       }
     ]
   }

2. Relative discount (percentage):
   {
     "type": "relative",
     "permyriad": 1000  // 10% (1000 out of 10000)
   }

3. Fixed discount (fixed amount regardless of original price):
   {
     "type": "fixed",
     "money": [
       {
         "type": "centPrecision",
         "currencyCode": "USD",
         "centAmount": 2500,
         "fractionDigits": 2
       }
     ]
   }

4. Gift line item discount (adds a free product):
   {
     "type": "giftLineItem",
     "product": {
       "typeId": "product",
       "id": "{{product-id}}"
     },
     "variantId": 1,
     "distributionChannel": {
       "typeId": "channel",
       "id": "{{channel-id}}"
     }
   }

The target object must be one of these types:
1. Line items target:
   {
     "type": "lineItems",
     "predicate": "categories.id = \\"{{category-id}}\\""
   }

2. Custom line items target:
   {
     "type": "customLineItems",
     "predicate": "slug = \\"gift-wrapping\\""
   }

3. Shipping cost target:
   {
     "type": "shipping"
   }

4. Total price target:
   {
     "type": "totalPrice"
   }

5. Multi-buy line items target:
   {
     "type": "multiBuyLineItems",
     "predicate": "variant.sku = \\"SKU123\\"",
     "triggerQuantity": 3,
     "discountedQuantity": 1,
     "maxOccurrence": 2,
     "selectionMode": "Cheapest"
   }

6. Multi-buy custom line items target:
   {
     "type": "multiBuyCustomLineItems",
     "predicate": "slug = \\"premium-service\\"",
     "triggerQuantity": 3,
     "discountedQuantity": 1,
     "maxOccurrence": 1,
     "selectionMode": "MostExpensive"
   }

7. Pattern target:
   {
     "type": "pattern",
     "components": [
       {
         "type": "countOnLineItemUnits",
         "predicate": "variant.sku = \\"SHIRT\\"",
         "count": 2
       },
       {
         "type": "countOnLineItemUnits",
         "predicate": "variant.sku = \\"PANTS\\"",
         "count": 1
       }
     ]
   }

Cart predicate examples:

1. Basic predicates:
   - "totalPrice > \\"100 USD\\""                       // Carts with total price greater than $100
   - "totalPrice < \\"50 EUR\\""                        // Carts with total price less than €50
   - "lineItemCount > 5"                              // Carts with more than 5 line items
   - "lineItemCount <= 2"                             // Carts with 2 or fewer line items
   - "customerGroup.id = \\"{{customer-group-id}}\\""    // Carts for customers in a specific group

2. Line item predicates:
   - "lineItems(variant.sku = \\"SKU123\\")"            // Carts containing a specific SKU
   - "lineItems(price.centAmount > 5000)"             // Carts containing products priced above $50
   - "lineItems(quantity >= 3)"                       // Carts containing items with quantity 3 or more
   - "lineItems(discountedPrice is defined)"          // Carts with items that already have a discount
   - "not(lineItems(price.centAmount < 1000))"        // Carts with no items under $10

3. Combined predicates:
   - "totalPrice > \\"100 USD\\" and lineItemCount > 2" // Carts over $100 with more than 2 items
   - "lineItems(variant.sku = \\"SHIRT\\") and lineItems(variant.sku = \\"TIE\\")" // Carts with both shirt and tie
   - "custom.specialCustomer = true or customerGroup.id = \\"VIP\\""      // Special or VIP customers

4. Working with dates and times:
   - "createdAt > \\"2023-01-01T00:00:00.000Z\\""          // Carts created after January 1, 2023
   - "custom.orderPlacedAt < \\"2023-12-25T23:59:59.999Z\\""  // Orders placed before Christmas

5. Using math functions:
   - "lineItemTotal(price.centAmount > 2000) > 1"      // Carts with more than 1 item costing over $20
   - "lineItemTotal(quantity > 1) = 0"                 // Carts with no items having quantity greater than 1
   - "sum(lineItems(quantity)) >= 10"                  // Carts with at least 10 items in total
`;

export const updateCartDiscountPrompt = `
This tool will update a Cart Discount in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the cart discount.
- actions (array): An array of update actions to perform on the cart discount.

It takes one of these required identifier arguments:
- id (string): The ID of the cart discount to update.
- key (string): The key of the cart discount to update.

It takes this optional argument:
- storeKey (string, optional): Key of the store to update the cart discount in.

Example actions from commercetools API include:

1. Change name:
   {
     "action": "changeName",
     "name": {
       "en": "New Cart Discount Name",
       "de": "Neuer Warenkorb-Rabattname"
     }
   }

2. Change description:
   {
     "action": "setDescription",
     "description": {
       "en": "New description",
       "de": "Neue Beschreibung"
     }
   }

3. Change value:
   {
     "action": "changeValue",
     "value": {
       "type": "relative",
       "permyriad": 2000
     }
   }

4. Change cart predicate:
   {
     "action": "changeCartPredicate",
     "cartPredicate": "totalPrice > \\"200 USD\\""
   }

5. Change target:
   {
     "action": "changeTarget",
     "target": {
       "type": "lineItems",
       "predicate": "variant.sku = \\"NEW-SKU\\""
     }
   }

6. Change whether the discount is active:
   {
     "action": "changeIsActive",
     "isActive": true
   }

7. Change the sort order:
   {
     "action": "changeSortOrder",
     "sortOrder": "0.5"
   }

8. Set valid timeframe:
   {
     "action": "setValidFromAndUntil",
     "validFrom": "2023-01-01T00:00:00.000Z",
     "validUntil": "2023-12-31T23:59:59.999Z"
   }

9. Set a single validity date:
   {
     "action": "setValidFrom",
     "validFrom": "2023-06-01T00:00:00.000Z"
   }
   
   {
     "action": "setValidUntil",
     "validUntil": "2023-12-31T23:59:59.999Z"
   }

10. Change whether a discount code is required:
    {
      "action": "changeRequiresDiscountCode",
      "requiresDiscountCode": true
    }

11. Change stacking mode:
    {
      "action": "changeStackingMode",
      "stackingMode": "StopAfterThisDiscount"
    }

12. Manage store associations:
    {
      "action": "addStore",
      "store": {
        "typeId": "store",
        "key": "berlin-store"
      }
    }
    
    {
      "action": "removeStore",
      "store": {
        "typeId": "store",
        "key": "old-store"
      }
    }
    
    {
      "action": "setStores",
      "stores": [
        {
          "typeId": "store",
          "key": "store-1"
        },
        {
          "typeId": "store",
          "key": "store-2"
        }
      ]
    }

13. Set custom fields:
    {
      "action": "setCustomField",
      "name": "promotionId",
      "value": "holiday-special-2023"
    }
    
    {
      "action": "setCustomType",
      "type": {
        "typeId": "type",
        "id": "{{custom-type-id}}"
      },
      "fields": {
        "promotionId": "holiday-special-2023",
        "internalNotes": "Special discount for holiday season"
      }
    }
`;

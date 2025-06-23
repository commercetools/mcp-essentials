export const readProductDiscountPrompt = `
This tool will fetch Product Discounts from commercetools.

It takes these optional arguments:
- id (string, optional): The ID of the product discount to fetch.
- key (string, optional): The key of the product discount to fetch.
- where (string array, optional): Query predicates specified as strings for filtering product discounts. Example: ["name(en = \\"Summer Sale\\")"]
- limit (int, optional): The number of product discounts to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["references[*]"]

If both id and key are omitted, this tool will return a list of product discounts based on the other query parameters.
If either id or key is provided, this tool will return a single product discount.
`;

export const createProductDiscountPrompt = `
This tool will create a new Product Discount in commercetools.

It takes these required arguments:
- name (localized-string): The name of the product discount.
- predicate (string): Valid ProductDiscount predicate to determine which products will be discounted.
- value (object): Type of discount and its corresponding value.
- sortOrder (string): Unique decimal value between 0 and 1 defining the order of Product Discounts to apply.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier of the ProductDiscount.
- description (localized-string, optional): The description of the product discount.
- isActive (boolean, optional): If true the Product Discount is applied to Products matching the predicate.
- validFrom (string, optional): Date and time (UTC) from which the Discount is effective.
- validUntil (string, optional): Date and time (UTC) until which the Discount is effective.

The value object must be one of these types:
1. Absolute discount:
   {
     "type": "absolute",
     "money": [
       {
         "type": "centPrecision",
         "currencyCode": "EUR",
         "centAmount": 100,
         "fractionDigits": 2
       }
     ]
   }

2. Relative discount (percentage):
   {
     "type": "relative",
     "permyriad": 1000  // 10% (1000 out of 10000)
   }

3. External discount (calculated externally):
   {
     "type": "external"
   }

Product discount predicate examples:

1. Basic equality:
   - "product.id = \\"{{product-id}}\\""
   - "product.key = \\"my-product-key\\""
   - "variant.id = 1"
   - "variant.key = \\"my-variant-key\\""
   - "sku = \\"AB-123\\""

2. Inequality:
   - "product.key != \\"holidayTShirt\\""
   - "variant.price.centAmount > 5000"  // Products priced above 50 EUR
   - "variant.price.centAmount <= 3000"  // Products priced at 30 EUR or below

3. Containment (for collections/arrays):
   - "categories.id contains \\"category-id\\""  // Products in a specific category
   - "attributes.size contains any (\\"xl\\", \\"xxl\\")"  // Products with XL or XXL sizes
   - "attributes.season contains all (\\"spring2023\\", \\"summer2023\\")"  // Products in both seasons
   - "attributes.color in (\\"red\\", \\"blue\\")"  // Products that are red or blue

4. Defined/empty checks:
   - "variant.attributes.brand is defined"  // Products with brand attribute defined
   - "variant.attributes.tags is not empty"  // Products with at least one tag
   - "variant.sku is not defined"  // Products without SKU

5. Combining conditions:
   - "product.key = \\"holiday-special\\" and variant.price.centAmount > 1000"
   - "variant.attributes.season = \\"summer\\" or variant.attributes.season = \\"spring\\""
   - "not(product.key = \\"clearance-item\\")"  // All products except clearance items
   - "(categories.id = \\"shirts\\" or categories.id = \\"tops\\") and variant.price.centAmount < 2000"

6. Working with dates:
   - "variant.attributes.releaseDate > \\"2023-01-01T00:00:00.000Z\\""  // Products released after Jan 1, 2023
`;

export const updateProductDiscountPrompt = `
This tool will update a Product Discount in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the product discount.
- actions (array): An array of update actions to perform on the product discount.

It takes one of these required identifier arguments:
- id (string): The ID of the product discount to update.
- key (string): The key of the product discount to update.

Example actions from commercetools API include:
- changeValue: Change the discount value.
- changePredicate: Change the product discount predicate.
- changeIsActive: Change the active status of the product discount.
- setValidFrom: Set the validFrom date.
- setValidUntil: Set the validUntil date.
- setValidFromAndUntil: Set both validFrom and validUntil dates.
- changeName: Change the name of the product discount.
- setDescription: Set or remove the description of the product discount.
- changeSortOrder: Change the sort order of the product discount.

Each action type requires specific fields according to the commercetools API.

Example action for changing the value:
{
  "action": "changeValue",
  "value": {
    "type": "absolute",
    "money": [
      {
        "type": "centPrecision",
        "currencyCode": "EUR",
        "centAmount": 500,
        "fractionDigits": 2
      }
    ]
  }
}
`;

export const readStandalonePricePrompt = `
This tool will fetch information about a commercetools standalone price.

It can be used in three ways:
1. To fetch a single standalone price by its ID
2. To fetch a single standalone price by its key
3. To query multiple standalone prices based on criteria

It takes these parameters:
- id (string, optional): The ID of the standalone price to fetch
- key (string, optional): The key of the standalone price to fetch
- where (string array, optional): Query predicates for filtering standalone prices. Example: ["sku=\\"A0E200000002E49\\""]
- limit (int, optional): The number of standalone prices to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["value.centAmount asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["customerGroup", "channel"]

If both id and key are not provided, it will fetch a list of standalone prices using query parameters.
`;

export const createStandalonePricePrompt = `
This tool will create a new Standalone Price in commercetools.

It takes these required arguments:
- sku (string): SKU of the ProductVariant to which this Price is associated.
- value (object): Money value of this Price, containing currencyCode and centAmount.

It takes these optional arguments:
- key (string, optional): User-defined unique identifier of the StandalonePrice. Pattern: ^[A-Za-z0-9_-]+$, Min length: 2, Max length: 256
- country (string, optional): Country for which this Price is valid. Pattern: ^[A-Z]{2}$
- customerGroup (object, optional): Reference to a CustomerGroup for which this Price is valid.
- channel (object, optional): Reference to a Channel for which this Price is valid.
- validFrom (string, optional): Date from which the Price is valid (ISO 8601 format).
- validUntil (string, optional): Date until the Price is valid (ISO 8601 format).
- tiers (array, optional): Price tiers for quantity-based discounts.
- active (boolean, optional): Whether the price is active or not.
- discounted (object, optional): Set if a matching ProductDiscount exists.
- staged (boolean, optional): Whether to create a staged price.

Example value format:
{
  "type": "centPrecision",
  "currencyCode": "EUR",
  "centAmount": 10000,
  "fractionDigits": 2
}

Example tiers format:
[
  {
    "minimumQuantity": 10,
    "value": {
      "type": "centPrecision",
      "currencyCode": "EUR",
      "centAmount": 9000,
      "fractionDigits": 2
    }
  }
]
`;

export const updateStandalonePricePrompt = `
This tool will update a Standalone Price in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the standalone price.
- actions (array): An array of update actions to perform on the standalone price. Each action should have an "action" field indicating the action type.

It also requires ONE of these identifiers:
- id (string, optional): The ID of the standalone price to update
- key (string, optional): The key of the standalone price to update

Example actions from commercetools API include:
- changeValue: Change the money value of the standalone price
- setActive: Set or unset the active state of the standalone price
- addPriceTier: Add a price tier to the standalone price
- removePriceTier: Remove a price tier from the standalone price
- setPriceTiers: Set all price tiers for the standalone price
- applyStagedChanges: Apply all staged changes to the standalone price
- removeStagedChanges: Remove all staged changes from the standalone price
- setValidFrom: Set the valid from date of the standalone price
- setValidUntil: Set the valid until date of the standalone price
- setValidFromAndUntil: Set both valid from and valid until dates of the standalone price

Each action type requires specific fields according to the commercetools API.
`;

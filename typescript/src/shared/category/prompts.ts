export const readCategoryPrompt = `
This tool will fetch Categories from commercetools.

It can be used in three ways:
1. To fetch a single category by its ID
2. To fetch a single category by its key
3. To query multiple categories based on criteria

It takes these parameters:
- id (string, optional): The ID of the category to fetch
- key (string, optional): The key of the category to fetch
- where (string array, optional): Query predicates for filtering categories. Example: ["name(en = \\"Clothes\\")"]
- limit (int, optional): The number of categories to return (default: 10, range: 1-500)
- offset (int, optional): The number of items to skip before starting to collect the result set
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- expand (string array, optional): An array of field paths to expand. Example: ["parent", "ancestors[*]"]

If both id and key are not provided, it will fetch a list of categories using query parameters.
`;

export const createCategoryPrompt = `
This tool will create a new Category in commercetools.

It takes these required arguments:
- name (localized-string): The name of the category in different languages. Example: {"en": "Shoes", "de": "Schuhe"}
- slug (localized-string): The URL slug of the category in different languages. Example: {"en": "shoes", "de": "schuhe"}
  Must match pattern ^[A-Za-z0-9_-]{2,256}+$ and be unique across the project.

It takes these optional arguments:
- description (localized-string, optional): The description of the category
- key (string, optional): User-defined unique identifier for the category. Pattern: ^[A-Za-z0-9_-]+$
- externalId (string, optional): Additional identifier for external systems like CRM or ERP
- parent (object, optional): Reference to the parent category. Example: {"id": "parent-id", "typeId": "category"}
- orderHint (string, optional): Decimal value between 0 and 1 for ordering categories at the same level
- metaTitle (localized-string, optional): SEO meta title
- metaDescription (localized-string, optional): SEO meta description
- metaKeywords (localized-string, optional): SEO meta keywords
- assets (array, optional): Media related to the category
- custom (object, optional): Custom fields for the category

Use project settings to get the language code.
`;

export const updateCategoryPrompt = `
This tool will update a Category in commercetools using update actions from the commercetools API.

It takes these required arguments:
- version (integer): The current version of the category
- actions (array): An array of update actions to perform on the category

It also requires ONE of these identifiers:
- id (string, optional): The ID of the category to update
- key (string, optional): The key of the category to update

Example actions from commercetools API include:
- changeName: Update the name of the category
- changeSlug: Update the slug of the category
- setDescription: Set or remove the description of the category
- changeParent: Move the category to a new parent
- setExternalId: Set or remove the external ID of the category
- setMetaTitle: Set or remove the meta title of the category
- setMetaDescription: Set or remove the meta description of the category
- setMetaKeywords: Set or remove the meta keywords of the category
- setOrderHint: Update the order hint of the category
- setKey: Set or remove the key of the category
- addAsset: Add a new asset to the category
- removeAsset: Remove an asset from the category
- changeAssetName: Change the name of an asset in the category
- setAssetDescription: Set or remove the description of an asset in the category
- changeAssetOrder: Change the order of assets in the category
- setAssetTags: Update the tags of an asset in the category
- setAssetSources: Update the sources of an asset in the category
- setAssetKey: Set or remove the key of an asset in the category
- setCustomType: Set or remove the custom type of the category
- setCustomField: Set or remove a custom field of the category

Each action type requires specific fields according to the commercetools API.
`;

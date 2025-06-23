export const listProductsPrompt = `
This tool will fetch a list of Products from commercetools.

It takes these optional arguments:
- limit (int, optional): The number of products to return (default: 10, range: 1-500).
- offset (int, optional): The number of items to skip before starting to collect the result set.
- sort (string array, optional): Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]
- where (string array, optional): Query predicates specified as strings. Example: ["masterData(current(name(en = \\"Product Name\\"))"]. In this example "en" is the language code.
- expand (string array, optional): An array of field paths to expand. Example: ["masterData.current.categories[*]"]

Use project settings to get the language code.
`;

export const createProductPrompt = `
This tool will create a new Product in commercetools.

It takes these required arguments:
- productType (string): The ID of the product type to create the product from.
- name (localized-string): The name of the product.
- slug (localized-string): The slug of the product.

It takes these optional arguments:
- description (localized-string, optional): The description of the product.
- categories (string array, optional): The categories of the product.
- masterVariant (object, optional): The master variant of the product.
- variants (object array, optional): The variants of the product.
- key (string, optional): The key of the product.
- metaTitle (localized-string, optional): The meta title of the product.
- metaDescription (localized-string, optional): The meta description of the product.
- metaKeywords (localized-string, optional): The meta keywords of the product.
- searchKeywords (localized-string, optional): The search keywords of the product.
- taxCategory (string, optional): The tax category of the product.
- state (string, optional): The state of the product.

Use project settings to get the language code.
`;

export const updateProductPrompt = `
This tool will update a Product in commercetools using update actions from the commercetools API.

It takes these required arguments:
- id (string): The ID of the product to update.
- version (integer): The current version of the product.
- actions (array): An array of update actions to perform on the product. Each action should have an "action" field indicating the action type.

Example actions from commercetools API include:
- addAsset
- addExternalImage
- addPrice
- addToCategory
- changeAssetName
- changeAssetOrder
- changeMasterVariant
- changeName
- changePrice
- changeSlug
- removeAsset
- removeFromCategory
- removeImage
- removePrice
- revertStagedChanges
- revertStagedVariantChanges
- setAssetCustomField
- setAssetCustomType
- setAssetDescription
- setAssetKey
- setAssetSources
- setAssetTags
- setAttribute
- setAttributeInAllVariants
- setCategoryOrderHint
- setDescription
- setDiscountedPrice
- setImageLabel
- setKey
- setMetaDescription
- setMetaKeywords
- setMetaTitle
- setPrices
- setProductPriceCustomField
- setProductPriceCustomType
- setProductVariantKey
- setSearchKeywords
- setSku
- setTaxCategory
- transitionState
- unpublish

Each action type requires specific fields according to the commercetools API.
`;

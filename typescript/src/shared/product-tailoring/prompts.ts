export const readProductTailoringPrompt = `
Read product tailoring entries from the commercetools platform. You can:
- Get a single product tailoring entry by providing either its ID or key
- Get product tailoring for a specific product in a store
- List multiple product tailoring entries with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific product tailoring entry to retrieve (optional)
- key: The key of a specific product tailoring entry to retrieve (optional)
- storeKey: Key of the store to read product tailoring from (optional)
- productId: ID of the product to get tailoring for (optional)
- productKey: Key of the product to get tailoring for (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["product(id=\\"product-123\\")"])
- expand: Reference paths to expand (e.g., ["product", "store"])

Examples:
// Get by ID
product-tailoring.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
product-tailoring.read({
  key: "product-tailoring-key-123"
})

// Get product tailoring for a product in a store
product-tailoring.read({
  storeKey: "my-store",
  productId: "product-123"
})

// List with filtering
product-tailoring.read({
  limit: 10,
  where: ["product(id=\\"product-123\\")"]
})
`;

export const createProductTailoringPrompt = `
Create a new product tailoring entry in the commercetools platform.

Product Tailoring allows you to customize your product information for different stores or regions. You can tailor product names, descriptions, meta information, slugs, variants, and attributes.

Parameters:
- storeKey: Key of the store to create the product tailoring in (optional for global creation)
- productId: ID of the product to create tailoring for (optional if productKey is provided)
- productKey: Key of the product to create tailoring for (optional if productId is provided)
- current: Current published product tailoring data (optional)
- staged: Staged product tailoring data (optional)
- published: Whether the product tailoring is published (default: false)

The tailoring data can include:
- name: Localized product name
- description: Localized product description
- metaTitle: Localized meta title
- metaDescription: Localized meta description
- metaKeywords: Localized meta keywords
- slug: Localized product slug
- variants: Product variants with tailored images, assets, and attributes
- attributes: Product attributes

Example:
product-tailoring.create({
  storeKey: "my-store",
  productId: "product-123",
  current: {
    name: {
      "en": "Tailored Product Name",
      "de": "Angepasster Produktname"
    },
    description: {
      "en": "Tailored product description for this store",
      "de": "Angepasste Produktbeschreibung für diesen Store"
    },
    slug: {
      "en": "tailored-product-slug",
      "de": "angepasster-produkt-slug"
    }
  },
  published: true
})
`;

export const updateProductTailoringPrompt = `
Update or delete a product tailoring entry in the commercetools platform. You must identify the entry using either ID or key.

Parameters:
- id: The ID of the product tailoring entry to update/delete (optional if key is provided)
- key: The key of the product tailoring entry to update/delete (optional if id is provided)
- storeKey: Key of the store the product tailoring belongs to (optional)
- productId: ID of the product to update tailoring for (optional)
- productKey: Key of the product to update tailoring for (optional)
- version: Expected version of the product tailoring entry (required)
- actions: Array of update actions (required)

Available update actions:
- publish: Publish the product tailoring
- unpublish: Unpublish the product tailoring
- setName: Set or update the product name
- setDescription: Set or update the product description
- setMetaTitle: Set or update the meta title
- setMetaDescription: Set or update the meta description
- setMetaKeywords: Set or update the meta keywords
- setSlug: Set or update the product slug
- setVariants: Set or update product variants
- setAttributes: Set or update product attributes
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field
- delete: Delete the product tailoring entry

Examples:
// Update by ID
product-tailoring.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "setName",
      name: {
        "en": "Updated Product Name",
        "de": "Aktualisierter Produktname"
      }
    },
    {
      action: "publish"
    }
  ]
})

// Update by key
product-tailoring.update({
  key: "product-tailoring-key-123",
  version: 1,
  actions: [
    {
      action: "setDescription",
      description: {
        "en": "Updated description for this store",
        "de": "Aktualisierte Beschreibung für diesen Store"
      }
    }
  ]
})

// Update product tailoring in store
product-tailoring.update({
  storeKey: "my-store",
  productId: "product-123",
  version: 1,
  actions: [
    {
      action: "setSlug",
      slug: {
        "en": "new-tailored-slug",
        "de": "neuer-angepasster-slug"
      }
    }
  ]
})

// Delete by ID
product-tailoring.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "delete"
    }
  ]
})
`;

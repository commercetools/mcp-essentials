import {z} from 'zod';

// Parameters for reading product tailoring entries
export const readProductTailoringParameters = z.object({
  // Optional ID for getting by ID
  id: z
    .string()
    .optional()
    .describe('The ID of the product tailoring entry to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the product tailoring entry to retrieve'),

  // Store-specific parameters
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to read product tailoring from'),

  // Product-specific parameters
  productId: z
    .string()
    .optional()
    .describe('ID of the product to get tailoring for'),
  productKey: z
    .string()
    .optional()
    .describe('Key of the product to get tailoring for'),

  // List parameters (used when neither id nor key is provided)
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Number of results requested. Default: 20, Minimum: 1, Maximum: 500'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe('Number of elements skipped. Default: 0, Maximum: 10000'),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["product(id=\\"product-123\\")"]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["product", "store"]'
    ),
});

// Parameters for creating a product tailoring entry
export const createProductTailoringParameters = z.object({
  // Store context (required for store-scoped creation)
  // Product reference (one of these is required)
  productId: z
    .string()
    .optional()
    .describe('ID of the product to create tailoring for'),
  productKey: z
    .string()
    .optional()
    .describe('Key of the product to create tailoring for'),
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store to create tailoring for'),

  key: z.string().describe('Key of the product tailoring entry to create'),
  product: z
    .object({
      typeId: z.literal('product'),
      id: z.string().describe('ID of the product to create tailoring for'),
      key: z.string().describe('Key of the product to create tailoring for'),
    })
    .optional()
    .describe('Reference to the product to create tailoring for'),
  store: z
    .object({
      typeId: z.literal('store'),
      key: z.string().describe('Key of the store to create tailoring for'),
    })
    .optional()
    .describe('Reference to the store to create tailoring for'),
  name: z
    .record(z.string(), z.string())
    // .optional()
    .describe('Localized product name'),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized product description'),
  metaTitle: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized meta title'),
  metaDescription: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized meta description'),
  metaKeywords: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized meta keywords'),
  slug: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized product slug'),
  published: z
    .boolean()
    .default(false)
    .describe('Whether the product tailoring is published'),
  variants: z
    .array(
      z.object({
        id: z.number().int().describe('Product variant ID'),
        sku: z.string().optional().describe('Product variant SKU'),
        images: z
          .array(
            z.object({
              url: z.string().describe('Image URL'),
              dimensions: z.object({
                w: z.number().describe('Image width'),
                h: z.number().describe('Image height'),
              }),
              // .optional(),
            })
          )
          .optional(),
        assets: z
          .array(
            z.object({
              id: z.string().describe('Asset ID'),
              key: z.string().describe('Asset key'),
              sources: z.array(
                z.object({
                  uri: z.string().describe('Asset URI'),
                  key: z.string().optional().describe('Asset key'),
                  dimensions: z.object({
                    w: z.number().describe('Asset width'),
                    h: z.number().describe('Asset height'),
                  }),
                  // .optional(),
                  contentType: z.string().optional().describe('Content type'),
                })
              ),
              // .optional(),
              name: z
                .record(z.string(), z.string())
                // .optional()
                .describe('Localized asset name'),
              description: z
                .record(z.string(), z.string())
                .optional()
                .describe('Localized asset description'),
              tags: z.array(z.string()).optional().describe('Asset tags'),
              custom: z
                .object({
                  typeId: z.literal('type'),
                  id: z.string().optional().describe('ID of the custom type'),
                  key: z.string().describe('Key of the custom type'),
                })
                // .optional()
                .describe('Custom fields for the asset'),
            })
          )
          .optional(),
        attributes: z
          .array(
            z.object({
              name: z.string().describe('Product attribute name'),
              value: z.any().describe('Product attribute value'),
            })
          )
          .optional(),
      })
    )
    .optional()
    .describe('Product variants'),
  attributes: z
    .array(
      z.object({
        name: z.string().describe('Product attribute name'),
        value: z.any().describe('Product attribute value'),
      })
    )
    .optional()
    .describe('Product attributes'),

  customType: z
    .object({
      id: z.string().describe('ID of the custom type'),
      typeId: z.literal('type'),
    })
    .optional()
    .describe(
      'The Type that extends the product tailoring entry with custom fields'
    ),
});

// Parameters for updating a product tailoring entry
export const updateProductTailoringParameters = z.object({
  // Identifier options (one must be provided)
  id: z
    .string()
    .optional()
    .describe('The ID of the product tailoring entry to update'),
  key: z
    .string()
    .optional()
    .describe('The key of the product tailoring entry to update'),

  // Store-specific parameters
  storeKey: z
    .string()
    .optional()
    .describe('Key of the store the product tailoring belongs to'),
  productId: z
    .string()
    .optional()
    .describe('ID of the product to update tailoring for'),
  productKey: z
    .string()
    .optional()
    .describe('Key of the product to update tailoring for'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the product tailoring entry on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Publish action
        z.object({
          action: z.literal('publish'),
        }),
        // Unpublish action
        z.object({
          action: z.literal('unpublish'),
        }),
        // Set Name action
        z.object({
          action: z.literal('setName'),
          name: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized product name'),
        }),
        // Set Description action
        z.object({
          action: z.literal('setDescription'),
          description: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized product description'),
        }),
        // Set Meta Title action
        z.object({
          action: z.literal('setMetaTitle'),
          metaTitle: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized meta title'),
        }),
        // Set Meta Description action
        z.object({
          action: z.literal('setMetaDescription'),
          metaDescription: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized meta description'),
        }),
        // Set Meta Keywords action
        z.object({
          action: z.literal('setMetaKeywords'),
          metaKeywords: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized meta keywords'),
        }),
        // Set Slug action
        z.object({
          action: z.literal('setSlug'),
          slug: z
            .record(z.string(), z.string())
            .optional()
            .describe('Localized product slug'),
        }),
        // Set Variants action
        z.object({
          action: z.literal('setVariants'),
          variants: z
            .array(
              z.object({
                id: z.number().int().describe('Product variant ID'),
                images: z
                  .array(
                    z.object({
                      url: z.string().describe('Image URL'),
                      dimensions: z
                        .object({
                          w: z.number().describe('Image width'),
                          h: z.number().describe('Image height'),
                        })
                        .optional(),
                    })
                  )
                  .optional(),
                assets: z
                  .array(
                    z.object({
                      key: z.string().describe('Asset key'),
                      sources: z
                        .array(
                          z.object({
                            uri: z.string().describe('Asset URI'),
                            key: z.string().optional().describe('Asset key'),
                            dimensions: z
                              .object({
                                w: z.number().describe('Asset width'),
                                h: z.number().describe('Asset height'),
                              })
                              .optional(),
                            contentType: z
                              .string()
                              .optional()
                              .describe('Content type'),
                          })
                        )
                        .describe('Asset sources'),
                      name: z
                        .record(z.string(), z.string())
                        .describe('Localized asset name'),
                      description: z
                        .record(z.string(), z.string())
                        .optional()
                        .describe('Localized asset description'),
                    })
                  )
                  .optional(),
                attributes: z
                  .array(
                    z.object({
                      name: z.string().describe('Attribute name'),
                      value: z.any().describe('Attribute value'),
                    })
                  )
                  .optional(),
              })
            )
            .optional()
            .describe('Product variants'),
        }),
        // Set Attributes action
        z.object({
          action: z.literal('setAttributes'),
          attributes: z
            .array(
              z.object({
                name: z.string().describe('Product attribute name'),
                value: z.any().describe('Product attribute value'),
              })
            )
            .optional()
            .describe('Product attributes'),
        }),
        // Set CustomType action
        z.object({
          action: z.literal('setCustomType'),
          type: z
            .object({
              id: z.string(),
              typeId: z.literal('type'),
            })
            .optional()
            .describe(
              'The Type that extends the product tailoring entry with custom fields'
            ),
          fields: z
            .record(z.string(), z.any())
            .optional()
            .describe('Custom fields for the product tailoring entry'),
        }),
        // Set CustomField action
        z.object({
          action: z.literal('setCustomField'),
          name: z.string().describe('Name of the custom field'),
          value: z
            .any()
            .optional()
            .describe('Value to set for the custom field'),
        }),
        // Delete action
        z.object({
          action: z.literal('delete'),
        }),
      ])
    )
    .describe('Update actions to be performed on the product tailoring entry'),
});

// Parameters for deleting a product tailoring entry by ID
export const deleteProductTailoringByIdParameters = z.object({
  id: z.string().describe('The ID of the product tailoring entry to delete'),
  version: z
    .number()
    .int()
    .describe('The current version of the product tailoring entry'),
});

// Parameters for deleting a product tailoring entry by key
export const deleteProductTailoringByKeyParameters = z.object({
  key: z.string().describe('The key of the product tailoring entry to delete'),
  version: z
    .number()
    .int()
    .describe('The current version of the product tailoring entry'),
});

// Parameters for deleting a product tailoring entry by product ID in store
export const deleteProductTailoringByProductIdParameters = z.object({
  storeKey: z.string().describe('Key of the store'),
  productId: z.string().describe('ID of the product'),
  version: z
    .number()
    .int()
    .describe('The current version of the product tailoring entry'),
});

// Parameters for deleting a product tailoring entry by product key in store
export const deleteProductTailoringByProductKeyParameters = z.object({
  storeKey: z.string().describe('Key of the store'),
  productKey: z.string().describe('Key of the product'),
  version: z
    .number()
    .int()
    .describe('The current version of the product tailoring entry'),
});

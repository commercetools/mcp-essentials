export const readReviewPrompt = `
Read reviews from the commercetools platform. You can:
- Get a single review by providing either its ID or key
- List multiple reviews with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific review to retrieve (optional)
- key: The key of a specific review to retrieve (optional)
- limit: Number of results requested when listing (default: 20, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["rating > 50"])
- expand: Reference paths to expand (e.g., ["customer", "target"])

Examples:
// Get by ID
reviews.read({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678"
})

// Get by key
reviews.read({
  key: "review-key-123"
})

// List with filtering
reviews.read({
  limit: 10,
  where: ["rating > 50"]
})
`;

export const createReviewPrompt = `
Create a new review in the commercetools platform.

Parameters:
- key: User-defined unique identifier (optional)
- uniquenessValue: Must be unique among reviews (optional)
- locale: Language in which the content is written (optional)
- authorName: Name of the author (optional)
- title: Title of the review (optional)
- text: Text content of the review (optional)
- target: Identifies the target of the review - either a Product or Channel (optional)
- state: State of the review used for approval processes (optional)
- rating: Rating of the Product or Channel, range -100 to 100 (optional)
- customer: Customer who created the review (optional)
- custom: Custom fields for the review (optional)

Example:
reviews.create({
  key: "review-key-123",
  title: "Great product!",
  text: "This is an excellent product, highly recommended.",
  target: {
    id: "product-uuid",
    typeId: "product"
  },
  rating: 85,
  authorName: "John Doe"
})
`;

export const updateReviewPrompt = `
Update a review in the commercetools platform. You must identify the review using either ID or key.

Parameters:
- id: The ID of the review to update (optional if key is provided)
- key: The key of the review to update (optional if id is provided)
- version: Expected version of the review (required)
- actions: Array of update actions (required)

Available update actions:
- setKey: Set or update the key
- setAuthorName: Set or update author name
- setTitle: Set or update title
- setText: Set or update text content
- setTarget: Set or update the target (Product or Channel)
- setRating: Set or update rating value (range -100 to 100)
- setCustomer: Set or update customer reference
- setState: Set or update the state
- transitionState: Transition the review to a new state
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field

Examples:
// Update by ID
reviews.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 1,
  actions: [
    {
      action: "setRating",
      rating: 90
    }
  ]
})

// Update by key
reviews.update({
  key: "review-key-123",
  version: 2,
  actions: [
    {
      action: "setText",
      text: "Updated review text"
    },
    {
      action: "setState",
      state: {
        id: "state-id",
        typeId: "state"
      }
    }
  ]
})

// Transition state
reviews.update({
  id: "d3a6d2c1-b1a2-c3d4-e5f6-789012345678",
  version: 3,
  actions: [
    {
      action: "transitionState",
      state: {
        id: "approved-state-id",
        typeId: "state"
      },
      force: false
    }
  ]
})
`;


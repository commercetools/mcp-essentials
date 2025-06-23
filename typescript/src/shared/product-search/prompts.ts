export const searchProductsPrompt = `
This tool allows you to search for products using the Product Search API from commercetools.

This endpoint is powerful for creating storefront discovery experiences where customers can browse and search across Products.
It supports searching through Products across Stores, Product Selections, and Standalone Prices.

The tool takes these arguments:
- query (object, required): The search query against searchable Product fields, expressed in the search query language.
- sort (array, optional): Controls how results are sorted. Each sort item has:
  - field (string): The field to sort by (e.g., 'variants.prices.centAmount', 'score')
  - order (string): 'asc' or 'desc'
  - mode (string, optional): For multi-valued fields - 'min' or 'max'
  If not provided, results are sorted by relevance score in descending order.
- limit (integer, optional): The maximum number of search results to return in one page. Default: 20, Minimum: 0, Maximum: 100.
- offset (integer, optional): The number of search results to skip for pagination. Default: 0, Minimum: 0, Maximum: 10000.
- markMatchingVariants (boolean, optional): If true, returns additional information about which Product Variants match the search query.
- productProjectionParameters (object, optional): Controls data integration with Product Projection parameters.
- facets (array, optional): Facets to calculate counts, distinct values, or ranges on the result set.

Example query formats:
- Wildcard: { "wildcard": { "field": "name", "language": "en-US", "value": "*pasta*", "caseInsensitive": true } }
- Exact match: { "exact": { "field": "variants.attributes.color", "fieldType": "text", "value": "red" } }
- Range: { "range": { "field": "variants.price.centAmount", "fieldType": "number", "lte": 5000 } }
- Full text: { "fullText": { "field": "name", "value": "running shoes", "language": "en-US" } }

The API supports only those Locales configured in the Project.
`;

---
"@commercetools/mcp-essentials": minor
"@commercetools/agent-essentials": minor
---

Added [fieldType](https://docs.commercetools.com/api/search-query-language#ctp:api:type:SearchFieldType) to search_products

Necessary when sorting by attributes to avoid errors like: `SDKError: Failed to search products Field [variants.attributes.weight]: Type is missing`

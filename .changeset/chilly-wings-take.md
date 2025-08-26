---
"@commercetools/mcp-essentials": minor
"@commercetools/agent-essentials": minor
---

The MCP now return more detailed error message

Before this change:
SDKError: Failed to update cart

After this change:
SDKError: Failed to update cart: Failed to update cart by ID: The variant '2' with SKU '<blah>' of product '<blah>' does not contain a price for currency 'EUR' country 'DE', all customer groups and all channels.

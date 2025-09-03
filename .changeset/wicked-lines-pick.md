---
"@commercetools/mcp-essentials": minor
"@commercetools/agent-essentials": minor
---

Add dynamic tool loading feature.
In this feature, if the number available tools exceeded `DYNAMIC_TOOL_LOADING_THRESHOLD` we'll only expose 5 tools:
1. list_tools
2. inject_tool
3. execute_tool
4. bulk_create
4. bulk_update

This will drastically reduce the amount of context we take from the client's LLM for tools' description and schema.

# commercetools Model Context Protocol

This documentation focusses on the development of the MCP server. For the user documentation, view the [main README](../README.md).

## Debugging locally

```bash
#  navigate to ../typescript
pnpm run build
# navigate to ../modelcontextprotocol

# link the local package
pnpm add link:../typescript

# run the server in terminal
npx ts-node src/index.ts --tools=products.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --authUrl=AUTH_URL --projectKey=PROJECT_KEY --apiUrl=API_URL

# test using mcptools : Install mcptools from https://github.com/f/mcptools
mcp call list_products --params '{"limit": 2}' npx ts-node /<absolute-path>/agent-essentials/modelcontextprotocol/src/index.ts --tools=all \
--projectKey="PROJECT_KEY" \
--clientSecret="CLIENT_SECRET" \
--clientId="CLIENT_ID" \
--authUrl="AUTH_URL" \
--apiUrl="API_URL"
```

**_Do not commit the linked package in package.json to the repo_**

## Testing Using Claude Desktop

NOTE: This will not work with Claude Desktop unless you uninstall node v16 from your machine!

```bash
#  navigate to ../typescript
pnpm run build

# navigate to ../modelcontextprotocol

# link the local package
pnpm add link:../typescript
```

Configure MCP servers in Claude Desktop

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "ts-node",
        "/<absolute-path>/agent-essentials/modelcontextprotocol/src/index.ts",
        "--tools=all",
        "--projectKey=PROJECT_KEY",
        "--clientSecret=CLIENT_SECRET",
        "--clientId=CLIENT_ID",
        "--authUrl=AUTH_URL",
        "--apiUrl=API_URL"
      ]
    }
  }
}
```

## Debugging the Server

To debug your server, you can use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector).

First build the server

```
npm run build
```

Run the following command in your terminal:

```bash
# Start MCP Inspector and server with all tools
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

### Instructions

1. Replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, and `API_URL` with your actual values.
2. Run the command to start the MCP Inspector.
3. Open the MCP Inspector UI in your browser and click Connect to start the MCP server.
4. You can see the list of tools you selected and test each tool individually.

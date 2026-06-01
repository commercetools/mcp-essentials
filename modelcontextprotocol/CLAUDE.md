# MCP Essentials

## Build

After making changes to either the shared package (`typescript/src/`) or the MCP server (`modelcontextprotocol/src/`), rebuild:

```bash
pnpm build
```

This runs `prebuild` (builds `@commercetools/agent-essentials` first via tsup) then compiles the MCP server to `dist/` via tsc.

After rebuilding, restart the MCP client (e.g. Claude Code) to pick up the new `dist/index.js`.

## Test

```bash
cd /Users/martin.hlavac@goflink.com/Personal/Workspace/mcp-essentials/typescript
npx jest --testPathPattern="essentials.test" --no-coverage
```

## Architecture

- `typescript/src/shared/` - Shared business logic, tools, and API layer (published as `@commercetools/agent-essentials`)
- `modelcontextprotocol/src/` - MCP server entry point that wraps the shared package
- `modelcontextprotocol/dist/index.js` - Built MCP server binary referenced by MCP client configs

## Key files

- `typescript/src/utils/scopes.ts` - OAuth scope-to-action mapping (includes CT bundled scope aliases, e.g. `orders` scope covers `cart` and `zone`)
- `typescript/src/shared/configuration.ts` - Tool filtering via `isToolAllowed`
- `modelcontextprotocol/src/index.ts` - CLI arg parsing (`--tools=all.read`, etc.) and `ACCEPTED_TOOLS` list

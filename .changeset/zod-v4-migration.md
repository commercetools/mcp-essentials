---
"@commercetools/agent-essentials": major
"@commercetools/mcp-essentials": major
---

Upgrade `zod` from v3 to v4 (`^4.0.0`).

Consumers that define custom tools or extend the SDK with their own zod schemas will need to migrate to zod v4 as well. The `ZodObject` generic now takes two type parameters instead of four/five, and `ZodError.issues` replaces the deprecated `.errors` / `.formErrors` accessors. See the [zod v4 migration guide](https://zod.dev/v4/changelog) for details.

The unused `zod-to-json-schema` dependency has been removed; if you used it transitively, switch to the native `z.toJSONSchema()` in zod v4.

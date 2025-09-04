# @commercetools/agent-essentials

## 3.1.0

### Minor Changes

- [#25](https://github.com/commercetools/mcp-essentials/pull/25) [`b16df24`](https://github.com/commercetools/mcp-essentials/commit/b16df24a9d81c384fbb37b0c9cccaafc8c5616dc) Thanks [@ajimae](https://github.com/ajimae)! - [Feat] Add User Agent to MCP Essentials

- [#22](https://github.com/commercetools/mcp-essentials/pull/22) [`733f7fc`](https://github.com/commercetools/mcp-essentials/commit/733f7fc382fe1e87b3009f978201190f1fb198d2) Thanks [@islam3zzat](https://github.com/islam3zzat)! - Add dynamic tool loading feature.
  In this feature, if the number available tools exceeded `DYNAMIC_TOOL_LOADING_THRESHOLD` we'll only expose 5 tools:
  1. list_tools
  2. inject_tool
  3. execute_tool
  4. bulk_create
  5. bulk_update

  This will drastically reduce the amount of context we take from the client's LLM for tools' description and schema.

## 3.0.0

### Major Changes

- [#17](https://github.com/commercetools/mcp-essentials/pull/17) [`3c5e8a9`](https://github.com/commercetools/mcp-essentials/commit/3c5e8a96d282135aa65d0cd02c208bb76b2d1cd7) Thanks [@ajimae](https://github.com/ajimae)! - [Feat][MCP-6] Scope Based Tools Filtering

### Minor Changes

- [#20](https://github.com/commercetools/mcp-essentials/pull/20) [`80996f0`](https://github.com/commercetools/mcp-essentials/commit/80996f0469a23fba77c2ddaccfda397adc3884b6) Thanks [@martinw-ct](https://github.com/martinw-ct)! - The MCP now return more detailed error message

  Before this change:
  SDKError: Failed to update cart

  After this change:
  SDKError: Failed to update cart: Failed to update cart by ID: The variant '2' with SKU '<blah>' of product '<blah>' does not contain a price for currency 'EUR' country 'DE', all customer groups and all channels.

### Patch Changes

- [#23](https://github.com/commercetools/mcp-essentials/pull/23) [`f56607f`](https://github.com/commercetools/mcp-essentials/commit/f56607fceb37af6f1d9c21585cf9241d722847e2) Thanks [@ajimae](https://github.com/ajimae)! - [Fix] Scope and Action Case Mismatch

## 2.0.0

### Major Changes

- [#15](https://github.com/commercetools/mcp-essentials/pull/15) [`8afdf31`](https://github.com/commercetools/mcp-essentials/commit/8afdf317ec92397e5a4b51d87bf2936135d25941) Thanks [@islam3zzat](https://github.com/islam3zzat)! - Add support for authenticating via existing `access_token`.

  Example:

  ```ts
  const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
    authConfig: {
      type: 'auth_token',
      accessToken: process.env.ACCESS_TOKEN!,
      projectKey: process.env.PROJECT_KEY!,
      authUrl: process.env.AUTH_URL!,
      apiUrl: process.env.API_URL!,
    },
    configuration: {
      actions: {
        products: {
          read: true,
          create: true,
          update: true,
        },
        project: {
          read: true,
        },
      },
    },
  });
  ```

  **BREAKING CHANGE**: The constructor signature of `CommercetoolsAgentEssentials` has changed to support more authentication types. See example below to learn what changed.

  Example:

  ```diff
  - const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
  -   clientId: process.env.CLIENT_ID!,
  -   clientSecret: process.env.CLIENT_SECRET!,
  -   projectKey: process.env.PROJECT_KEY!,
  -   authUrl: process.env.AUTH_URL!,
  -   apiUrl: process.env.API_URL!,
  -   configuration: {
  -     actions: {
  -       products: {
  -         read: true,
  -         create: true,
  -         update: true,
  -       },
  -       project: {
  -         read: true,
  -       },
  -     },
  -   },
  - });

  + const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
  +   authConfig: {
  +     type: 'client_credentials',
  +     clientId: process.env.CLIENT_ID!,
  +     clientSecret: process.env.CLIENT_SECRET!,
  +     projectKey: process.env.PROJECT_KEY!,
  +     authUrl: process.env.AUTH_URL!,
  +     apiUrl: process.env.API_URL!,
  +   },
  +   configuration: {
  +     actions: {
  +       products: {
  +         read: true,
  +         create: true,
  +         update: true,
  +       },
  +       project: {
  +         read: true,
  +       },
  +     },
  +   },
  + });
  ```

### Minor Changes

- [#9](https://github.com/commercetools/mcp-essentials/pull/9) [`c78c032`](https://github.com/commercetools/mcp-essentials/commit/c78c032a9fcdbfd3598d16774cdc449f146cc9b1) Thanks [@ajimae](https://github.com/ajimae)! - Add Streamable HTTP capabilities to Essentials MCP server

### Patch Changes

- [#11](https://github.com/commercetools/mcp-essentials/pull/11) [`3c53c39`](https://github.com/commercetools/mcp-essentials/commit/3c53c3908ed3f69f79b3df8bd709f215654de2c5) Thanks [@martinw-ct](https://github.com/martinw-ct)! - Fixes being able to import `import { CommercetoolsAgentEssentials } from "@commercetools/agent-essentials/langchain"` by adding the correct exports to the `package.json`.

## 1.0.0

### Major Changes

- [#3](https://github.com/commercetools/mcp-essentials/pull/3) [`5bd6b14`](https://github.com/commercetools/mcp-essentials/commit/5bd6b14c61ca0bd333f9a152575aae79885adee9) Thanks [@tdeekens](https://github.com/tdeekens)! - This is the initial release of the commerce MCP essentials and Agent essentials. This is an [Early access](https://docs.commercetools.com/offering/api-compatibility#early-access) release and we’d love to hear your feedback!

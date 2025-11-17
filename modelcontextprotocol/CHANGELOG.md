# @commercetools/mcp-essentials

## 2.4.0

### Minor Changes

- [#40](https://github.com/commercetools/mcp-essentials/pull/40) [`e854cc4`](https://github.com/commercetools/mcp-essentials/commit/e854cc4a775a866e64d8bd012aebe409aedd716d) Thanks [@ajimae](https://github.com/ajimae)! - [Feat][DEVX-654] Add Missing Critical Tools

- [#28](https://github.com/commercetools/mcp-essentials/pull/28) [`6eb40d5`](https://github.com/commercetools/mcp-essentials/commit/6eb40d55f36452e65a67b3d53d8017c6e76ec125) Thanks [@Trackerchum](https://github.com/Trackerchum)! - Resource response data transformation to tabular-like LLM formatting, with command-line flag to revert back to JSON.

- [#41](https://github.com/commercetools/mcp-essentials/pull/41) [`1e66969`](https://github.com/commercetools/mcp-essentials/commit/1e669696e619b496231c8449e87086f4f556b87a) Thanks [@ShipilA](https://github.com/ShipilA)! - Adding reviews to MCP tools

### Patch Changes

- Updated dependencies [[`e854cc4`](https://github.com/commercetools/mcp-essentials/commit/e854cc4a775a866e64d8bd012aebe409aedd716d), [`6eb40d5`](https://github.com/commercetools/mcp-essentials/commit/6eb40d55f36452e65a67b3d53d8017c6e76ec125), [`1e66969`](https://github.com/commercetools/mcp-essentials/commit/1e669696e619b496231c8449e87086f4f556b87a)]:
  - @commercetools/agent-essentials@3.4.0

## 2.3.0

### Minor Changes

- [#31](https://github.com/commercetools/mcp-essentials/pull/31) [`e21e319`](https://github.com/commercetools/mcp-essentials/commit/e21e3193baa3a2d83eafcea22d5c9181d8fea2f1) Thanks [@ajimae](https://github.com/ajimae)! - [Feat][MCP-8] Improve Tracing in MCP Server

- [#34](https://github.com/commercetools/mcp-essentials/pull/34) [`7736450`](https://github.com/commercetools/mcp-essentials/commit/773645010a8006b5f952fbbbc0c729d95ab45c4f) Thanks [@martinw-ct](https://github.com/martinw-ct)! - Added [fieldType](https://docs.commercetools.com/api/search-query-language#ctp:api:type:SearchFieldType) to search_products

  Necessary when sorting by attributes to avoid errors like: `SDKError: Failed to search products Field [variants.attributes.weight]: Type is missing`

### Patch Changes

- Updated dependencies [[`a82601b`](https://github.com/commercetools/mcp-essentials/commit/a82601b8ffe345d83db0c9d93bb70c411ba89f3d), [`e21e319`](https://github.com/commercetools/mcp-essentials/commit/e21e3193baa3a2d83eafcea22d5c9181d8fea2f1), [`1971f11`](https://github.com/commercetools/mcp-essentials/commit/1971f11cc5a5a702c055615e2804ccf4d996e08c), [`7736450`](https://github.com/commercetools/mcp-essentials/commit/773645010a8006b5f952fbbbc0c729d95ab45c4f)]:
  - @commercetools/agent-essentials@3.3.0

## 2.2.1

### Patch Changes

- Updated dependencies [[`899d731`](https://github.com/commercetools/mcp-essentials/commit/899d7319cd5c7f29bcefb45e5db5aa88c38bfe3c)]:
  - @commercetools/agent-essentials@3.2.0

## 2.2.0

### Minor Changes

- [#22](https://github.com/commercetools/mcp-essentials/pull/22) [`733f7fc`](https://github.com/commercetools/mcp-essentials/commit/733f7fc382fe1e87b3009f978201190f1fb198d2) Thanks [@islam3zzat](https://github.com/islam3zzat)! - Add dynamic tool loading feature.
  In this feature, if the number available tools exceeded `DYNAMIC_TOOL_LOADING_THRESHOLD` we'll only expose 5 tools:
  1. list_tools
  2. inject_tool
  3. execute_tool
  4. bulk_create
  5. bulk_update

  This will drastically reduce the amount of context we take from the client's LLM for tools' description and schema.

### Patch Changes

- Updated dependencies [[`b16df24`](https://github.com/commercetools/mcp-essentials/commit/b16df24a9d81c384fbb37b0c9cccaafc8c5616dc), [`733f7fc`](https://github.com/commercetools/mcp-essentials/commit/733f7fc382fe1e87b3009f978201190f1fb198d2)]:
  - @commercetools/agent-essentials@3.1.0

## 2.1.0

### Minor Changes

- [#20](https://github.com/commercetools/mcp-essentials/pull/20) [`80996f0`](https://github.com/commercetools/mcp-essentials/commit/80996f0469a23fba77c2ddaccfda397adc3884b6) Thanks [@martinw-ct](https://github.com/martinw-ct)! - The MCP now return more detailed error message

  Before this change:
  SDKError: Failed to update cart

  After this change:
  SDKError: Failed to update cart: Failed to update cart by ID: The variant '2' with SKU '<blah>' of product '<blah>' does not contain a price for currency 'EUR' country 'DE', all customer groups and all channels.

- [#17](https://github.com/commercetools/mcp-essentials/pull/17) [`3c5e8a9`](https://github.com/commercetools/mcp-essentials/commit/3c5e8a96d282135aa65d0cd02c208bb76b2d1cd7) Thanks [@ajimae](https://github.com/ajimae)! - [Feat][MCP-6] Scope Based Tools Filtering

### Patch Changes

- [#18](https://github.com/commercetools/mcp-essentials/pull/18) [`9a205aa`](https://github.com/commercetools/mcp-essentials/commit/9a205aae5289e712ebcc8241a161fbeb4caeabc8) Thanks [@islam3zzat](https://github.com/islam3zzat)! - Suppress dotenv logs to avoid pushing messages to the stdio.

- Updated dependencies [[`80996f0`](https://github.com/commercetools/mcp-essentials/commit/80996f0469a23fba77c2ddaccfda397adc3884b6), [`f56607f`](https://github.com/commercetools/mcp-essentials/commit/f56607fceb37af6f1d9c21585cf9241d722847e2), [`3c5e8a9`](https://github.com/commercetools/mcp-essentials/commit/3c5e8a96d282135aa65d0cd02c208bb76b2d1cd7)]:
  - @commercetools/agent-essentials@3.0.0

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

- Updated dependencies [[`c78c032`](https://github.com/commercetools/mcp-essentials/commit/c78c032a9fcdbfd3598d16774cdc449f146cc9b1), [`3c53c39`](https://github.com/commercetools/mcp-essentials/commit/3c53c3908ed3f69f79b3df8bd709f215654de2c5), [`8afdf31`](https://github.com/commercetools/mcp-essentials/commit/8afdf317ec92397e5a4b51d87bf2936135d25941)]:
  - @commercetools/agent-essentials@2.0.0

## 1.0.0

### Major Changes

- [#3](https://github.com/commercetools/mcp-essentials/pull/3) [`5bd6b14`](https://github.com/commercetools/mcp-essentials/commit/5bd6b14c61ca0bd333f9a152575aae79885adee9) Thanks [@tdeekens](https://github.com/tdeekens)! - This is the initial release of the commerce MCP essentials and Agent essentials. This is an [Early access](https://docs.commercetools.com/offering/api-compatibility#early-access) release and we’d love to hear your feedback!

### Patch Changes

- Updated dependencies [[`5bd6b14`](https://github.com/commercetools/mcp-essentials/commit/5bd6b14c61ca0bd333f9a152575aae79885adee9)]:
  - @commercetools/agent-essentials@1.0.0

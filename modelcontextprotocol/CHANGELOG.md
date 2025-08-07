# @commercetools/mcp-essentials

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

---
"@commercetools/mcp-essentials": major
"@commercetools/agent-essentials": major
---

Add support for authencation via existing AuthToken.

**BREAKING CHANGE**: The constructor signature has been updated. Please check the README for the new signature.


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

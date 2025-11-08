> [!IMPORTANT]
> Commerce MCP is provided free of charge as an early access service. Our Service Level Agreement do not apply to Commerce MCP, and it is provided on an "as-is" basis.

# commercetools MCP Essentials

This repository contains both a MCP server (which you can integrate with many MCP clients) and agent essentials that can be used from within agent frameworks.

# commercetools Model Context Protocol

## Setup

To run the commercetools MCP server using npx, use the following command:

### Client Credentials Authentication (Default)

```bash
# To set up all available tools (authType is optional, defaults to client_credentials)
npx -y @commercetools/mcp-essentials --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

# Explicitly specify client_credentials (optional)
npx -y @commercetools/mcp-essentials --tools=all --authType=client_credentials --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

# To set up all read-only tools
npx -y @commercetools/mcp-essentials --tools=all.read --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

```

```bash
# To set up specific tools
npx -y @commercetools/mcp-essentials --tools=products.read,products.create --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

### Access Token Authentication

```bash
# To set up all available tools with access token
npx -y @commercetools/mcp-essentials --tools=all --authType=auth_token --accessToken=ACCESS_TOKEN --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL

# To set up all read-only tools with access token
npx -y @commercetools/mcp-essentials --tools=all.read --authType=auth_token --accessToken=ACCESS_TOKEN --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

Make sure to replace `CLIENT_ID`, `CLIENT_SECRET`, `PROJECT_KEY`, `AUTH_URL`, `API_URL`, and `ACCESS_TOKEN` with your actual values. If using the customerId parameter, replace `CUSTOMER_ID` with the actual customer ID. Alternatively, you could set the API_KEY in your environment variables.

### Authentication Options

The MCP server supports two authentication methods:

| Authentication Type            | Required Arguments                                         | Description                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `client_credentials` (default) | `--clientId`, `--clientSecret`                             | Uses API client credentials for authentication. `--authType=client_credentials` is optional since this is the default                |
| `auth_token`                   | `--accessToken`, (optional `--clientId`, `--clientSecret`) | Uses a pre-existing access token for authentication. Requires `--authType=auth_token` and optional `--clientId` and `--clientSecret` |

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

#### Client Credentials Authentication

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "-y",
        "@commercetools/mcp-essentials@latest",
        "--tools=all",
        "--clientId=CLIENT_ID",
        "--clientSecret=CLIENT_SECRET",
        "--authUrl=AUTH_URL",
        "--projectKey=PROJECT_KEY",
        "--apiUrl=API_URL",
        "--dynamicToolLoadingThreshold=30"
      ]
    }
  }
}
```

**Note**: You can optionally add `"--authType=client_credentials"` to be explicit, but it's not required since this is the default.

#### Access Token Authentication

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "-y",
        "@commercetools/mcp-essentials@latest",
        "--tools=all",
        "--authType=auth_token",
        "--accessToken=ACCESS_TOKEN",
        "--authUrl=AUTH_URL",
        "--projectKey=PROJECT_KEY",
        "--apiUrl=API_URL"
      ]
    }
  }
}
```

**Alternative: To use only read-only tools, replace `"--tools=all"` with `"--tools=all.read"`**

## Available tools

### Special Tool Options

| Tool       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `all`      | Enable all available tools (read, create, and update operations) |
| `all.read` | Enable all read-only tools (safe for read-only access)           |

### Individual Tools

| Tool                       | Description                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `products.read`            | [Read product information](https://docs.commercetools.com/api/projects/products#query-products)                          |
| `products.create`          | [Create product information](https://docs.commercetools.com/api/projects/products#create-product)                        |
| `products.update`          | [Update product information](https://docs.commercetools.com/api/projects/products#update-product)                        |
| `project.read`             | [Read project information](https://docs.commercetools.com/api/projects/project#get-project)                              |
| `product-search.read`      | [Search products](https://docs.commercetools.com/api/projects/products#search-products)                                  |
| `category.read`            | [Read category information](https://docs.commercetools.com/api/projects/categories#get-category-by-id)                   |
| `category.create`          | [Create category](https://docs.commercetools.com/api/projects/categories#create-category)                                |
| `category.update`          | [Update category](https://docs.commercetools.com/api/projects/categories#update-category)                                |
| `channel.read`             | [Read channel information](https://docs.commercetools.com/api/projects/channels#query-channels)                          |
| `channel.create`           | [Create channel](https://docs.commercetools.com/api/projects/channels#create-channel)                                    |
| `channel.update`           | [Update channel information](https://docs.commercetools.com/api/projects/channels#update-channel)                        |
| `product-selection.read`   | [Read product selection](https://docs.commercetools.com/api/projects/product-selections#get-productselection-by-id)      |
| `product-selection.create` | [Create product selection](https://docs.commercetools.com/api/projects/product-selections#create-a-productselection)     |
| `product-selection.update` | [Update product selection](https://docs.commercetools.com/api/projects/product-selections#update-productselection)       |
| `order.read`               | [Read order information](https://docs.commercetools.com/api/projects/orders#get-order-by-id)                             |
| `order.create`             | [Create order](https://docs.commercetools.com/api/projects/orders#create-order-from-cart) (from cart, quote, import)     |
| `order.update`             | [Update order information](https://docs.commercetools.com/api/projects/orders#update-order)                              |
| `cart.read`                | [Read cart information](https://docs.commercetools.com/api/projects/carts#get-cart-by-id)                                |
| `cart.create`              | [Create cart](https://docs.commercetools.com/api/projects/carts#create-cart)                                             |
| `cart.update`              | [Update cart information](https://docs.commercetools.com/api/projects/carts#update-cart)                                 |
| `customer.read`            | [Read customer information](https://docs.commercetools.com/api/projects/customers#query-customers)                       |
| `customer.create`          | [Create customer](https://docs.commercetools.com/api/projects/customers#create-customer)                                 |
| `customer.update`          | [Update customer information](https://docs.commercetools.com/api/projects/customers#update-customer)                     |
| `customer-group.read`      | [Read customer group](https://docs.commercetools.com/api/projects/customerGroups#get-customergroup)                      |
| `customer-group.create`    | [Create customer group](https://docs.commercetools.com/api/projects/customerGroups#create-customergroup)                 |
| `customer-group.update`    | [Update customer group](https://docs.commercetools.com/api/projects/customerGroups#update-customergroup)                 |
| `quote.read`               | [Read quote information](https://docs.commercetools.com/api/projects/quotes#get-quote-by-id)                             |
| `quote.create`             | [Create quote](https://docs.commercetools.com/api/projects/quotes#create-quote-from-staged-quote)                        |
| `quote.update`             | [Update quote information](https://docs.commercetools.com/api/projects/quotes#update-quote)                              |
| `quote-request.read`       | [Read quote request](https://docs.commercetools.com/api/projects/quote-requests#get-quoterequest-by-id)                  |
| `quote-request.create`     | [Create quote request](https://docs.commercetools.com/api/projects/quote-requests#create-quoterequest)                   |
| `quote-request.update`     | [Update quote request](https://docs.commercetools.com/api/projects/quote-requests#update-quoterequest)                   |
| `staged-quote.read`        | [Read staged quote](https://docs.commercetools.com/api/projects/staged-quotes#get-stagedquote-by-id)                     |
| `staged-quote.create`      | [Create staged quote](https://docs.commercetools.com/api/projects/staged-quotes#create-stagedquote)                      |
| `staged-quote.update`      | [Update staged quote](https://docs.commercetools.com/api/projects/staged-quotes#update-stagedquote)                      |
| `standalone-price.read`    | [Read standalone price](https://docs.commercetools.com/api/projects/standalone-prices#get-standaloneprice-by-id)         |
| `standalone-price.create`  | [Create standalone price](https://docs.commercetools.com/api/projects/standalone-prices#create-standaloneprice)          |
| `standalone-price.update`  | [Update standalone price](https://docs.commercetools.com/api/projects/standalone-prices#update-standaloneprice)          |
| `product-discount.read`    | [Read product discount](https://docs.commercetools.com/api/projects/productDiscounts#get-productdiscount-by-id)          |
| `product-discount.create`  | [Create product discount](https://docs.commercetools.com/api/projects/productDiscounts#create-productdiscount)           |
| `product-discount.update`  | [Update product discount](https://docs.commercetools.com/api/projects/productDiscounts#update-productdiscount)           |
| `cart-discount.read`       | [Read cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#get-cartdiscount-by-id)                   |
| `cart-discount.create`     | [Create cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#create-cartdiscount)                    |
| `cart-discount.update`     | [Update cart discount](https://docs.commercetools.com/api/projects/cartDiscounts#update-cartdiscount)                    |
| `discount-code.read`       | [Read discount code information](https://docs.commercetools.com/api/projects/discount-codes#get-discountcode-by-id)      |
| `discount-code.create`     | [Create discount code](https://docs.commercetools.com/api/projects/discount-codes#create-discountcode)                   |
| `discount-code.update`     | [Update discount code information](https://docs.commercetools.com/api/projects/discount-codes#update-discountcode)       |
| `product-type.read`        | [Read product type](https://docs.commercetools.com/api/projects/productTypes#get-producttype-by-id)                      |
| `product-type.create`      | [Create product type](https://docs.commercetools.com/api/projects/productTypes#create-producttype)                       |
| `product-type.update`      | [Update product type](https://docs.commercetools.com/api/projects/productTypes#update-producttype)                       |
| `bulk.create`              | Create entities in bulk                                                                                                  |
| `bulk.update`              | Update entities in bulk                                                                                                  |
| `inventory.read`           | [Read inventory information](https://docs.commercetools.com/api/projects/inventory#get-inventoryentry-by-id)             |
| `inventory.create`         | [Create inventory](https://docs.commercetools.com/api/projects/inventory#create-inventoryentry)                          |
| `inventory.update`         | [Update inventory information](https://docs.commercetools.com/api/projects/inventory#update-inventoryentry)              |
| `store.read`               | [Read store](https://docs.commercetools.com/api/projects/stores#get-store-by-id)                                         |
| `store.create`             | [Create store](https://docs.commercetools.com/api/projects/stores#create-store)                                          |
| `store.update`             | [Update store](https://docs.commercetools.com/api/projects/stores#update-store)                                          |
| `business-unit.read`       | [Read business unit](https://docs.commercetools.com/api/projects/business-units#get-businessunit-by-id)                  |
| `business-unit.create`     | [Create business unit](https://docs.commercetools.com/api/projects/business-units#create-businessunit)                   |
| `business-unit.update`     | [Update business unit](https://docs.commercetools.com/api/projects/business-units#update-businessunit)                   |
| `payments.read`            | [Read payment information](https://docs.commercetools.com/api/projects/payments#get-payment-by-id)                       |
| `payments.create`          | [Create payment](https://docs.commercetools.com/api/projects/payments#create-payment)                                    |
| `payments.update`          | [Update payment information](https://docs.commercetools.com/api/projects/payments#update-actions)                        |
| `tax-category.read`        | [Read tax category information](https://docs.commercetools.com/api/projects/taxCategories#get-taxcategory-by-id)         |
| `tax-category.create`      | [Create tax category](https://docs.commercetools.com/api/projects/taxCategories#create-taxcategory)                      |
| `tax-category.update`      | [Update tax category information](https://docs.commercetools.com/api/projects/taxCategories#update-taxcategory)          |
| `shipping-methods.read`    | [Read shipping method information](https://docs.commercetools.com/api/projects/shippingMethods#get-shippingmethod-by-id) |
| `shipping-methods.create`  | [Create shipping method](https://docs.commercetools.com/api/projects/shippingMethods#create-shippingmethod)              |
| `shipping-methods.update`  | [Update shipping method information](https://docs.commercetools.com/api/projects/shippingMethods#update-shippingmethod)  |
| `zones.read`               | [Read zone information](https://docs.commercetools.com/api/projects/zones#get-zone-by-id)                                |
| `zones.create`             | [Create zone](https://docs.commercetools.com/api/projects/zones#create-zone)                                             |
| `zones.update`             | [Update zone information](https://docs.commercetools.com/api/projects/zones#update-zone)                                 |
| `recurring-orders.read`    | [Read recurring order information](https://docs.commercetools.com/api/projects/recurring-orders#get-recurringorder-by-id) |
| `recurring-orders.create`  | [Create recurring order](https://docs.commercetools.com/api/projects/recurring-orders#create-recurringorder)              |
| `recurring-orders.update`  | [Update recurring order information](https://docs.commercetools.com/api/projects/recurring-orders#update-recurringorder) |
| `shopping-lists.read`      | [Read shopping list information](https://docs.commercetools.com/api/projects/shoppingLists#get-shoppinglist-by-id)     |
| `shopping-lists.create`    | [Create shopping list](https://docs.commercetools.com/api/projects/shoppingLists#create-shoppinglist)                     |
| `shopping-lists.update`    | [Update shopping list information](https://docs.commercetools.com/api/projects/shoppingLists#update-shoppinglist)        |
| `extensions.read`          | [Read extension information](https://docs.commercetools.com/api/projects/extensions#get-extension-by-id)              |
| `extensions.create`        | [Create extension](https://docs.commercetools.com/api/projects/extensions#create-an-extension)                           |
| `extensions.update`        | [Update extension information](https://docs.commercetools.com/api/projects/extensions#update-an-extension)               |
| `subscriptions.read`       | [Read subscription information](https://docs.commercetools.com/api/projects/subscriptions#get-subscription-by-id)        |
| `subscriptions.create`     | [Create subscription](https://docs.commercetools.com/api/projects/subscriptions#create-a-subscription)                   |
| `subscriptions.update`     | [Update subscription information](https://docs.commercetools.com/api/projects/subscriptions#update-subscription)        |
| `payment-methods.read`    | [Read payment method information](https://docs.commercetools.com/api/projects/paymentMethods#get-paymentmethod-by-id)  |
| `payment-methods.create`   | [Create payment method](https://docs.commercetools.com/api/projects/paymentMethods#create-paymentmethod)                  |
| `payment-methods.update`   | [Update payment method information](https://docs.commercetools.com/api/projects/paymentMethods#update-paymentmethod)      |
| `product-tailoring.read`  | [Read product tailoring information](https://docs.commercetools.com/api/projects/productTailoring#get-producttailoring-by-id) |
| `product-tailoring.create`| [Create product tailoring](https://docs.commercetools.com/api/projects/productTailoring#create-producttailoring)         |
| `product-tailoring.update`| [Update product tailoring information](https://docs.commercetools.com/api/projects/productTailoring#update-producttailoring)|
| `custom-objects.read`     | [Read custom object information](https://docs.commercetools.com/api/projects/custom-objects#get-customobject-by-container-and-key) |
| `custom-objects.create`  | [Create custom object](https://docs.commercetools.com/api/projects/custom-objects#create-or-update-customobject)         |
| `custom-objects.update`  | [Update custom object information](https://docs.commercetools.com/api/projects/custom-objects#create-or-update-customobject)|
| `types.read`             | [Read type information](https://docs.commercetools.com/api/projects/types#get-type-by-id)                                    |
| `types.create`           | [Create type](https://docs.commercetools.com/api/projects/types#create-type)                                                   |
| `types.update`           | [Update type information](https://docs.commercetools.com/api/projects/types#update-type)                                       |

To view information on how to develop the MCP server, see [this README](/modelcontextprotocol/README.md).

## Dynamic Tool Loading

The MCP server includes a dynamic tool loading feature that automatically switches to a more efficient loading strategy when the number of enabled tools exceeds a configurable threshold. This helps optimize performance and reduce context usage when working with large numbers of tools.

### How it works

- **Default threshold**: 30 tools
- **Behavior**: When the number of enabled tools exceeds the threshold, the server switches to dynamic tool loading

### Configuration

You can configure the dynamic tool loading threshold in two ways:

#### Command Line Argument

```bash
npx -y @commercetools/mcp-essentials --tools=all --dynamicToolLoadingThreshold=50 --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

#### Environment Variable

```bash
export DYNAMIC_TOOL_LOADING_THRESHOLD=50
npx -y @commercetools/mcp-essentials --tools=all --clientId=CLIENT_ID --clientSecret=CLIENT_SECRET --projectKey=PROJECT_KEY --authUrl=AUTH_URL --apiUrl=API_URL
```

### Example with Claude Desktop

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": [
        "-y",
        "@commercetools/mcp-essentials@latest",
        "--tools=all",
        "--clientId=CLIENT_ID",
        "--clientSecret=CLIENT_SECRET",
        "--authUrl=AUTH_URL",
        "--projectKey=PROJECT_KEY",
        "--apiUrl=API_URL",
        "--dynamicToolLoadingThreshold=25"
      ]
    }
  }
}
```

# MCP Essentials

The commercetools MCP Essentials enables popular agent frameworks including LangChain, Vercel's AI SDK, and Model Context Protocol (MCP) to integrate with APIs through function calling. The library is not exhaustive of the entire commercetools API. It includes support for TypeScript and is built directly on top of the [Node][node-sdk] SDK.

Included below are basic instructions, but refer to the [TypeScript](/typescript) package for more information.

## TypeScript

### Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```
npm install @commercetools/agent-essentials
```

#### Requirements

- Node 18+

### Usage

The library needs to be configured with your commercetools project credentials which are available in your [Merchant center](https://docs.commercetools.com/getting-started/create-api-client).
**Important**: Ensure that the API client credentials have the necessary scopes aligned with the actions you configure in the agent essentials. For example, if you configure `products: { read: true }`, your API client must have the `view_products` scope.
Additionally, `configuration` enables you to specify the types of actions that can be taken using the agent essentials.

### Client Credentials Authentication (Default)

```typescript
import { CommercetoolsAgentEssentials } from "@commercetools/agent-essentials/langchain";

const commercetoolsAgentEssentials = await CommercetoolsAgentEssentials.create({
  authConfig: {
    type: 'client_credentials',
    clientId: process.env.CLIENT_ID!,,
    clientSecret: process.env.CLIENT_SECRET!,,
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

### Access Token Authentication

```typescript
import { CommercetoolsAgentEssentials } from "@commercetools/agent-essentials/langchain";

const commercetoolsAgentEssentials = await CommercetoolsAgentEssentials.create({
  authConfig: {
    type: "auth_token",
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

#### Tools

The agent essentials work with LangChain and Vercel's AI SDK and can be passed as a list of tools. For example:

```typescript
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

const tools = commercetoolsAgentEssentials.getTools();

const agent = await createStructuredChatAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});
```

## Model Context Protocol

The commercetools MCP Essentials also supports setting up your own MCP server. For example:

```typescript
import { CommercetoolsAgentEssentials } from "@commercetools/agent-essentials/modelcontextprotocol";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = await CommercetoolsAgentEssentials.create({
  authConfig: {
    type: 'client_credentials',
    clientId: process.env.CLIENT_ID!,,
    clientSecret: process.env.CLIENT_SECRET!,,
    projectKey: process.env.PROJECT_KEY!,
    authUrl: process.env.AUTH_URL!,
    apiUrl: process.env.API_URL!,
  },
  configuration: {
    actions: {
      products: {
        read: true,
      },
      cart: {
        read: true,
        create: true,
        update: true,
      },
    },
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("My custom commercetools MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

#### getTools()

Returns the current set of available tools that can be used with LangChain, AI SDK, or other agent frameworks:

```typescript
const tools = commercetoolsAgentEssentials.getTools();
```

#### Custom Tools

The self managed `@commercetools/agent-essentials` includes supports for custom tools. A list of custom tools implementations can be passed over and registered at runtime by the bootstrapping MCP server. This is especially useful when the intended tool is not yet implemented into the MCP essentials or to give users complete control and customization of their tools behaviour and how it interact with the underlying LLM.

usage

```typescript
import { CommercetoolsAgentEssentials } from "@commercetools/agent-essentials/modelcontextprotocol";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = await CommercetoolsAgentEssentials.create({
  authConfig: {...},
  configuration: {
    customTools: [
      {
        name: "Get Project",
        method: "get_project",
        description: `This tool will fetch information about a commercetools project.\n\n
           This tool will accept a project and fetch information about the provided key. \n\n
          `, // It is important that this description is well details and explicitly descripts what this tool does and the paramenters it receieves/
        parameters: z.object({
          projectKey: z
            .string()
            .optional()
            .describe(
              "The key of the project to read. If not provided, the current project will be used."
            ),
        }),
        actions: {},
        execute: async (args: { projectKey: string }, api: ApiRoot) => {
          // already existing functions can be used here e.g const response = await import('ctService').getProject('demo-project-key-a7fc1182');
          const response = await api.withProjectKey(args).get().execute();
          return JSON.stringify(response);
        },
      },
      ...
    ],
    actions: {...},
  },
});
...
```

### Streamable HTTP MCP server

As of version `v2.0.0` of the `@commercetools/mcp-essentials` MCP server now supports Streamable HTTP (remote) server.

```typescript
npx -y @commercetools/mcp-essentials \
  --tools=all \
  --authType=client_credentials \
  --clientId=CLIENT_ID \
  --clientSecret=CLIENT_SECRET \
  --projectKey=PROJECT_KEY \
  --authUrl=AUTH_URL \
  --apiUrl=API_URL \
  --remote=true \
  --stateless=true \
  --port=8888
```

You can connect to the running remote server using Claude by specifying the below in the `claude_desktop_config.json` file.

```json
{
  "mcpServers": {
    "commercetools": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:8888/mcp", "..."]
    }
  }
}
```

You can also use the Streamable HTTP server with the Agent Essentials like an SDK and develop on it.

```typescript
import express from "express";
import {
  CommercetoolsAgentEssentials,
  CommercetoolsAgentEssentialsStreamable,
} from "@commercetools/agent-essentials/modelcontextprotocol";

const expressApp = express();

const getAgentServer = async () => {
  return CommercetoolsAgentEssentials.create({
    authConfig: {
      type: "client_credentials",
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      projectKey: process.env.PROJECT_KEY!,
      authUrl: process.env.AUTH_URL!,
      apiUrl: process.env.API_URL!,
    },
    configuration: {
      actions: {
        products: {
          read: true,
        },
        cart: {
          read: true,
          create: true,
          update: true,
        },
      },
    },
  });
};

const serverStreamable = new CommercetoolsAgentEssentialsStreamable({
  stateless: false, // make the MCP server stateless/stateful
  server: getAgentServer,
  app: expressApp, // optional express app instance
  streamableHttpOptions: {
    sessionIdGenerator: undefined,
  },
});

serverStreamable.listen(8888, function () {
  console.log("listening on 8888");
});
```

Without using the `CommercetoolsAgentEssentials`, you can directly use only the `CommercetoolsAgentEssentialsStreamable` class and the agent server will be bootstrapped internally.

```typescript
import { CommercetoolsAgentEssentialsStreamable } from "@commercetools/agent-essentials/modelcontextprotocol";
import express from "express";

const expressApp = express();

const server = new CommercetoolsAgentEssentialsStreamable({
  authConfig: {
    type: "client_credentials",
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    projectKey: process.env.PROJECT_KEY!,
    authUrl: process.env.AUTH_URL!,
    apiUrl: process.env.API_URL!,
  },
  configuration: {
    actions: {
      project: {
        read: true,
      },
      // other tools can go here
    },
  },

  stateless: false,
  app: expressApp,
  streamableHttpOptions: {
    sessionIdGenerator: undefined,
  },
});

server.listen(8888, function () {
  console.log("listening on 8888");
});
```

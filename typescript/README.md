# commercetools MCP Essentials - TypeScript

## Installation

You don't need this source code unless you want to modify the package. If you just
want to use the package run:

```bash
yarn install @commercetools/agent-essentials
```

or using `npm` package manager

```bash
npm install @commercetools/agent-essentials
```

The commercetools MCP Essentials enables popular agent frameworks including LangChain, Vercel's AI SDK, and the [Model Context Protocol (MCP)](https://modelcontextprotocol.com/) to integrate with commercetools APIs through function calling.

### Requirements

- Node 18+

# Essentials Libraries

## Agent Essentials

The commercetools Agent Essentials can be used to bootstrap a custom MCP server.

Example:

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

## AI SDK

This is used to execute a specific prompts using a specific model (in this case the OpenAI 4o model)

Example:

```typescript
import {generateText} from 'ai';
import {openai} from '@ai-sdk/openai';
import {CommercetoolsAgentEssentials} from '@commercetools/agent-essentials/ai-sdk';

const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
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

const model = openai('gpt-4o');
const tools = commercetoolsAgentEssentials.getTools();

(async function () {
  console.log('--- Starting commercetools AI SDK Task Sequence ---');
  // Original Task: List all products
  const initialPrompt = 'List all products in the commercetools project. This is the first step.';
  console.log(`\\nExecuting: ${initialPrompt}`);

  const resultInitial = await generateText({
    model: model,
    tools: {...tools},
    prompt: initialPrompt,
    maxSteps: 5
  });

  console.log('--- Response from "List all products" ---');
  console.log(resultInitial.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );
})();
```

## LangChain

The langchain essentials library helps to setup an agent using a specific model suitable for machine to machine communication or for chatbot development/integration.

Example:

```typescript
import {AgentExecutor, createStructuredChatAgent} from 'langchain/agents';
import {CommercetoolsAgentEssentials} from '@commercetools/agent-essentials/langchain';

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

## Mastra

Just like the `@commercetools/agent-essentials/ai-sdk` the `@commercetools/agent-essentials/mastra` essentials library can be used to execute multi-step commands/prompts.

Example:

```typescript
require('dotenv').config();
import {Agent} from '@mastra/core/agent';
import {CommercetoolsAgentEssentials} from '@commercetools/agent-essentials/mastra';

const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
  authConfig: {
    type: 'client_credentials',
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    authUrl: process.env.AUTH_URL!,
    projectKey: process.env.PROJECT_KEY!,
    apiUrl: process.env.API_URL!,
  },
  configuration: {
    actions: {
      products: {
        read: true,
        create: true,
        update: true,
      },
      'product-type': {
        read: true,
        create: true,
      },
    },
  },
});

const agent = new Agent({
  name: 'CommercetoolsAgent',
  instructions:
    'You are a helpful agent that can manage products and product types in commercetools. Use the available tools to help users with their commerce operations.',
  tools: commercetoolsAgentEssentials.getTools(),
});

(async () => {
  console.log('--- Starting Commercetools Mastra Agent Task Sequence ---');

  // Task 1: List all products
  const task1Prompt =
    'List all products in the commercetools project. This is the first step.';
  console.log(`\nExecuting: ${task1Prompt}`);
  const result1 = await agent.step({
    messages: [
      {
        role: 'user',
        content: task1Prompt,
      },
    ],
  });
  console.log('--- Response from "List all products" ---');
  console.log(result1.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 2: List product types
  const task2Prompt = `Based on the products listed above, list all product types available in the project. I need this information to select a product type for creating a product in the next step.`;
  console.log(`\nExecuting: ${task2Prompt}`);
  const result2 = await agent.step({
    messages: [
      ...result1.messages,
      {
        role: 'user',
        content: task2Prompt,
      },
    ],
  });
  console.log('--- Response from "List product types" (Task 2) ---');
  console.log(result2.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 3: Create a test product
  const productName = `Mastra Test Product ${Math.floor(Date.now() / 1000)}`;
  const productKey = `MASTRA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const productSku = `MTP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const productSlug = productName.toLowerCase().replace(/\s+/g, '-');

  const task3Prompt = `Based on the product types listed above, please create a new product with the following details:
- Name: "${productName}"
- Key: "${productKey}"
- Slug (en): "${productSlug}"
- SKU: "${productSku}"
- Description: "This product was created automatically by a Mastra AI agent."
- Ensure the product is published if possible during creation.

Please provide the ID of this newly created product in your response.`;
  console.log(`\nExecuting: ${task3Prompt}`);
  const result3 = await agent.step({
    messages: [
      ...result2.messages,
      {
        role: 'user',
        content: task3Prompt,
      },
    ],
  });
  console.log('--- Response from "Create test product" (Task 3) ---');
  console.log(result3.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 4: Update the product
  const updateDescription =
    'This product was created and then updated automatically by a Mastra AI agent.';
  const task4Prompt = `Using the ID of the product that was just created (from the previous step), please update it.
Change its description to "${updateDescription}"`;
  console.log(`\nExecuting: ${task4Prompt}`);
  const result4 = await agent.step({
    messages: [
      ...result3.messages,
      {
        role: 'user',
        content: task4Prompt,
      },
    ],
  });
  console.log('--- Response from "Update the product" (Task 4) ---');
  console.log(result4.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  console.log('\n--- Commercetools Mastra Agent Task Sequence Finished ---');
})().catch((error) => {
  console.error('An error occurred during the async execution:', error);
});
```

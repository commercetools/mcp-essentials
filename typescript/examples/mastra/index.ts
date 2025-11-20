require('dotenv').config();
import {Agent} from '@mastra/core/agent';
import {CommercetoolsAgentEssentials} from '../../src/mastra/index';

const essentials = new CommercetoolsAgentEssentials({
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
  tools: essentials.getTools(),
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

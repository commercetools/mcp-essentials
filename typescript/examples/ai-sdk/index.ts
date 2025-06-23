import {CommercetoolsAgentToolkit} from '../../src/ai-sdk/index';
import {openai} from '@ai-sdk/openai';
import {generateText} from 'ai';

require('dotenv').config();

const commercetoolsAgentToolkit = new CommercetoolsAgentToolkit({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  authUrl: process.env.AUTH_URL!,
  projectKey: process.env.PROJECT_KEY!,
  apiUrl: process.env.API_URL!,
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

const model = openai('gpt-4o');

(async () => {
  console.log('--- Starting commercetools AI SDK Task Sequence ---');

  // Original Task: List all products
  const initialPrompt =
    'List all products in the commercetools project. This is the first step.';
  console.log(`\\nExecuting: ${initialPrompt}`);
  const resultInitial = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 5,
    prompt: initialPrompt,
  });
  console.log('--- Response from "List all products" ---');
  console.log(resultInitial.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 1: List the product types
  const prompt1 = `Context from previous step (listing products): "${resultInitial.text}".\n\nNow, based on that, list all product types available in the project. I will need this information to select a product type for creating a product in the next step.`;
  console.log(`\\nExecuting: ${prompt1}`);
  const result1 = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 5,
    prompt: prompt1,
  });
  console.log('--- Response from "List product types" (Task 1) ---');
  console.log(result1.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 2 & 3: Take product type and create a fake product
  const productTypeName = `Auto-Created Product Type ${Math.floor(Date.now() / 1000)}`;
  const productTypeKey = `auto_created_pt_${Math.random().toString(36).substring(2, 9)}`;
  const productName = `Automated Test Product ${Math.floor(Date.now() / 1000)}`;
  const productKey = `ATPK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  const productSku = `ATP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const productSlug = productName.toLowerCase().replace(/\s+/g, '-');

  const prompt2 = `Context from previous step (listing product types): "${result1.text}".\n\nBased on the list of product types you (may have) provided in the previous step (see context above), check if any product types were returned.

If product types WERE found:
Please take the first product type from that list.

If NO product types were found (or the list was empty):
Please create a new product type with the following details:
- Name: "${productTypeName}"
- Key: "${productTypeKey}"
- Description: "This product type was automatically created because no existing types were found."

After you have either selected the first existing product type OR created a new one, please use that product type to create a new product with the following details:
- Name: "${productName}"
- Key: "${productKey}"
- Slug (en): "${productSlug}"
- SKU: "${productSku}"
- Description: "This product was created automatically by an AI agent using an available or auto-created product type."
- Ensure the product is published if possible during creation.

I will need the ID of this newly created product AND the ID or key of the product type used (whether it was pre-existing or newly created) for subsequent operations. Please make sure these details are clear in your response or tool output.`;
  console.log(`\\nExecuting: ${prompt2}`);
  const result2 = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 10,
    prompt: prompt2,
  });
  console.log('--- Response from "Create fake product" (Task 3) ---');
  console.log(result2.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 4: Read the product
  const prompt3 = `Context from previous step (product creation): "${result2.text}".\n\nYou should have just created a product (details in context above). Please use the ID of the product you just created.\nRead that product's details. I need to confirm its creation and current state before attempting an update.`;
  console.log(`\\nExecuting: ${prompt3}`);
  const result3 = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 5,
    prompt: prompt3,
  });
  console.log('--- Response from "Read the product" (Task 4) ---');
  console.log(result3.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 5: Update the product
  const prompt4 = `Context from previous step (reading the product): "${result3.text}".\n\nExcellent. Now, using the ID of the product that was just created and then read (details in context above), please update it.\nChange its name to "Automated Test Product ${Math.floor(Date.now() / 1000)} (Updated)"\nand update its description to "This product was created and then updated automatically by an AI agent."`;
  console.log(`\\nExecuting: ${prompt4}`);
  const result4 = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 10,
    prompt: prompt4,
  });
  console.log('--- Response from "Update the product" (Task 5) ---');
  console.log(result4.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // Task 6: Publish the product (after update)
  const prompt5 = `Context from a previous step (reading the product): "${result3.text}".\n\nUsing the ID of the product that was just updated in the previous step (details in context above), please publish this product. If it was already published, confirm its published state.`;
  console.log(`\\nExecuting: ${prompt5}`);
  const result5 = await generateText({
    model: model,
    tools: {...commercetoolsAgentToolkit.getTools()},
    maxSteps: 5,
    prompt: prompt5,
  });
  console.log('--- Response from "Publish the product" (Task 6) ---');
  console.log(result5.text);
  console.log(
    '--------------------------------------------------------------------------------'
  );

  console.log('\\n--- commercetools AI SDK Task Sequence Finished ---');
})().catch((error) => {
  console.error('An error occurred during the async execution:', error);
});

import {CommercetoolsAgentToolkit} from '../../src/langchain/index';
import {ChatOpenAI} from '@langchain/openai';
import type {ChatPromptTemplate} from '@langchain/core/prompts';
import {pull} from 'langchain/hub';
import {AgentExecutor, createStructuredChatAgent} from 'langchain/agents';
import {HumanMessage, AIMessage} from '@langchain/core/messages';

require('dotenv').config();

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0,
});

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

(async (): Promise<void> => {
  console.log(
    '--- Starting commercetools Langchain Agent Task Sequence (with Chat History) ---'
  );

  const promptTemplate = await pull<ChatPromptTemplate>(
    'hwchase17/structured-chat-agent'
  );

  const tools = commercetoolsAgentToolkit.getTools();

  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt: promptTemplate,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: true,
  });

  const chatHistory: (HumanMessage | AIMessage)[] = [];
  let previousStepOutputForLogging = '';

  type AgentResult = {
    output: string | null | undefined | object;
    intermediate_steps?: Array<{
      action: {tool: string; toolInput: any; log: string};
      observation: string;
    }>;
    [key: string]: any;
  };

  const recordAndLog = (promptText: string, agentResult: AgentResult) => {
    let finalOutput: string;
    if (typeof agentResult.output === 'string') {
      finalOutput = agentResult.output;
    } else if (
      typeof agentResult.output === 'object' &&
      agentResult.output !== null
    ) {
      finalOutput = JSON.stringify(agentResult.output);
    } else {
      finalOutput = 'Agent action completed. No textual output.';
    }

    previousStepOutputForLogging = finalOutput;
    chatHistory.push(new HumanMessage(promptText));
    chatHistory.push(new AIMessage(finalOutput));

    console.log('--- Agent Final Output ---');
    console.log(finalOutput);
    // console.log("Agent Result:\n", agentResult);
    if (
      agentResult.intermediateSteps &&
      agentResult.intermediateSteps.length > 0
    ) {
      console.log('--- Intermediate Steps ---');
      agentResult.intermediateSteps.forEach((step: any, index: number) => {
        console.log(`Step ${index + 1}:`);
        console.log(`  Thought: ${step.action.log.trim()}`);
        console.log(`  Tool Used: ${step.action.tool}`);
        console.log(
          `  Tool Input: ${typeof step.action.toolInput === 'string' ? step.action.toolInput : JSON.stringify(step.action.toolInput)}`
        );
        console.log(`  Tool Response: ${step.observation}`);
      });
    }
    console.log(
      '--------------------------------------------------------------------------------'
    );
  };

  const initialPromptText =
    'List all products in the commercetools project. This is the first step.';
  console.log(`\nExecuting: ${initialPromptText}`);
  const resultInitial = (await agentExecutor.invoke({
    input: initialPromptText,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "List all products" ---');
  recordAndLog(initialPromptText, resultInitial);

  const prompt1Text =
    'List all product types available in the project. I will need this information to select a product type for creating a product in the future (not now).';
  console.log(`\nExecuting: ${prompt1Text}`);
  const result1 = (await agentExecutor.invoke({
    input: prompt1Text,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "List product types" (Task 1) ---');
  recordAndLog(prompt1Text, result1);

  const productTypeName = `Auto-Created Product Type ${Math.floor(Date.now() / 1000)}`;
  const productTypeKey = `auto_created_pt_${Math.random().toString(36).substring(2, 9)}`;
  const productName = `Automated Test Product ${Math.floor(Date.now() / 1000)}`;
  const productKey = `ATPK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  const productSku = `ATP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const prompt2Text = `Review the list of product types from our conversation history.\n\nIf product types WERE found in your previous responses:\nPlease take the first product type from that list.\n\nIf NO product types were found (or the list was empty) in your previous responses:\nPlease create a new product type with the following details:\n- Name: "${productTypeName}"\n- Key: "${productTypeKey}"\n- Description: "This product type was automatically created because no existing types were found."\n\nAfter you have either selected an existing product type OR created a new one, please use that product type to create a new product with the following details:\n- Name: "${productName}"\n- Key: "${productKey}"\n- Slug (en): "${productName.toLowerCase().replace(/\s+/g, '-')}"\n- SKU: "${productSku}"\n- Description (en): "This product was created automatically by an AI agent using an available or auto-created product type."\n- Ensure the product is published if possible during creation.\n\nI will need the ID of this newly created product AND the ID or key of the product type used for subsequent operations. Please make sure these details are clear in your response or tool output.`;
  console.log(
    `\nExecuting Task 2 & 3: Create Product Type (if needed) and Product`
  );
  const result2 = (await agentExecutor.invoke({
    input: prompt2Text,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "Create fake product" (Task 2 & 3) ---');
  recordAndLog(prompt2Text, result2);

  const prompt3Text = `You should have just created a product. Please use the ID of that product (it should be in your last response in the chat history).\nRead that product's details. I need to confirm its creation and current state before attempting an update.`;
  console.log(`\nExecuting Task 4: Read Product`);
  // console.log(chatHistory);
  const result3 = (await agentExecutor.invoke({
    input: prompt3Text,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "Read the product" (Task 4) ---');
  recordAndLog(prompt3Text, result3);

  const updatedProductName = `Automated Test Product ${Math.floor(Date.now() / 1000)} (Updated)`;
  const prompt4Text = `Excellent. You should have the product ID from our previous exchanges (when it was created and then read). Using the ID of that product, please update it.\nChange its name to "${updatedProductName}"\nand update its description to "This product was created and then updated automatically by an AI agent."\nAlso, please publish the product as part of this same update action. If it was already published, that's okay, just ensure the update attempts to publish it.`;
  console.log(`\nExecuting Task 5: Update Product & Publish`);
  const result4 = (await agentExecutor.invoke({
    input: prompt4Text,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "Update the product" (Task 5) ---');
  recordAndLog(prompt4Text, result4);

  const prompt5Text = `The product should have just been updated in our conversation. Using the ID of that product, please publish it. If it was already published, confirm its published state.`;
  console.log(`\nExecuting Task 6: Publish Product`);
  const result5 = (await agentExecutor.invoke({
    input: prompt5Text,
    chat_history: chatHistory,
  })) as AgentResult;
  console.log('--- Response from "Publish the product" (Task 6) ---');
  recordAndLog(prompt5Text, result5);

  console.log(
    '\n--- commercetools Langchain Agent Task Sequence Finished (with Chat History) ---'
  );
})().catch((error) => {
  console.error('An error occurred during the async execution:', error);
  throw error;
});

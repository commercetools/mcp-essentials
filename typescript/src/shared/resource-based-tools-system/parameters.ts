import {z} from 'zod';

export const listAvailableToolsParameters = z.object({
  resourceType: z
    .enum([
      'businessUnit',
      'cart',
      'cartDiscount',
      'category',
      'channel',
      'customer',
      'customerGroup',
      'discountCode',
      'order',
      'inventory',
      'product',
      'project',
      'productSearch',
      'productSelection',
      'quote',
      'quoteRequest',
      'stagedQuote',
      'standalonePrice',
      'productDiscount',
      'productType',
      'store',
    ])
    .describe('The type of resource to list available tools for'),
});

export const injectToolsParameters = z.object({
  toolMethods: z.array(z.string()).describe('The tools to inject'),
});

export const executeToolParameters = z.object({
  toolMethod: z.string().describe('The tool method to execute'),
  arguments: z
    .record(z.any())
    .describe('The arguments to pass to the tool method'),
});

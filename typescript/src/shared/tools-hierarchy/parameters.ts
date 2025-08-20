import {z} from 'zod';

// businessUnit cart cartDiscount category channel customer customerGroup discountCode order inventory product project productSearch productSelection quote quoteRequest stagedQuote standalonePrice productDiscount productType store
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
  isBulk: z
    .boolean()
    .optional()
    .describe(
      'Whether or not the user wants to do a bulk create or update operations'
    ),
});

export const injectToolsParameters = z.object({
  toolMethods: z.array(z.string()).describe('The tools to inject'),
});

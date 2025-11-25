import {readQuotePrompt, createQuotePrompt, updateQuotePrompt} from './prompts';

import {
  readQuoteParameters,
  createQuoteParameters,
  updateQuoteParameters,
} from './parameters';
import {
  readQuoteOutputSchema,
  createQuoteOutputSchema,
  updateQuoteOutputSchema,
} from './output-schema';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_quote: {
    method: 'read_quote',
    name: 'Read Quote',
    description: readQuotePrompt,
    parameters: readQuoteParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      quote: {
        read: true,
      },
    },
    outputSchema: readQuoteOutputSchema,
  },
  create_quote: {
    method: 'create_quote',
    name: 'Create Quote',
    description: createQuotePrompt,
    parameters: createQuoteParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      quote: {
        create: true,
      },
    },
    outputSchema: createQuoteOutputSchema,
  },
  update_quote: {
    method: 'update_quote',
    name: 'Update Quote',
    description: updateQuotePrompt,
    parameters: updateQuoteParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      quote: {
        update: true,
      },
    },
    outputSchema: updateQuoteOutputSchema,
  },
};

export const contextToQuoteTools = (context?: Context) => {
  // Associate quote tools when both customerId and businessUnitKey are present
  if (context?.customerId && context?.businessUnitKey) {
    return [tools.read_quote, tools.update_quote];
  }
  if (context?.customerId) {
    return [tools.read_quote, tools.update_quote];
  }
  if (context?.storeKey) {
    return [tools.read_quote, tools.create_quote, tools.update_quote];
  }

  return [tools.read_quote, tools.create_quote, tools.update_quote];
};

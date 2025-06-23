import {
  readQuoteRequestPrompt,
  createQuoteRequestPrompt,
  updateQuoteRequestPrompt,
} from './prompts';

import {
  readQuoteRequestParameters,
  createQuoteRequestParameters,
  updateQuoteRequestParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_quote_request: {
    method: 'read_quote_request',
    name: 'Read Quote Request',
    description: readQuoteRequestPrompt,
    parameters: readQuoteRequestParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'quote-request': {
        read: true,
      },
    },
  },
  create_quote_request: {
    method: 'create_quote_request',
    name: 'Create Quote Request',
    description: createQuoteRequestPrompt,
    parameters: createQuoteRequestParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'quote-request': {
        create: true,
      },
    },
  },
  update_quote_request: {
    method: 'update_quote_request',
    name: 'Update Quote Request',
    description: updateQuoteRequestPrompt,
    parameters: updateQuoteRequestParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      'quote-request': {
        update: true,
      },
    },
  },
};

export const contextToQuoteRequestTools = (context?: Context) => {
  if (
    context?.storeKey ||
    context?.isAdmin ||
    (context?.customerId && context?.businessUnitKey)
  ) {
    return [
      tools.read_quote_request,
      tools.create_quote_request,
      tools.update_quote_request,
    ];
  }
  if (context?.customerId) {
    return [tools.read_quote_request, tools.update_quote_request];
  }

  return [];
};

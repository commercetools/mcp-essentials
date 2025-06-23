import * as store from './store.functions';
import * as admin from './admin.functions';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {ApiRoot} from '@commercetools/platform-sdk';
import {z} from 'zod';
import {
  readStagedQuoteParameters,
  createStagedQuoteParameters,
  updateStagedQuoteParameters,
} from './parameters';

// Context mapping function for staged quote functions
export const contextToStagedQuoteFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.storeKey) {
    return {
      read_staged_quote: store.readStagedQuote,
      create_staged_quote: store.createStagedQuote,
      update_staged_quote: store.updateStagedQuote,
    };
  }
  if (context?.isAdmin) {
    return {
      read_staged_quote: admin.readStagedQuote,
      create_staged_quote: admin.createStagedQuote,
      update_staged_quote: admin.updateStagedQuote,
    };
  }
  return {};
};

// Export the individual CRUD functions for direct use in tests
export const readStagedQuote = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof readStagedQuoteParameters>
) => {
  if (context?.storeKey) {
    return store.readStagedQuote(apiRoot, context, params);
  }
  return admin.readStagedQuote(apiRoot, context, params);
};

export const createStagedQuote = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof createStagedQuoteParameters>
) => {
  if (context?.storeKey) {
    return store.createStagedQuote(apiRoot, context, params);
  }
  return admin.createStagedQuote(apiRoot, context, params);
};

export const updateStagedQuote = (
  apiRoot: ApiRoot,
  context: any,
  params: z.infer<typeof updateStagedQuoteParameters>
) => {
  if (context?.storeKey) {
    return store.updateStagedQuote(apiRoot, context, params);
  }
  return admin.updateStagedQuote(apiRoot, context, params);
};

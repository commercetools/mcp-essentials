import {Context} from '../../types/configuration';
import {Tool} from '../../types/tools';
import {
  readStagedQuoteParameters,
  createStagedQuoteParameters,
  updateStagedQuoteParameters,
} from './parameters';
import {
  readStagedQuotePrompt,
  createStagedQuotePrompt,
  updateStagedQuotePrompt,
} from './prompts';

const tools: Record<string, Tool> = {
  read_staged_quote: {
    method: 'read_staged_quote',
    name: 'Read Staged Quote',
    description: readStagedQuotePrompt,
    parameters: readStagedQuoteParameters,
    actions: {
      'staged-quote': {
        read: true,
      },
    },
  },
  create_staged_quote: {
    method: 'create_staged_quote',
    name: 'Create Staged Quote',
    description: createStagedQuotePrompt,
    parameters: createStagedQuoteParameters,
    actions: {
      'staged-quote': {
        create: true,
      },
    },
  },
  update_staged_quote: {
    method: 'update_staged_quote',
    name: 'Update Staged Quote',
    description: updateStagedQuotePrompt,
    parameters: updateStagedQuoteParameters,
    actions: {
      'staged-quote': {
        update: true,
      },
    },
  },
};

export const contextToStagedQuoteTools = (context?: Context) => {
  if (context?.storeKey) {
    return [
      tools.read_staged_quote,
      tools.create_staged_quote,
      tools.update_staged_quote,
    ];
  }
  return [
    tools.read_staged_quote,
    tools.create_staged_quote,
    tools.update_staged_quote,
  ];
};

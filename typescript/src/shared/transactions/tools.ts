import {
  createTransactionParameters,
  readTransactionParameters,
} from './parameters';
import {readTransactionPrompt, createTransactionPrompt} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_transaction: {
    name: 'Read Transaction',
    method: 'read_transaction',
    parameters: readTransactionParameters,
    description: readTransactionPrompt,
    actions: {
      transactions: {
        read: true,
      },
    },
  },
  create_transaction: {
    name: 'Create Transaction',
    method: 'create_transaction',
    parameters: createTransactionParameters,
    description: createTransactionPrompt,
    actions: {
      transactions: {
        create: true,
      },
    },
  },
};

export const contextToTransactionTools = (context?: Context) => {
  return [tools.read_transaction, tools.create_transaction];
};

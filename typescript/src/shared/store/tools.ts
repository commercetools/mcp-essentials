import {readStorePrompt, createStorePrompt, updateStorePrompt} from './prompts';

import {
  readStoreParameters,
  createStoreParameters,
  updateStoreParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {z} from 'zod';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_store: {
    method: 'read_store',
    name: 'Read Store',
    description: readStorePrompt,
    parameters: readStoreParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      store: {
        read: true,
      },
    },
  },
  create_store: {
    method: 'create_store',
    name: 'Create Store',
    description: createStorePrompt,
    parameters: createStoreParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      store: {
        create: true,
      },
    },
  },
  update_store: {
    method: 'update_store',
    name: 'Update Store',
    description: updateStorePrompt,
    parameters: updateStoreParameters as unknown as z.ZodObject<
      any,
      any,
      any,
      any
    >,
    actions: {
      store: {
        update: true,
      },
    },
  },
};

export const contextToStoreTools = (context?: Context) => {
  if (context?.storeKey) {
    return [tools.read_store];
  }
  if (context?.isAdmin) {
    return [tools.read_store, tools.create_store, tools.update_store];
  }
  return [];
};

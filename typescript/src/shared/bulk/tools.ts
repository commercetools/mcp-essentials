import {z} from 'zod';
import {
  CREATE_BULK_DESCRIPTION,
  CREATE_BULK_PROMPT,
  UPDATE_BULK_DESCRIPTION,
  UPDATE_BULK_PROMPT,
} from './prompts';
import {bulkCreateParameters, bulkUpdateParameters} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  bulk_create: {
    method: 'bulk_create',
    name: 'Bulk Create',
    description: CREATE_BULK_DESCRIPTION,
    parameters: bulkCreateParameters,
    actions: {
      bulk: {
        create: true,
      },
    },
  },
  bulk_update: {
    method: 'bulk_update',
    name: 'Bulk Update',
    description: UPDATE_BULK_DESCRIPTION,
    parameters: bulkUpdateParameters,
    actions: {
      bulk: {
        update: true,
      },
    },
  },
};

export const contextToBulkTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [tools.bulk_create, tools.bulk_update];
  }
  return [];
};

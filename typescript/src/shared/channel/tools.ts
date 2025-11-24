import {
  readChannelPrompt,
  createChannelPrompt,
  updateChannelPrompt,
} from './prompts';

import {
  readChannelParameters,
  createChannelParameters,
  updateChannelParameters,
} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_channel: {
    method: 'read_channel',
    name: 'Read Channel',
    description: readChannelPrompt,
    parameters: readChannelParameters,
    actions: {
      channel: {
        read: true,
      },
    },
  },
  create_channel: {
    method: 'create_channel',
    name: 'Create Channel',
    description: createChannelPrompt,
    parameters: createChannelParameters,
    actions: {
      channel: {
        create: true,
      },
    },
  },
  update_channel: {
    method: 'update_channel',
    name: 'Update Channel',
    description: updateChannelPrompt,
    parameters: updateChannelParameters,
    actions: {
      channel: {
        update: true,
      },
    },
  },
};

export const contextToChannelTools = (context?: Context) => {
  return [tools.read_channel, tools.create_channel, tools.update_channel];
};

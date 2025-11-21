import {
  createExtensionParameters,
  readExtensionParameters,
  updateExtensionParameters,
} from './parameters';
import {
  readExtensionPrompt,
  createExtensionPrompt,
  updateExtensionPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_extension: {
    name: 'Read Extension',
    method: 'read_extension',
    parameters: readExtensionParameters,
    description: readExtensionPrompt,
    actions: {
      extensions: {
        read: true,
      },
    },
  },
  create_extension: {
    name: 'Create Extension',
    method: 'create_extension',
    parameters: createExtensionParameters,
    description: createExtensionPrompt,
    actions: {
      extensions: {
        create: true,
      },
    },
  },
  update_extension: {
    name: 'Update Extension',
    method: 'update_extension',
    parameters: updateExtensionParameters,
    description: updateExtensionPrompt,
    actions: {
      extensions: {
        update: true,
      },
    },
  },
};

export const contextToExtensionTools = (context?: Context) => {
  return [tools.read_extension, tools.create_extension, tools.update_extension];
};

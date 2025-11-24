import {
  createZoneParameters,
  readZoneParameters,
  updateZoneParameters,
} from './parameters';
import {readZonePrompt, createZonePrompt, updateZonePrompt} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_zone: {
    name: 'Read Zone',
    method: 'read_zone',
    parameters: readZoneParameters,
    description: readZonePrompt,
    actions: {
      zone: {
        read: true,
      },
    },
  },
  create_zone: {
    name: 'Create Zone',
    method: 'create_zone',
    parameters: createZoneParameters,
    description: createZonePrompt,
    actions: {
      zone: {
        create: true,
      },
    },
  },
  update_zone: {
    name: 'Update Zone',
    method: 'update_zone',
    parameters: updateZoneParameters,
    description: updateZonePrompt,
    actions: {
      zone: {
        update: true,
      },
    },
  },
};

export const contextToZoneTools = (context?: Context) => {
  return [tools.read_zone, tools.create_zone, tools.update_zone];
};

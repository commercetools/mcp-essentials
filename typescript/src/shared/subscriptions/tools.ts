import {
  createSubscriptionParameters,
  readSubscriptionParameters,
  updateSubscriptionParameters,
} from './parameters';
import {
  readSubscriptionPrompt,
  createSubscriptionPrompt,
  updateSubscriptionPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_subscription: {
    name: 'Read Subscription',
    method: 'read_subscription',
    parameters: readSubscriptionParameters,
    description: readSubscriptionPrompt,
    actions: {
      subscriptions: {
        read: true,
      },
    },
  },
  create_subscription: {
    name: 'Create Subscription',
    method: 'create_subscription',
    parameters: createSubscriptionParameters,
    description: createSubscriptionPrompt,
    actions: {
      subscriptions: {
        create: true,
      },
    },
  },
  update_subscription: {
    name: 'Update Subscription',
    method: 'update_subscription',
    parameters: updateSubscriptionParameters,
    description: updateSubscriptionPrompt,
    actions: {
      subscriptions: {
        update: true,
      },
    },
  },
};

export const contextToSubscriptionTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [
      tools.read_subscription,
      tools.create_subscription,
      tools.update_subscription,
    ];
  }
  return [];
};

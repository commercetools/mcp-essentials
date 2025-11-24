import {updatePaymentIntentParameters} from './parameters';
import {updatePaymentIntentPrompt} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  update_payment_intent: {
    name: 'Update Payment Intent',
    method: 'update_payment_intents',
    parameters: updatePaymentIntentParameters,
    description: updatePaymentIntentPrompt,
    actions: {
      'payment-intents': {
        update: true,
      },
    },
  },
};

export const contextToPaymentIntentTools = (context?: Context) => {
  return [tools.update_payment_intent];
};

import {contextToPaymentIntentFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Payment Intent Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToPaymentIntentFunctionMapping(context);

    expect(mapping).toEqual({
      update_payment_intents: admin.updatePaymentIntent,
    });
  });

  test('should return admin functions as fallback when no context is provided', () => {
    const mapping = contextToPaymentIntentFunctionMapping();
    expect(mapping).toEqual({
      update_payment_intents: admin.updatePaymentIntent,
    });
  });

  test('should return admin functions as fallback when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToPaymentIntentFunctionMapping(context);
    expect(mapping).toEqual({
      update_payment_intents: admin.updatePaymentIntent,
    });
  });

  test('should return admin functions as fallback when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToPaymentIntentFunctionMapping(context);
    expect(mapping).toEqual({
      update_payment_intents: admin.updatePaymentIntent,
    });
  });
});

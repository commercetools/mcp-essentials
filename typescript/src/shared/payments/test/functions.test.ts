import {contextToPaymentFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Payment Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToPaymentFunctionMapping(context);

    expect(mapping).toEqual({
      read_payments: admin.readPayment,
      create_payments: admin.createPayment,
      update_payments: admin.updatePayment,
    });
  });

  test('should return empty object when no context is provided', () => {
    const mapping = contextToPaymentFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when context does not include isAdmin', () => {
    const context = {};
    const mapping = contextToPaymentFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

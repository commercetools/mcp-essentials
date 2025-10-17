import {contextToPaymentFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';

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

  test('should return customer functions when customerId is provided', () => {
    const context = {customerId: 'customer-123'};
    const mapping = contextToPaymentFunctionMapping(context);

    expect(mapping).toEqual({
      read_payments: customer.customerReadPayment,
      create_payments: customer.customerCreatePayment,
      update_payments: customer.customerUpdatePayment,
    });
  });

  test('should return store functions when storeKey is provided', () => {
    const context = {storeKey: 'store-123'};
    const mapping = contextToPaymentFunctionMapping(context);

    expect(mapping).toEqual({
      read_payments: store.storeReadPayment,
      create_payments: store.storeCreatePayment,
      update_payments: store.storeUpdatePayment,
    });
  });

  test('should return empty object when no context is provided', () => {
    const mapping = contextToPaymentFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when context does not include isAdmin, customerId, or storeKey', () => {
    const context = {};
    const mapping = contextToPaymentFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

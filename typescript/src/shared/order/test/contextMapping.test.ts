import {contextToOrderFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Order Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToOrderFunctionMapping(context);

    expect(mapping).toEqual({
      read_order: admin.readOrder,
      create_order: admin.createOrder,
      update_order: admin.updateOrder,
    });
  });

  test('should return admin functions when no context is provided', () => {
    const mapping = contextToOrderFunctionMapping();
    expect(mapping).toEqual({
      read_order: admin.readOrder,
      create_order: admin.createOrder,
      update_order: admin.updateOrder,
    });
  });

  test('should return admin functions when context has no relevant properties', () => {
    const context = {};
    const mapping = contextToOrderFunctionMapping(context);
    expect(mapping).toEqual({
      read_order: admin.readOrder,
      create_order: admin.createOrder,
      update_order: admin.updateOrder,
    });
  });
});

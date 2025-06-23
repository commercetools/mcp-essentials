import {contextToInventoryFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Inventory Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToInventoryFunctionMapping(context);

    expect(mapping).toEqual({
      read_inventory: admin.readInventory,
      create_inventory: admin.createInventory,
      update_inventory: admin.updateInventory,
    });
  });

  test('should return empty object when no context is provided', () => {
    const mapping = contextToInventoryFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToInventoryFunctionMapping(context);
    expect(mapping).toEqual({});
  });

  test('should return empty object when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToInventoryFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

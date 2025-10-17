import {contextToZoneFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';

describe('Zone Context Mapping', () => {
  test('should return customer functions when customerId is present', () => {
    const context = {customerId: 'customer-123'};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: customer.readZone,
      create_zone: customer.createZone,
      update_zone: customer.updateZone,
    });
  });

  test('should return store functions when storeKey is present', () => {
    const context = {storeKey: 'store-123'};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: store.readZone,
      create_zone: store.createZone,
      update_zone: store.updateZone,
    });
  });

  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: admin.readZone,
      create_zone: admin.createZone,
      update_zone: admin.updateZone,
    });
  });

  test('should return empty object when no context is provided', () => {
    const mapping = contextToZoneFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when context has no relevant properties', () => {
    const context = {};
    const mapping = contextToZoneFunctionMapping(context);
    expect(mapping).toEqual({});
  });

  test('should prioritize customerId over storeKey when both are present', () => {
    const context = {customerId: 'customer-123', storeKey: 'store-123'};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: customer.readZone,
      create_zone: customer.createZone,
      update_zone: customer.updateZone,
    });
  });

  test('should prioritize customerId over isAdmin when both are present', () => {
    const context = {customerId: 'customer-123', isAdmin: true};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: customer.readZone,
      create_zone: customer.createZone,
      update_zone: customer.updateZone,
    });
  });

  test('should prioritize storeKey over isAdmin when both are present', () => {
    const context = {storeKey: 'store-123', isAdmin: true};
    const mapping = contextToZoneFunctionMapping(context);

    expect(mapping).toEqual({
      read_zone: store.readZone,
      create_zone: store.createZone,
      update_zone: store.updateZone,
    });
  });
});

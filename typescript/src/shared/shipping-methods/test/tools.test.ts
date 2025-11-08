import {contextToShippingMethodTools} from '../tools';

describe('Shipping Methods Tools', () => {
  describe('contextToShippingMethodTools', () => {
    it('should return shipping method tools when isAdmin is true', () => {
      const context = {isAdmin: true};
      const tools = contextToShippingMethodTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Shipping Method');
      expect(tools[0]).toHaveProperty('method', 'read_shipping_methods');
      expect(tools[0]).toHaveProperty('actions', {
        'shipping-methods': {
          read: true,
        },
      });

      expect(tools[1]).toHaveProperty('name', 'Create Shipping Method');
      expect(tools[1]).toHaveProperty('method', 'create_shipping_methods');
      expect(tools[1]).toHaveProperty('actions', {
        'shipping-methods': {
          create: true,
        },
      });

      expect(tools[2]).toHaveProperty('name', 'Update Shipping Method');
      expect(tools[2]).toHaveProperty('method', 'update_shipping_methods');
      expect(tools[2]).toHaveProperty('actions', {
        'shipping-methods': {
          update: true,
        },
      });
    });

    it('should return read tool when customerId is provided', () => {
      const context = {customerId: 'customer-123'};
      const tools = contextToShippingMethodTools(context);

      expect(tools).toHaveLength(1);
      expect(tools[0]).toHaveProperty('name', 'Read Shipping Method');
      expect(tools[0]).toHaveProperty('method', 'read_shipping_methods');
    });

    it('should return empty array when isAdmin is false and no customerId', () => {
      const context = {isAdmin: false};
      const tools = contextToShippingMethodTools(context);

      expect(tools).toEqual([]);
    });

    it('should return empty array when context is undefined', () => {
      const tools = contextToShippingMethodTools();

      expect(tools).toEqual([]);
    });

    it('should return empty array when context does not have isAdmin or customerId', () => {
      const context = {};
      const tools = contextToShippingMethodTools(context);

      expect(tools).toEqual([]);
    });
  });
});

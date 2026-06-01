import {filterFields} from '../filterFields';

describe('filterFields', () => {
  describe('single object filtering', () => {
    it('should pick only specified keys from an object', () => {
      const data = {
        id: '123',
        version: 1,
        orderNumber: 'ORD-001',
        totalPrice: {currencyCode: 'EUR', centAmount: 1000},
        lineItems: [{id: 'li-1', name: 'Product A'}],
        shippingInfo: {method: 'express'},
      };

      const result = filterFields(data, ['id', 'orderNumber', 'totalPrice']);

      expect(result).toEqual({
        id: '123',
        orderNumber: 'ORD-001',
        totalPrice: {currencyCode: 'EUR', centAmount: 1000},
      });
    });

    it('should ignore fields that do not exist on the object', () => {
      const data = {id: '123', version: 1};

      const result = filterFields(data, ['id', 'nonExistent']);

      expect(result).toEqual({id: '123'});
    });
  });

  describe('paginated response filtering', () => {
    it('should filter each item in results and preserve pagination metadata', () => {
      const data = {
        limit: 20,
        offset: 0,
        count: 2,
        total: 2,
        results: [
          {
            id: '1',
            version: 1,
            orderNumber: 'ORD-001',
            lineItems: [{id: 'li-1'}],
          },
          {
            id: '2',
            version: 2,
            orderNumber: 'ORD-002',
            lineItems: [{id: 'li-2'}],
          },
        ],
      };

      const result = filterFields(data, ['id', 'orderNumber']);

      expect(result).toEqual({
        limit: 20,
        offset: 0,
        count: 2,
        total: 2,
        results: [
          {id: '1', orderNumber: 'ORD-001'},
          {id: '2', orderNumber: 'ORD-002'},
        ],
      });
    });
  });

  describe('no-op cases', () => {
    it('should return data unchanged when fields is undefined', () => {
      const data = {id: '123', version: 1};

      const result = filterFields(data, undefined as any);

      expect(result).toBe(data);
    });

    it('should return data unchanged when fields is an empty array', () => {
      const data = {id: '123', version: 1};

      const result = filterFields(data, []);

      expect(result).toBe(data);
    });

    it('should return data unchanged for string values', () => {
      const result = filterFields('hello', ['id']);

      expect(result).toBe('hello');
    });

    it('should return data unchanged for number values', () => {
      const result = filterFields(42, ['id']);

      expect(result).toBe(42);
    });

    it('should return data unchanged for null', () => {
      const result = filterFields(null, ['id']);

      expect(result).toBeNull();
    });
  });
});

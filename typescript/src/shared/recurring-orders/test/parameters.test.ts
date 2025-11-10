import {
  readRecurringOrderParameters,
  createRecurringOrderParameters,
  updateRecurringOrderParameters,
} from '../parameters';

describe('RecurringOrder Parameters', () => {
  describe('readRecurringOrderParameters', () => {
    it('should validate valid read parameters', () => {
      const validParams = {
        id: 'test-id',
        expand: ['customer'],
      };

      const result = readRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate query parameters', () => {
      const validParams = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['customer.id="123"'],
        expand: ['customer'],
      };

      const result = readRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should reject invalid limit', () => {
      const invalidParams = {
        limit: 1000, // exceeds max of 500
      };

      const result = readRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject invalid offset', () => {
      const invalidParams = {
        offset: -1, // negative offset
      };

      const result = readRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });
  });

  describe('createRecurringOrderParameters', () => {
    it('should validate valid create parameters', () => {
      const validParams = {
        key: 'test-recurring-order',
        cart: {
          id: 'cart-123',
          typeId: 'cart' as const,
        },
        cartVersion: 1,
        startsAt: '2024-01-01T00:00:00.000Z',
        expiresAt: '2024-12-31T23:59:59.999Z',
        state: {
          id: 'state-123',
          typeId: 'state' as const,
        },
        custom: {
          type: {
            id: 'custom-type-id',
            typeId: 'type' as const,
          },
          fields: {
            customField: 'customValue',
          },
        },
      };

      const result = createRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate minimal create parameters', () => {
      const validParams = {
        cart: {
          id: 'cart-123',
          typeId: 'cart' as const,
        },
        cartVersion: 1,
      };

      const result = createRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should reject invalid key format', () => {
      const invalidParams = {
        key: 'invalid key!', // contains spaces and special characters
        cart: {
          id: 'cart-123',
          typeId: 'cart' as const,
        },
        cartVersion: 1,
      };

      const result = createRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidParams = {
        key: 'test-key',
        // missing cart and cartVersion
      };

      const result = createRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });
  });

  describe('updateRecurringOrderParameters', () => {
    it('should validate valid update parameters with ID', () => {
      const validParams = {
        id: 'recurring-order-123',
        version: 1,
        actions: [
          {
            action: 'changeKey',
            key: 'new-key',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate valid update parameters with key', () => {
      const validParams = {
        key: 'recurring-order-key',
        version: 2,
        actions: [
          {
            action: 'setStartsAt',
            startsAt: '2024-02-01T00:00:00.000Z',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate setStartsAt action', () => {
      const validParams = {
        id: 'recurring-order-123',
        version: 1,
        actions: [
          {
            action: 'setStartsAt',
            startsAt: '2024-03-01T00:00:00.000Z',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate setCustomType action', () => {
      const validParams = {
        id: 'recurring-order-123',
        version: 1,
        actions: [
          {
            action: 'setCustomType',
            type: {
              id: 'custom-type-id',
              typeId: 'type',
            },
            fields: {
              customField: 'customValue',
            },
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate setCustomField action', () => {
      const validParams = {
        id: 'recurring-order-123',
        version: 1,
        actions: [
          {
            action: 'setCustomField',
            name: 'customField',
            value: 'customValue',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should reject missing version', () => {
      const invalidParams = {
        id: 'recurring-order-123',
        actions: [
          {
            action: 'changeKey',
            key: 'new-key',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should accept missing identifier (validation handled in functions)', () => {
      const invalidParams = {
        version: 1,
        actions: [
          {
            action: 'changeKey',
            key: 'new-key',
          },
        ],
      };

      const result = updateRecurringOrderParameters.safeParse(invalidParams);
      expect(result.success).toBe(true);
    });
  });
});

import {ApiRoot} from '@commercetools/platform-sdk';
import {contextToRecurringOrderFunctionMapping} from '../functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {Context} from '../../../types/configuration';

// Mock the commercetools SDK
jest.mock('@commercetools/platform-sdk');

describe('RecurringOrder Functions', () => {
  let mockApiRoot: jest.Mocked<ApiRoot>;
  let mockContext: CommercetoolsFuncContext;
  let adminContext: Context;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock ApiRoot
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      recurringOrders: jest.fn().mockReturnThis(),
      withId: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    } as any;

    // Create mock context
    mockContext = {
      projectKey: 'test-project',
      accessToken: 'test-token',
    };

    // Create admin context
    adminContext = {
      isAdmin: true,
    };
  });

  describe('contextToRecurringOrderFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const mapping = contextToRecurringOrderFunctionMapping(adminContext);

      expect(mapping).toHaveProperty('read_recurring_orders');
      expect(mapping).toHaveProperty('create_recurring_orders');
      expect(mapping).toHaveProperty('update_recurring_orders');
    });

    it('should return customer functions when customerId is provided', () => {
      const customerContext = {customerId: 'customer-123'};
      const mapping = contextToRecurringOrderFunctionMapping(customerContext);

      expect(mapping).toHaveProperty('read_recurring_orders');
    });

    it('should return empty object when isAdmin is false and no customerId', () => {
      const customerContext = {isAdmin: false};
      const mapping = contextToRecurringOrderFunctionMapping(customerContext);

      expect(mapping).toEqual({});
    });

    it('should return empty object when context is undefined', () => {
      const mapping = contextToRecurringOrderFunctionMapping();

      expect(mapping).toEqual({});
    });
  });

  describe('Admin Functions', () => {
    it('should have read_recurring_orders function', () => {
      const mapping = contextToRecurringOrderFunctionMapping(adminContext);
      const readFunction = mapping.read_recurring_orders;

      expect(typeof readFunction).toBe('function');
    });

    it('should have create_recurring_orders function', () => {
      const mapping = contextToRecurringOrderFunctionMapping(adminContext);
      const createFunction = mapping.create_recurring_orders;

      expect(typeof createFunction).toBe('function');
    });

    it('should have update_recurring_orders function', () => {
      const mapping = contextToRecurringOrderFunctionMapping(adminContext);
      const updateFunction = mapping.update_recurring_orders;

      expect(typeof updateFunction).toBe('function');
    });
  });

  describe('Customer Functions', () => {
    it('should have read_recurring_orders function for customers', () => {
      const customerContext = {customerId: 'customer-123'};
      const mapping = contextToRecurringOrderFunctionMapping(customerContext);
      const readFunction = mapping.read_recurring_orders;

      expect(typeof readFunction).toBe('function');
    });
  });
});

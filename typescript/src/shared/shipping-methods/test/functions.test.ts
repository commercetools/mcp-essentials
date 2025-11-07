import {ApiRoot} from '@commercetools/platform-sdk';
import {contextToShippingMethodFunctionMapping} from '../functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {Context} from '../../../types/configuration';

// Mock the commercetools SDK
jest.mock('@commercetools/platform-sdk');

describe('ShippingMethod Functions', () => {
  let mockApiRoot: jest.Mocked<ApiRoot>;
  let mockContext: CommercetoolsFuncContext;
  let adminContext: Context;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock ApiRoot
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      shippingMethods: jest.fn().mockReturnThis(),
      withId: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    } as any;

    // Create mock context
    mockContext = {
      projectKey: 'test-project',
      // accessToken: 'test-token',
    };

    // Create admin context
    adminContext = {
      isAdmin: true,
    };
  });

  describe('contextToShippingMethodFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const mapping = contextToShippingMethodFunctionMapping(adminContext);

      expect(mapping).toHaveProperty('read_shipping_methods');
      expect(mapping).toHaveProperty('create_shipping_methods');
      expect(mapping).toHaveProperty('update_shipping_methods');
    });

    it('should return empty object when isAdmin is false and no customerId', () => {
      const customerContext = {isAdmin: false};
      const mapping = contextToShippingMethodFunctionMapping(customerContext);

      expect(mapping).toEqual({});
    });

    it('should return empty object when context is undefined', () => {
      const mapping = contextToShippingMethodFunctionMapping();

      expect(mapping).toEqual({});
    });
  });

  describe('Admin Functions', () => {
    it('should have read_shipping_methods function', () => {
      const mapping = contextToShippingMethodFunctionMapping(adminContext);
      const readFunction = mapping.read_shipping_methods;

      expect(typeof readFunction).toBe('function');
    });

    it('should have create_shipping_methods function', () => {
      const mapping = contextToShippingMethodFunctionMapping(adminContext);
      const createFunction = mapping.create_shipping_methods;

      expect(typeof createFunction).toBe('function');
    });

    it('should have update_shipping_methods function', () => {
      const mapping = contextToShippingMethodFunctionMapping(adminContext);
      const updateFunction = mapping.update_shipping_methods;

      expect(typeof updateFunction).toBe('function');
    });
  });
});

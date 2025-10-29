import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readShippingMethodByIdForCustomer,
  readShippingMethodByKeyForCustomer,
  queryShippingMethodsForCustomer,
  readCustomerShippingMethod,
} from '../customer.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the entire ApiRoot
jest.mock('@commercetools/platform-sdk', () => ({
  ApiRoot: jest.fn(),
}));

// Mock context
const mockContext = {
  projectKey: 'test-project',
  customerId: 'test-customer-id',
};

describe('Customer Shipping Method Functions', () => {
  let mockApiRoot: any;
  let executeFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock chain
    executeFunction = jest.fn();
    const getMock = jest.fn().mockReturnValue({execute: executeFunction});
    const shippingMethodsMock = jest.fn().mockReturnValue({get: getMock});
    const withProjectKeyMock = jest.fn().mockReturnValue({
      shippingMethods: shippingMethodsMock,
    });

    // Build the complete mock
    mockApiRoot = {
      withProjectKey: withProjectKeyMock,
    };
  });

  describe('readShippingMethodByIdForCustomer', () => {
    it('should return shipping method when found', async () => {
      // Setup mock response
      const mockShippingMethod = {id: 'shipping-method-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockShippingMethod],
        },
      });

      // Call function
      const result = await readShippingMethodByIdForCustomer(
        mockApiRoot,
        mockContext,
        {
          id: 'shipping-method-123',
        }
      );

      // Verify result
      expect(result).toEqual(mockShippingMethod);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });
  });

  describe('readShippingMethodByKeyForCustomer', () => {
    it('should return shipping method when found', async () => {
      // Setup mock response
      const mockShippingMethod = {key: 'shipping-method-key'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockShippingMethod],
        },
      });

      // Call function
      const result = await readShippingMethodByKeyForCustomer(
        mockApiRoot,
        mockContext,
        {
          key: 'shipping-method-key',
        }
      );

      // Verify result
      expect(result).toEqual(mockShippingMethod);
    });
  });

  describe('queryShippingMethodsForCustomer', () => {
    it('should query shipping methods for customer', async () => {
      // Setup mock response
      const mockResults = [
        {id: 'shipping-method-1'},
        {id: 'shipping-method-2'},
      ];
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 2,
          results: mockResults,
        },
      });

      // Call function
      const result = await queryShippingMethodsForCustomer(
        mockApiRoot,
        mockContext,
        {
          where: [],
          limit: 10,
        }
      );

      // Verify result
      expect(result.count).toBe(2);
      expect(result.results).toEqual(mockResults);
    });
  });

  describe('readCustomerShippingMethod', () => {
    it('should read by ID when id is provided', async () => {
      // Setup mock response
      const mockShippingMethod = {id: 'shipping-method-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockShippingMethod],
        },
      });

      // Call function
      const result = await readCustomerShippingMethod(
        mockApiRoot,
        mockContext,
        {
          id: 'shipping-method-123',
        }
      );

      // Verify result
      expect(result).toEqual(mockShippingMethod);
    });

    it('should read by key when key is provided', async () => {
      // Setup mock response
      const mockShippingMethod = {key: 'shipping-method-key'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockShippingMethod],
        },
      });

      // Call function
      const result = await readCustomerShippingMethod(
        mockApiRoot,
        mockContext,
        {
          key: 'shipping-method-key',
        }
      );

      // Verify result
      expect(result).toEqual(mockShippingMethod);
    });

    it('should query when where is provided', async () => {
      // Setup mock response
      const mockResults = [{id: 'shipping-method-1'}];
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: mockResults,
        },
      });

      // Call function
      const result = await readCustomerShippingMethod(
        mockApiRoot,
        mockContext,
        {
          where: ['isDefault=true'],
          limit: 10,
        }
      );

      // Verify result
      expect(result.count).toBe(1);
      expect(result.results).toEqual(mockResults);
    });

    it('should handle errors properly', async () => {
      // Setup mock to throw error
      executeFunction.mockRejectedValueOnce(new Error('API error'));

      // Call function and check for error
      await expect(
        readCustomerShippingMethod(mockApiRoot, mockContext, {
          id: 'shipping-method-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

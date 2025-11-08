import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readRecurringOrderByIdForCustomer,
  readRecurringOrderByKeyForCustomer,
  queryRecurringOrdersForCustomer,
  readCustomerRecurringOrder,
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

describe('Customer Recurring Order Functions', () => {
  let mockApiRoot: any;
  let executeFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock chain
    executeFunction = jest.fn();
    const getMock = jest.fn().mockReturnValue({execute: executeFunction});
    const recurringOrdersMock = jest.fn().mockReturnValue({get: getMock});
    const withProjectKeyMock = jest.fn().mockReturnValue({
      recurringOrders: recurringOrdersMock,
    });

    // Build the complete mock
    mockApiRoot = {
      withProjectKey: withProjectKeyMock,
    };
  });

  describe('readRecurringOrderByIdForCustomer', () => {
    it('should return recurring order when found', async () => {
      // Setup mock response
      const mockRecurringOrder = {id: 'recurring-order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockRecurringOrder],
        },
      });

      // Call function
      const result = await readRecurringOrderByIdForCustomer(
        mockApiRoot,
        mockContext,
        {
          id: 'recurring-order-123',
        }
      );

      // Verify result
      expect(result).toEqual(mockRecurringOrder);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should throw error when recurring order not found', async () => {
      // Setup mock response for no results
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Call function and check for error
      await expect(
        readRecurringOrderByIdForCustomer(mockApiRoot, mockContext, {
          id: 'non-existent-recurring-order',
        })
      ).rejects.toThrow(
        'Recurring order with ID non-existent-recurring-order not found for customer test-customer-id'
      );
    });
  });

  describe('readRecurringOrderByKeyForCustomer', () => {
    it('should return recurring order when found', async () => {
      // Setup mock response
      const mockRecurringOrder = {key: 'recurring-order-key'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockRecurringOrder],
        },
      });

      // Call function
      const result = await readRecurringOrderByKeyForCustomer(
        mockApiRoot,
        mockContext,
        {
          key: 'recurring-order-key',
        }
      );

      // Verify result
      expect(result).toEqual(mockRecurringOrder);
    });

    it('should throw error when recurring order not found', async () => {
      // Setup mock response for no results
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Call function and check for error
      await expect(
        readRecurringOrderByKeyForCustomer(mockApiRoot, mockContext, {
          key: 'non-existent-key',
        })
      ).rejects.toThrow(
        'Recurring order with key non-existent-key not found for customer test-customer-id'
      );
    });
  });

  describe('queryRecurringOrdersForCustomer', () => {
    it('should query recurring orders for customer', async () => {
      // Setup mock response
      const mockResults = [
        {id: 'recurring-order-1'},
        {id: 'recurring-order-2'},
      ];
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 2,
          results: mockResults,
        },
      });

      // Call function
      const result = await queryRecurringOrdersForCustomer(
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

    it('should add customerId to where conditions', async () => {
      // Setup mock response
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Call function
      await queryRecurringOrdersForCustomer(mockApiRoot, mockContext, {
        where: ['recurringOrderState="Active"'],
        limit: 10,
      });

      // Verify the where conditions include customerId
      const callArgs = mockApiRoot.withProjectKey().recurringOrders().get.mock
        .calls[0][0];
      expect(callArgs.queryArgs.where).toContain(
        'customerId="test-customer-id"'
      );
    });
  });

  describe('readCustomerRecurringOrder', () => {
    it('should read by ID when id is provided', async () => {
      // Setup mock response
      const mockRecurringOrder = {id: 'recurring-order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockRecurringOrder],
        },
      });

      // Call function
      const result = await readCustomerRecurringOrder(
        mockApiRoot,
        mockContext,
        {
          id: 'recurring-order-123',
        }
      );

      // Verify result
      expect(result).toEqual(mockRecurringOrder);
    });

    it('should read by key when key is provided', async () => {
      // Setup mock response
      const mockRecurringOrder = {key: 'recurring-order-key'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockRecurringOrder],
        },
      });

      // Call function
      const result = await readCustomerRecurringOrder(
        mockApiRoot,
        mockContext,
        {
          key: 'recurring-order-key',
        }
      );

      // Verify result
      expect(result).toEqual(mockRecurringOrder);
    });

    it('should query when where is provided', async () => {
      // Setup mock response
      const mockResults = [{id: 'recurring-order-1'}];
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: mockResults,
        },
      });

      // Call function
      const result = await readCustomerRecurringOrder(
        mockApiRoot,
        mockContext,
        {
          where: ['recurringOrderState="Active"'],
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
        readCustomerRecurringOrder(mockApiRoot, mockContext, {
          id: 'recurring-order-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

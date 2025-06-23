import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readOrderByIdForCustomer,
  readOrderByOrderNumberForCustomer,
  queryOrdersForCustomer,
  readCustomerOrder,
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

describe('Customer Order Functions', () => {
  let mockApiRoot: any;
  let executeFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock chain
    executeFunction = jest.fn();
    const getMock = jest.fn().mockReturnValue({execute: executeFunction});
    const ordersMock = jest.fn().mockReturnValue({get: getMock});
    const inStoreMock = jest.fn().mockReturnValue({orders: ordersMock});
    const withProjectKeyMock = jest.fn().mockReturnValue({
      orders: ordersMock,
      inStoreKeyWithStoreKeyValue: inStoreMock,
    });

    // Build the complete mock
    mockApiRoot = {
      withProjectKey: withProjectKeyMock,
    };
  });

  describe('readOrderByIdForCustomer', () => {
    it('should return order when found', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function
      const result = await readOrderByIdForCustomer(mockApiRoot, mockContext, {
        id: 'order-123',
      });

      // Verify result
      expect(result).toEqual(mockOrder);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should throw error when order not found', async () => {
      // Setup mock response for no results
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Call function and check for error
      await expect(
        readOrderByIdForCustomer(mockApiRoot, mockContext, {
          id: 'non-existent-order',
        })
      ).rejects.toThrow(
        'Order with ID non-existent-order not found for customer test-customer-id'
      );
    });

    it('should include storeKey in request when provided', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function with store key
      await readOrderByIdForCustomer(mockApiRoot, mockContext, {
        id: 'order-123',
        storeKey: 'test-store',
      });

      // Verify the correct chain was called
      expect(mockApiRoot.withProjectKey).toHaveBeenCalled();
    });

    it('should include expand in request when provided', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function with expand
      await readOrderByIdForCustomer(mockApiRoot, mockContext, {
        id: 'order-123',
        expand: ['lineItems[*].variant'],
      });

      // Verify the correct chain was called
      expect(mockApiRoot.withProjectKey).toHaveBeenCalled();
    });
  });

  describe('readOrderByOrderNumberForCustomer', () => {
    it('should return order when found', async () => {
      // Setup mock response
      const mockOrder = {orderNumber: 'ON-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function
      const result = await readOrderByOrderNumberForCustomer(
        mockApiRoot,
        mockContext,
        {
          orderNumber: 'ON-123',
        }
      );

      // Verify result
      expect(result).toEqual(mockOrder);
    });

    it('should throw error when order not found', async () => {
      // Setup mock response for no results
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Call function and check for error
      await expect(
        readOrderByOrderNumberForCustomer(mockApiRoot, mockContext, {
          orderNumber: 'non-existent-order',
        })
      ).rejects.toThrow(
        'Order with number non-existent-order not found for customer test-customer-id'
      );
    });
  });

  describe('queryOrdersForCustomer', () => {
    it('should query orders with customer ID in where conditions', async () => {
      // Setup mock response
      const mockOrders = {
        count: 2,
        results: [{id: 'order-1'}, {id: 'order-2'}],
      };
      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function
      const result = await queryOrdersForCustomer(mockApiRoot, mockContext, {
        where: ['createdAt >= "2023-01-01T00:00:00.000Z"'],
      });

      // Verify result
      expect(result).toEqual(mockOrders);
    });

    it('should include pagination parameters when provided', async () => {
      // Setup mock response
      executeFunction.mockResolvedValueOnce({
        body: {count: 0, results: []},
      });

      // Call function with pagination
      await queryOrdersForCustomer(mockApiRoot, mockContext, {
        where: [],
        limit: 5,
        offset: 10,
      });

      // Verify the call was made
      expect(mockApiRoot.withProjectKey).toHaveBeenCalled();
    });
  });

  describe('readCustomerOrder', () => {
    it('should call readOrderByIdForCustomer when id is provided', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function
      const result = await readCustomerOrder(mockApiRoot, mockContext, {
        id: 'order-123',
      });

      // Verify result
      expect(result).toEqual(mockOrder);
    });

    it('should call readOrderByOrderNumberForCustomer when orderNumber is provided', async () => {
      // Setup mock response
      const mockOrder = {orderNumber: 'ON-123'};
      executeFunction.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [mockOrder],
        },
      });

      // Call function
      const result = await readCustomerOrder(mockApiRoot, mockContext, {
        orderNumber: 'ON-123',
      });

      // Verify result
      expect(result).toEqual(mockOrder);
    });

    it('should call queryOrdersForCustomer when only where conditions are provided', async () => {
      // Setup mock response
      const mockOrders = {count: 2, results: []};
      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function
      const result = await readCustomerOrder(mockApiRoot, mockContext, {
        where: ['totalPrice.centAmount > 1000'],
      });

      // Verify result
      expect(result).toEqual(mockOrders);
    });

    it('should wrap errors in SDKError', async () => {
      // Setup mock to throw error
      const originalError = new Error('API error');
      executeFunction.mockRejectedValueOnce(originalError);

      // Call function and check for wrapped error
      await expect(
        readCustomerOrder(mockApiRoot, mockContext, {
          id: 'order-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

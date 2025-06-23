import {readOrder} from '../../../shared/order/admin.functions';
import {readCustomerOrder} from '../../../shared/order/customer.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../../../shared/errors/sdkError';

// Mock the API Root
const mockGet = jest.fn();
const mockExecute = jest.fn();
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockWithOrderNumber = jest.fn().mockReturnValue({
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockOrders = jest.fn().mockReturnValue({
  withId: mockWithId,
  withOrderNumber: mockWithOrderNumber,
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  orders: mockOrders,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  orders: mockOrders,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

describe('Order Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readCustomerOrder', () => {
    it('should get order by ID when customerId is provided', async () => {
      // Mock response for the filtered query
      mockExecute.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [
            {id: 'order-123', orderNumber: '1001', customerId: 'customer-456'},
          ],
        },
      });

      const result = await readCustomerOrder(
        mockApiRoot,
        {projectKey: 'test-project', customerId: 'customer-456'},
        {id: 'order-123'}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['id="order-123"', 'customerId="customer-456"'],
          limit: 1,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'order-123',
        orderNumber: '1001',
        customerId: 'customer-456',
      });
    });

    it('should filter orders by customerID when getting by orderNumber with customerId in context', async () => {
      // Mock response for the filtered query
      mockExecute.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [
            {id: 'order-123', orderNumber: '1001', customerId: 'customer-456'},
          ],
        },
      });

      const result = await readCustomerOrder(
        mockApiRoot,
        {projectKey: 'test-project', customerId: 'customer-456'},
        {orderNumber: '1001'}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['orderNumber="1001"', 'customerId="customer-456"'],
          limit: 1,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'order-123',
        orderNumber: '1001',
        customerId: 'customer-456',
      });
    });

    it('should add customerId to where conditions when filtering with where and customerId in context', async () => {
      // Mock response for the filtered query
      mockExecute.mockResolvedValueOnce({
        body: {
          count: 1,
          results: [
            {id: 'order-123', orderNumber: '1001', customerId: 'customer-456'},
            {id: 'order-124', orderNumber: '1002', customerId: 'customer-456'},
          ],
        },
      });

      const result = await readCustomerOrder(
        mockApiRoot,
        {projectKey: 'test-project', customerId: 'customer-456'},
        {where: ['orderNumber="1001" or orderNumber="1002"']}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: [
            'orderNumber="1001" or orderNumber="1002"',
            'customerId="customer-456"',
          ],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({
        count: 1,
        results: [
          {id: 'order-123', orderNumber: '1001', customerId: 'customer-456'},
          {id: 'order-124', orderNumber: '1002', customerId: 'customer-456'},
        ],
      });
    });

    it('should throw an SDKError when no order is found for customer ID', async () => {
      // Mock empty response for the filtered query
      mockExecute.mockResolvedValueOnce({
        body: {
          count: 0,
          results: [],
        },
      });

      // Since SDKError doesn't expose the original error, we'll just test that it throws
      await expect(
        readCustomerOrder(
          mockApiRoot,
          {projectKey: 'test-project', customerId: 'customer-456'},
          {id: 'order-123'}
        )
      ).rejects.toThrow('Failed to read customer order');

      // Verify that the query was made with the correct customer ID filter
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['id="order-123"', 'customerId="customer-456"'],
          limit: 1,
        },
      });
    });
  });

  describe('readOrder', () => {
    it('should get order by ID without customerId', async () => {
      // Mock response
      mockExecute.mockResolvedValueOnce({
        body: {id: 'order-123', orderNumber: '1001'},
      });

      const result = await readOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'order-123'}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'order-123'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual({id: 'order-123', orderNumber: '1001'});
    });
  });
});

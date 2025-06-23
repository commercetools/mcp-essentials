import {ApiRoot, Order} from '@commercetools/platform-sdk';
import {
  readOrderByIdInStore,
  readOrderByOrderNumberInStore,
  queryOrdersInStore,
  readStoreOrder,
  createOrderInStore,
  updateOrderByIdInStore,
  updateOrderByOrderNumberInStore,
} from '../store.functions';
import {SDKError} from '../../errors/sdkError';
import * as baseFunctions from '../base.functions';

// Mock the entire ApiRoot
jest.mock('@commercetools/platform-sdk', () => ({
  ApiRoot: jest.fn(),
}));

// Mock the base functions module
jest.mock('../base.functions', () => ({
  readOrderById: jest.fn(),
  readOrderByOrderNumber: jest.fn(),
  updateOrderById: jest.fn(),
  updateOrderByOrderNumber: jest.fn(),
}));

describe('Store Order Functions', () => {
  let mockApiRoot: any;
  let executeFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock chain
    executeFunction = jest.fn();
    const getMock = jest.fn().mockReturnValue({execute: executeFunction});
    const postMock = jest.fn().mockReturnValue({execute: executeFunction});
    const withIdMock = jest.fn().mockReturnValue({
      get: getMock,
      post: postMock,
    });
    const withOrderNumberMock = jest.fn().mockReturnValue({
      get: getMock,
      post: postMock,
    });
    const ordersMock = jest.fn().mockReturnValue({
      get: getMock,
      post: postMock,
      withId: withIdMock,
      withOrderNumber: withOrderNumberMock,
    });
    const inStoreMock = jest.fn().mockReturnValue({orders: ordersMock});
    const withProjectKeyMock = jest.fn().mockReturnValue({
      inStoreKeyWithStoreKeyValue: inStoreMock,
    });

    // Build the complete mock
    mockApiRoot = {
      withProjectKey: withProjectKeyMock,
    };
  });

  describe('readOrderByIdInStore', () => {
    it('should get an order by ID from a store', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'order-123',
        version: 1,
        lineItems: [],
        customLineItems: [],
        totalPrice: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
        orderState: 'Open',
      };

      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await readOrderByIdInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'order-123', storeKey: 'test-store'}
      );

      // Verify store and ID were used correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should include expand parameter when provided', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function with expand
      await readOrderByIdInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'order-123', storeKey: 'test-store', expand: ['lineItems[*]']}
      );

      // Verify function chain
      expect(mockApiRoot.withProjectKey).toHaveBeenCalled();
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalled();
    });
  });

  describe('readOrderByOrderNumberInStore', () => {
    it('should get an order by orderNumber from a store', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'order-456',
        orderNumber: 'ON-123',
        version: 1,
        lineItems: [],
        customLineItems: [],
        totalPrice: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
        orderState: 'Open',
      };

      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await readOrderByOrderNumberInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {orderNumber: 'ON-123', storeKey: 'test-store'}
      );

      // Verify store and orderNumber were used correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('queryOrdersInStore', () => {
    it('should query orders within a store', async () => {
      // Setup mock response
      const mockOrders = {
        count: 2,
        total: 2,
        offset: 0,
        limit: 20,
        results: [{id: 'order-1'}, {id: 'order-2'}],
      };

      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function
      const result = await queryOrdersInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          where: ['createdAt >= "2023-01-01T00:00:00.000Z"'],
          storeKey: 'test-store',
        }
      );

      // Verify store was used correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockOrders);
    });

    it('should include pagination parameters', async () => {
      // Setup mock response
      const mockOrders = {count: 0, results: []};
      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function with pagination
      await queryOrdersInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          where: [],
          storeKey: 'test-store',
          limit: 5,
          offset: 10,
          sort: ['createdAt desc'],
        }
      );

      // Verify function chain
      expect(mockApiRoot.withProjectKey).toHaveBeenCalled();
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalled();
    });
  });

  describe('readStoreOrder', () => {
    it('should call readOrderByIdInStore when id is provided', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123'};
      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await readStoreOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'order-123', storeKey: 'test-store'}
      );

      // Verify correct function was called
      expect(result).toEqual(mockOrder);
    });

    it('should call readOrderByOrderNumberInStore when orderNumber is provided', async () => {
      // Setup mock response
      const mockOrder = {orderNumber: 'ON-123'};
      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await readStoreOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {orderNumber: 'ON-123', storeKey: 'test-store'}
      );

      // Verify correct function was called
      expect(result).toEqual(mockOrder);
    });

    it('should call queryOrdersInStore when only where conditions are provided', async () => {
      // Setup mock response
      const mockOrders = {count: 2, results: []};
      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function
      const result = await readStoreOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {where: ['totalPrice.centAmount > 1000'], storeKey: 'test-store'}
      );

      // Verify correct function was called
      expect(result).toEqual(mockOrders);
    });

    it('should wrap errors in SDKError', async () => {
      // Setup mock to throw error
      const originalError = new Error('API error');
      executeFunction.mockRejectedValueOnce(originalError);

      // Call function and check for wrapped error
      await expect(
        readStoreOrder(
          mockApiRoot,
          {projectKey: 'test-project'},
          {id: 'order-123', storeKey: 'test-store'}
        )
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createOrderFromCartInStore', () => {
    it('should create an order from cart in a store', async () => {
      // Setup mock response
      const mockOrder = {id: 'new-order-123'};
      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await createOrderInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'cart-123', version: 1, storeKey: 'test-store'} as any
      );

      // Verify store was used correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should wrap errors in SDKError', async () => {
      // Setup mock to throw error
      const originalError = new Error('API error');
      executeFunction.mockRejectedValueOnce(originalError);

      // Call function and check for wrapped error
      await expect(
        createOrderInStore(mockApiRoot, {projectKey: 'test-project'}, {
          id: 'cart-123',
          version: 1,
          storeKey: 'test-store',
        } as any)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createOrderFromQuoteInStore', () => {
    it('should create an order from quote in a store', async () => {
      // Setup mock response
      const mockOrder = {id: 'new-order-123'};
      executeFunction.mockResolvedValueOnce({
        body: mockOrder,
      });

      // Call function
      const result = await createOrderInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {quoteId: 'quote-123', version: 1, storeKey: 'test-store'} as any
      );

      // Verify store was used correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrderByIdInStore', () => {
    it('should update an order by ID in a store', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123', version: 2};

      // Mock base function for successful update
      (baseFunctions.updateOrderById as jest.Mock).mockResolvedValueOnce(
        mockOrder
      );

      // Call function
      const result = await updateOrderByIdInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          id: 'order-123',
          version: 1,
          storeKey: 'test-store',
          actions: [{action: 'setOrderNumber', orderNumber: 'NEW-123'}],
        }
      );

      // Verify base function was called correctly
      expect(baseFunctions.updateOrderById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'order-123',
        [{action: 'setOrderNumber', orderNumber: 'NEW-123'}],
        'test-store'
      );
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrderByOrderNumberInStore', () => {
    it('should update an order by orderNumber in a store', async () => {
      // Setup mock response
      const mockOrder = {id: 'order-123', orderNumber: 'ON-123', version: 2};

      // Mock base function for successful update
      (
        baseFunctions.updateOrderByOrderNumber as jest.Mock
      ).mockResolvedValueOnce(mockOrder);

      // Call function
      const result = await updateOrderByOrderNumberInStore(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          orderNumber: 'ON-123',
          version: 1,
          storeKey: 'test-store',
          actions: [{action: 'changeOrderState', orderState: 'Complete'}],
        }
      );

      // Verify base function was called correctly
      expect(baseFunctions.updateOrderByOrderNumber).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'ON-123',
        [{action: 'changeOrderState', orderState: 'Complete'}],
        'test-store'
      );
      expect(result).toEqual(mockOrder);
    });
  });
});

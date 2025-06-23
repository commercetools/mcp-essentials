import {ApiRoot, Order} from '@commercetools/platform-sdk';
import {
  readOrder,
  createOrderFromCart,
  createOrderFromQuote,
  updateOrder,
} from '../functions';
import {SDKError} from '../../errors/sdkError';
import * as baseFunctions from '../base.functions';
import * as asAssociateFunctions from '../as-associate.functions';

// Mock the base functions module
jest.mock('../base.functions', () => ({
  readOrderById: jest.fn(),
  readOrderByOrderNumber: jest.fn(),
  updateOrderById: jest.fn(),
  updateOrderByOrderNumber: jest.fn(),
}));

// Mock the as-associate functions module
jest.mock('../as-associate.functions', () => ({
  readAssociateOrder: jest.fn(),
  createAssociateOrder: jest.fn(),
  updateAssociateOrder: jest.fn(),
}));

// Mock the entire ApiRoot
jest.mock('@commercetools/platform-sdk', () => ({
  ApiRoot: jest.fn(),
}));

describe('Order Functions', () => {
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
    const importOrderMock = jest.fn().mockReturnValue({post: postMock});
    const ordersMock = jest.fn().mockReturnValue({
      get: getMock,
      post: postMock,
      withId: withIdMock,
      withOrderNumber: withOrderNumberMock,
      importOrder: importOrderMock,
    });
    const withProjectKeyMock = jest.fn().mockReturnValue({
      orders: ordersMock,
    });

    // Build the complete mock
    mockApiRoot = {
      withProjectKey: withProjectKeyMock,
    };
  });

  describe('readOrder', () => {
    it('should read an order by ID', async () => {
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

      // Mock the base function
      (baseFunctions.readOrderById as jest.Mock).mockResolvedValueOnce(
        mockOrder
      );

      // Call function
      const result = await readOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'order-123'}
      );

      // Verify base function was called
      expect(baseFunctions.readOrderById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'order-123',
        undefined
      );
      expect(result).toEqual(mockOrder);
    });

    it('should route to associate functions when both customerId and businessUnitKey are present', async () => {
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

      // Mock the associate function
      (
        asAssociateFunctions.readAssociateOrder as jest.Mock
      ).mockResolvedValueOnce(mockOrder);

      // Call function with both customerId and businessUnitKey
      const result = await readOrder(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {id: 'order-123'}
      );

      // Verify associate function was called
      expect(asAssociateFunctions.readAssociateOrder).toHaveBeenCalledWith(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {id: 'order-123'}
      );
      expect(result).toEqual(mockOrder);
    });

    it('should read an order by orderNumber', async () => {
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

      // Call function with orderNumber
      const result = await readOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {orderNumber: 'ON-123'}
      );

      // Verify API was called correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should query orders with where conditions', async () => {
      // Setup mock response for querying orders
      const mockOrders = {
        count: 2,
        total: 2,
        offset: 0,
        limit: 20,
        results: [
          {
            id: 'order-1',
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
          },
          {
            id: 'order-2',
            version: 1,
            lineItems: [],
            customLineItems: [],
            totalPrice: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 2000,
              fractionDigits: 2,
            },
            orderState: 'Complete',
          },
        ],
      };

      executeFunction.mockResolvedValueOnce({
        body: mockOrders,
      });

      // Call function with where conditions
      const result = await readOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {where: ['totalPrice.centAmount > 1000']}
      );

      // Verify API was called correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(result).toEqual(mockOrders);
    });

    it('should wrap errors in SDKError', async () => {
      // Setup mock to throw error
      const originalError = new Error('API error');
      (baseFunctions.readOrderById as jest.Mock).mockRejectedValueOnce(
        new SDKError('Failed to read order by ID', originalError)
      );

      // Call function and check for wrapped error
      await expect(
        readOrder(mockApiRoot, {projectKey: 'test-project'}, {id: 'order-123'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createOrderFromCart', () => {
    it('should create an order from cart', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'new-order-123',
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
      const result = await createOrderFromCart(
        mockApiRoot,
        {projectKey: 'test-project'},
        {id: 'cart-123', version: 1} as any
      );

      // Verify API was called correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should route to associate functions when both customerId and businessUnitKey are present', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'new-order-123',
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

      // Mock the associate function
      (
        asAssociateFunctions.createAssociateOrder as jest.Mock
      ).mockResolvedValueOnce(mockOrder);

      // Call function with both customerId and businessUnitKey
      const result = await createOrderFromCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {id: 'cart-123', version: 1} as any
      );

      // Verify associate function was called
      expect(asAssociateFunctions.createAssociateOrder).toHaveBeenCalledWith(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {id: 'cart-123', version: 1}
      );
      expect(result).toEqual(mockOrder);
    });
  });

  describe('createOrderFromQuote', () => {
    it('should create an order from quote', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'new-order-123',
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

      // Call function without store context
      const result = await createOrderFromQuote(
        mockApiRoot,
        {projectKey: 'test-project'},
        {quoteId: 'quote-123', version: 1} as any
      );

      // Verify API was called correctly
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrder', () => {
    it('should update an order by ID', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'order-123',
        version: 2,
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

      // Mock base function for successful update
      (baseFunctions.updateOrderById as jest.Mock).mockResolvedValueOnce(
        mockOrder
      );

      // Call function without store context
      const result = await updateOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          id: 'order-123',
          version: 1,
          actions: [{action: 'setOrderNumber', orderNumber: 'NEW-123'}],
        }
      );

      // Verify that the base function was called correctly
      expect(baseFunctions.updateOrderById).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should route to associate functions when both customerId and businessUnitKey are present', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'order-123',
        version: 2,
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

      // Mock the associate function
      (
        asAssociateFunctions.updateAssociateOrder as jest.Mock
      ).mockResolvedValueOnce(mockOrder);

      // Call function with both customerId and businessUnitKey
      const result = await updateOrder(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {
          id: 'order-123',
          version: 1,
          actions: [{action: 'setOrderNumber', orderNumber: 'NEW-123'}],
        }
      );

      // Verify associate function was called
      expect(asAssociateFunctions.updateAssociateOrder).toHaveBeenCalledWith(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'associate-123',
          businessUnitKey: 'business-unit-456',
        },
        {
          id: 'order-123',
          version: 1,
          actions: [{action: 'setOrderNumber', orderNumber: 'NEW-123'}],
        }
      );
      expect(result).toEqual(mockOrder);
    });

    it('should update an order by orderNumber', async () => {
      // Setup mock response
      const mockOrder: Partial<Order> = {
        id: 'order-123',
        orderNumber: 'ON-123',
        version: 2,
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

      // Mock base function for successful update
      (
        baseFunctions.updateOrderByOrderNumber as jest.Mock
      ).mockResolvedValueOnce(mockOrder);

      // Call function without store context
      const result = await updateOrder(
        mockApiRoot,
        {projectKey: 'test-project'},
        {
          orderNumber: 'ON-123',
          version: 1,
          actions: [{action: 'changeOrderState', orderState: 'Complete'}],
        }
      );

      // Verify that the base function was called correctly
      expect(baseFunctions.updateOrderByOrderNumber).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });
});

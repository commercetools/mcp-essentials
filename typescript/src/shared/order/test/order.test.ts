import {readOrder, createOrder, updateOrder} from '../admin.functions';
import {
  readStoreOrder,
  createOrderInStore,
  updateOrderByIdInStore,
  updateOrderByOrderNumberInStore,
} from '../store.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {SDKError} from '../../errors/sdkError';
import {createOrderParameters} from '../parameters';
import z from 'zod';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn(() => ({execute: mockExecute}));
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockWithOrderNumber = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockWithId = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockImportOrder = jest.fn(() => ({post: mockPost}));
const mockFromQuote = jest.fn(() => ({post: mockPost}));
const mockOrders = jest.fn(() => ({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withOrderNumber: mockWithOrderNumber,
  importOrder: mockImportOrder,
  fromQuote: mockFromQuote,
}));
const mockInStoreKeyWithStoreKeyValue = jest.fn(() => ({
  orders: mockOrders,
}));
const mockWithProjectKey = jest.fn(() => ({
  orders: mockOrders,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

describe('Order Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue({body: {}});
  });

  describe('readOrder', () => {
    it('should read order by ID', async () => {
      await readOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read order by order number', async () => {
      await readOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('readStoreOrder', () => {
    it('should read order in store by ID', async () => {
      await readStoreOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        storeKey: 'test-store',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read order by order number in store', async () => {
      await readStoreOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
        storeKey: 'test-store',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read order by ID with expand', async () => {
      await readOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        expand: ['lineItems[*].state[*]'],
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems[*].state[*]']},
      });
    });

    it('should read order by order number with expand', async () => {
      await readOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
        expand: ['lineItems[*].state[*]'],
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems[*].state[*]']},
      });
    });

    it('should read order by ID in store with expand', async () => {
      await readStoreOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        storeKey: 'test-store',
        expand: ['lineItems[*].state[*]'],
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems[*].state[*]']},
      });
    });

    it('should read order by order number in store with expand', async () => {
      await readStoreOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
        storeKey: 'test-store',
        expand: ['lineItems[*].state[*]'],
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems[*].state[*]']},
      });
    });

    it('should query orders with where', async () => {
      await readOrder(mockApiRoot, mockContext, {
        where: ['customerEmail = "test@example.com"'],
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerEmail = "test@example.com"'],
          limit: 10, // default limit
        },
      });
    });

    it('should query orders with where in store', async () => {
      await readStoreOrder(mockApiRoot, mockContext, {
        where: ['customerEmail = "test@example.com"'],
        storeKey: 'test-store',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerEmail = "test@example.com"'],
          limit: 10, // default limit
        },
      });
    });

    it('should query orders with all query parameters', async () => {
      const queryArgs = {
        where: ['customerEmail = "test@example.com"'],
        limit: 5,
        offset: 1,
        sort: ['createdAt asc'],
        expand: ['paymentInfo.payments[*]'],
      };
      await readOrder(mockApiRoot, mockContext, queryArgs);
      expect(mockGet).toHaveBeenCalledWith({queryArgs});
    });

    it('should query orders with all query parameters in store', async () => {
      const queryArgs = {
        storeKey: 'test-store',
        where: ['customerEmail = "test@example.com"'],
        limit: 5,
        offset: 1,
        sort: ['createdAt asc'],
        expand: ['paymentInfo.payments[*]'],
      };
      await readStoreOrder(mockApiRoot, mockContext, queryArgs);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: queryArgs.where,
          limit: queryArgs.limit,
          offset: queryArgs.offset,
          sort: queryArgs.sort,
          expand: queryArgs.expand,
        },
      });
    });

    it('should throw error if no id, orderNumber or where is provided', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Failed to read order'));
      await expect(readOrder(mockApiRoot, mockContext, {})).rejects.toThrow(
        'Failed to read order'
      );
    });

    it('should throw SDKError on API failure for ID', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));
      await expect(
        readOrder(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow(
        'Failed to read order: Failed to read order by ID: API Error'
      );
    });

    it('should throw SDKError on API failure for orderNumber', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));
      await expect(
        readOrder(mockApiRoot, mockContext, {orderNumber: 'test-num'})
      ).rejects.toThrow('Failed to read order: API Error');
    });

    it('should throw SDKError on API failure for where', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));
      await expect(
        readOrder(mockApiRoot, mockContext, {where: ['some query']})
      ).rejects.toThrow('Failed to read order: API Error');
    });
  });

  describe('createOrderFromCart', () => {
    it('should create order from cart', async () => {
      await createOrder(mockApiRoot, mockContext, {
        id: 'test-cart-id',
        version: 1,
      } as any);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('createOrderFromCartInStore', () => {
    it('should create order from cart in store', async () => {
      await createOrderInStore(mockApiRoot, mockContext, {
        id: 'test-cart-id',
        version: 1,
        storeKey: 'test-store',
      } as any);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create order from cart with orderNumber', async () => {
      const params = {id: 'test-cart-id', version: 1, orderNumber: 'order-123'};
      await createOrder(mockApiRoot, mockContext, params as any);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          cart: {id: params.id, typeId: 'cart'},
          version: params.version,
          orderNumber: params.orderNumber,
        },
      });
    });

    it('should create order from cart in store with orderNumber', async () => {
      const params = {
        id: 'test-cart-id',
        version: 1,
        orderNumber: 'order-123',
        storeKey: 'test-store',
      };
      await createOrderInStore(mockApiRoot, mockContext, params as any);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: params.storeKey,
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          cart: {id: params.id, typeId: 'cart'},
          version: params.version,
          orderNumber: params.orderNumber,
        },
      });
    });

    it('should throw SDKError on API failure', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Create Error'));
      await expect(
        createOrder(mockApiRoot, mockContext, {
          id: 'fail-cart-id',
          version: 1,
        } as any)
      ).rejects.toThrow(
        new SDKError('Failed to create order', new Error('API Create Error'))
      );
    });
  });

  describe('updateOrder', () => {
    it('should update order by ID', async () => {
      await updateOrder(mockApiRoot, mockContext, {
        id: 'test-order-id',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-order-id'});
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update order by order number', async () => {
      await updateOrder(mockApiRoot, mockContext, {
        orderNumber: 'test-order-number',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'test-order-number',
      });
      expect(mockPost).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update order by ID in store', async () => {
      const params = {
        id: 'test-order-id',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'} as any],
        storeKey: 'test-store',
      };

      // Mock the readOrderById to return a version
      mockExecute.mockImplementationOnce(() =>
        Promise.resolve({body: {version: params.version}})
      );

      await updateOrderByIdInStore(mockApiRoot, mockContext, params);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: params.storeKey,
      });
      expect(mockWithId).toHaveBeenCalledWith({ID: params.id});
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: params.version, actions: params.actions},
      });
    });

    it('should update order by order number in store', async () => {
      const params = {
        orderNumber: 'test-order-number',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'} as any],
        storeKey: 'test-store',
      };

      // Mock the readOrderByOrderNumber to return a version
      mockExecute.mockImplementationOnce(() =>
        Promise.resolve({body: {version: params.version}})
      );

      await updateOrderByOrderNumberInStore(mockApiRoot, mockContext, params);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: params.storeKey,
      });
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: params.orderNumber,
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: params.version, actions: params.actions},
      });
    });

    it('should throw error if no id or orderNumber is provided for update', async () => {
      await expect(
        updateOrder(mockApiRoot, mockContext, {version: 1, actions: []})
      ).rejects.toThrow('Failed to update order');
    });

    it('should throw SDKError on API failure for update by ID', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Update Error'));
      await expect(
        updateOrder(mockApiRoot, mockContext, {
          id: 'fail-id',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow(
        'Failed to update order: Failed to update order by ID: Failed to read order by ID: API Update Error'
      );
    });

    it('should throw SDKError on API failure for update by orderNumber', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Update Error'));
      await expect(
        updateOrder(mockApiRoot, mockContext, {
          orderNumber: 'fail-num',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow(
        'Failed to update order: Failed to update order by order number: Failed to read order by order number: API Update Error'
      );
    });

    it('should throw SDKError on API failure for update by ID in store', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Update Error'));
      await expect(
        updateOrder(mockApiRoot, mockContext, {
          id: 'fail-id',
          storeKey: 'test-store',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow(
        'Failed to update order: Failed to update order by ID: Failed to read order by ID: API Update Error'
      );
    });

    it('should throw SDKError on API failure for update by orderNumber in store', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Update Error'));
      await expect(
        updateOrder(mockApiRoot, mockContext, {
          orderNumber: 'fail-num',
          storeKey: 'test-store',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow(
        'Failed to update order: Failed to update order by order number: Failed to read order by order number: API Update Error'
      );
    });
  });

  describe('createOrderFromQuote', () => {
    it('should create order from quote', async () => {
      const params = {quoteId: 'test-quote-id', version: 1};
      await createOrder(mockApiRoot, mockContext, params as any);
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      // This assertion needs to be against the correct mock for create from quote
      // Assuming mockOrders().post is used for non-specific posts in this structure
      expect(mockOrders).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          quote: {id: params.quoteId, typeId: 'quote'},
          version: params.version,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create order from quote with orderNumber', async () => {
      const params = {
        quoteId: 'test-quote-id',
        version: 1,
        orderNumber: 'quote-order-123',
      };
      await createOrder(mockApiRoot, mockContext, params as any);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          quote: {id: params.quoteId, typeId: 'quote'},
          version: params.version,
          orderNumber: params.orderNumber,
        },
      });
    });

    it('should create order from quote in store', async () => {
      const params = {
        quoteId: 'test-quote-id',
        version: 1,
        storeKey: 'test-store',
      };
      await createOrderInStore(mockApiRoot, mockContext, params as any);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: params.storeKey,
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          quote: {id: params.quoteId, typeId: 'quote'},
          version: params.version,
        },
      });
    });

    it('should create order from quote in store with orderNumber', async () => {
      const params = {
        quoteId: 'test-quote-id',
        version: 1,
        orderNumber: 'quote-order-123',
        storeKey: 'test-store',
      };
      await createOrderInStore(mockApiRoot, mockContext, params as any);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: params.storeKey,
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          quote: {id: params.quoteId, typeId: 'quote'},
          version: params.version,
          orderNumber: params.orderNumber,
        },
      });
    });

    it('should throw SDKError on API failure for create from quote', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Quote Error'));
      await expect(
        createOrder(mockApiRoot, mockContext, {
          quoteId: 'fail-quote-id',
          version: 1,
        } as any)
      ).rejects.toThrow(
        new SDKError('Failed to create order', new Error('API Quote Error'))
      );
    });

    it('should throw SDKError on API failure for create from quote in store', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Quote Store Error'));
      await expect(
        createOrderInStore(mockApiRoot, mockContext, {
          quoteId: 'fail-quote-id',
          version: 1,
          storeKey: 'test-store',
        } as any)
      ).rejects.toThrow(
        new SDKError(
          'Failed to create order in store',
          new Error('API Quote Store Error')
        )
      );
    });
  });

  describe('createOrderByImport', () => {
    const baseImportParams = {
      totalPrice: {
        currencyCode: 'USD',
        centAmount: 10000,
      },
    };
    const lineItem = {
      id: 'line-item-id-1',
      name: {en: 'Test Product'},
      productId: 'prod-id',
      variant: {
        id: 1,
        sku: 'SKU123',
      },
      quantity: 1,
    };

    it('should create order by import with minimal params', async () => {
      await createOrder(mockApiRoot, mockContext, baseImportParams as any);
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockImportOrder).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          totalPrice: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 10000,
            fractionDigits: 2,
          },
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create order by import with all params', async () => {
      const params = {
        ...baseImportParams,
        orderNumber: 'import-123',
        customerId: 'cust-id',
        customerEmail: 'test@example.com',
        store: {key: 'test-store', typeId: 'store' as const},
        lineItems: [lineItem],
      };
      await createOrder(mockApiRoot, mockContext, params as any);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          orderNumber: params.orderNumber,
          customerId: params.customerId,
          customerEmail: params.customerEmail,
          store: params.store,
          lineItems: [
            {
              name: lineItem.name,
              productId: lineItem.productId,
              variant: {
                id: lineItem.variant.id,
                sku: lineItem.variant.sku,
              },
              quantity: lineItem.quantity,
              price: {
                value: {
                  type: 'centPrecision',
                  currencyCode: params.totalPrice.currencyCode,
                  centAmount: params.totalPrice.centAmount,
                  fractionDigits: 2,
                },
              },
            },
          ],
          totalPrice: {
            type: 'centPrecision',
            currencyCode: params.totalPrice.currencyCode,
            centAmount: params.totalPrice.centAmount,
            fractionDigits: 2,
          },
        },
      });
    });

    it('should throw SDKError on API failure for import', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Import Error'));
      await expect(
        createOrder(mockApiRoot, mockContext, baseImportParams as any)
      ).rejects.toThrow(
        new SDKError('Failed to create order', new Error('API Import Error'))
      );
    });
  });
});

import {ApiRoot, OrderUpdateAction} from '@commercetools/platform-sdk';
import {
  readOrderById,
  readOrderByOrderNumber,
  updateOrderById,
  updateOrderByOrderNumber,
  queryOrders,
  verifyOrderBelongsToCustomer,
  readOrderByIdAsAssociate,
  readOrderByOrderNumberAsAssociate,
  queryOrdersAsAssociate,
  createOrderFromCartAsAssociate,
  createOrderFromQuoteAsAssociate,
  updateOrderByIdAsAssociate,
  updateOrderByOrderNumberAsAssociate,
} from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the commercetools platform SDK
const mockExecute = jest.fn();
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithOrderNumber = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockOrderQuote = jest.fn().mockReturnValue({
  post: mockPost,
});
const mockOrders = jest.fn().mockReturnValue({
  withId: mockWithId,
  withOrderNumber: mockWithOrderNumber,
  get: mockGet,
  post: mockPost,
  orderQuote: mockOrderQuote,
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  orders: mockOrders,
});
const mockInBusinessUnitKeyWithBusinessUnitKeyValue = jest
  .fn()
  .mockReturnValue({
    orders: mockOrders,
  });
const mockWithAssociateIdValue = jest.fn().mockReturnValue({
  inBusinessUnitKeyWithBusinessUnitKeyValue:
    mockInBusinessUnitKeyWithBusinessUnitKeyValue,
});
const mockAsAssociate = jest.fn().mockReturnValue({
  withAssociateIdValue: mockWithAssociateIdValue,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  orders: mockOrders,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
  asAssociate: mockAsAssociate,
});

const mockApiRoot: ApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

describe('Order Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readOrderById', () => {
    it('should read order by ID without storeKey', async () => {
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrder});

      const result = await readOrderById(
        mockApiRoot,
        'test-project',
        'order-123'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'order-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockOrder);
    });

    it('should read order by ID with storeKey', async () => {
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrder});

      const result = await readOrderById(
        mockApiRoot,
        'test-project',
        'order-123',
        undefined,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'order-123'});
      expect(result).toEqual(mockOrder);
    });

    it('should read order by ID with expand parameter', async () => {
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrder});

      const result = await readOrderById(
        mockApiRoot,
        'test-project',
        'order-123',
        ['lineItems', 'paymentInfo']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['lineItems', 'paymentInfo'],
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should handle errors when reading order by ID', async () => {
      const mockError = new Error('Order not found');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        readOrderById(mockApiRoot, 'test-project', 'order-123')
      ).rejects.toThrow(SDKError);

      try {
        await readOrderById(mockApiRoot, 'test-project', 'order-123');
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read order by ID');
      }
    });
  });

  describe('readOrderByOrderNumber', () => {
    it('should read order by order number without storeKey', async () => {
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrder});

      const result = await readOrderByOrderNumber(
        mockApiRoot,
        'test-project',
        'ORDER-001'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'ORDER-001',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockOrder);
    });

    it('should read order by order number with storeKey and expand', async () => {
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrder});

      const result = await readOrderByOrderNumber(
        mockApiRoot,
        'test-project',
        'ORDER-001',
        ['cart'],
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'ORDER-001',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['cart'],
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should handle errors when reading order by order number', async () => {
      const mockError = new Error('Order not found');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        readOrderByOrderNumber(mockApiRoot, 'test-project', 'ORDER-001')
      ).rejects.toThrow(SDKError);

      try {
        await readOrderByOrderNumber(mockApiRoot, 'test-project', 'ORDER-001');
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read order by order number'
        );
      }
    });
  });

  describe('updateOrderById', () => {
    beforeEach(() => {
      // Mock readOrderById for updateOrderById function
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 2,
      };
      mockExecute.mockResolvedValueOnce({body: mockOrder}); // First call for readOrderById
    });

    it('should update order by ID without storeKey', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'changeOrderState',
          orderState: 'Confirmed',
        },
      ];
      const mockUpdatedOrder = {
        id: 'order-123',
        orderState: 'Confirmed',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

      const result = await updateOrderById(
        mockApiRoot,
        'test-project',
        'order-123',
        actions
      );

      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readOrderById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should update order by ID with storeKey', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'addDelivery',
          address: {
            country: 'US',
          },
        },
      ];
      const mockUpdatedOrder = {
        id: 'order-123',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

      const result = await updateOrderById(
        mockApiRoot,
        'test-project',
        'order-123',
        actions,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readOrderById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should handle errors when updating order by ID', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'changeOrderState',
          orderState: 'Confirmed',
        },
      ];
      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError); // Second call for update

      await expect(
        updateOrderById(mockApiRoot, 'test-project', 'order-123', actions)
      ).rejects.toThrow(SDKError);

      try {
        await updateOrderById(
          mockApiRoot,
          'test-project',
          'order-123',
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update order by ID'
        );
      }
    });
  });

  describe('updateOrderByOrderNumber', () => {
    beforeEach(() => {
      // Mock readOrderByOrderNumber for updateOrderByOrderNumber function
      const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORDER-001',
        version: 2,
      };
      mockExecute.mockResolvedValueOnce({body: mockOrder}); // First call for readOrderByOrderNumber
    });

    it('should update order by order number without storeKey', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'setOrderNumber',
          orderNumber: 'NEW-ORDER-001',
        },
      ];
      const mockUpdatedOrder = {
        id: 'order-123',
        orderNumber: 'NEW-ORDER-001',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

      const result = await updateOrderByOrderNumber(
        mockApiRoot,
        'test-project',
        'ORDER-001',
        actions
      );

      expect(mockWithOrderNumber).toHaveBeenCalledWith({
        orderNumber: 'ORDER-001',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readOrderByOrderNumber
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should update order by order number with storeKey', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'changeOrderState',
          orderState: 'Cancelled',
        },
      ];
      const mockUpdatedOrder = {
        id: 'order-123',
        orderState: 'Cancelled',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

      const result = await updateOrderByOrderNumber(
        mockApiRoot,
        'test-project',
        'ORDER-001',
        actions,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should handle errors when updating order by order number', async () => {
      const actions: OrderUpdateAction[] = [
        {
          action: 'changeOrderState',
          orderState: 'Confirmed',
        },
      ];
      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError); // Second call for update

      await expect(
        updateOrderByOrderNumber(
          mockApiRoot,
          'test-project',
          'ORDER-001',
          actions
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateOrderByOrderNumber(
          mockApiRoot,
          'test-project',
          'ORDER-001',
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update order by order number'
        );
      }
    });
  });

  describe('queryOrders', () => {
    it('should query orders with all parameters', async () => {
      const mockOrdersResponse = {
        results: [
          {
            id: 'order-123',
            orderNumber: 'ORDER-001',
            version: 1,
          },
        ],
        total: 1,
        count: 1,
        offset: 10,
        limit: 20,
      };
      mockExecute.mockResolvedValue({body: mockOrdersResponse});

      const result = await queryOrders(
        mockApiRoot,
        'test-project',
        ['customerId="customer-123"'],
        20,
        10,
        ['createdAt desc'],
        ['lineItems'],
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-123"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['lineItems'],
        },
      });
      expect(result).toEqual(mockOrdersResponse);
    });

    it('should query orders with minimal parameters (default limit)', async () => {
      const mockOrdersResponse = {
        results: [],
        total: 0,
        count: 0,
        offset: 0,
        limit: 10,
      };
      mockExecute.mockResolvedValue({body: mockOrdersResponse});

      const result = await queryOrders(mockApiRoot, 'test-project', [
        'orderState="Open"',
      ]);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockOrders).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['orderState="Open"'],
          limit: 10, // Default limit
        },
      });
      expect(result).toEqual(mockOrdersResponse);
    });

    it('should handle errors when querying orders', async () => {
      const mockError = new Error('Query failed');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        queryOrders(mockApiRoot, 'test-project', ['customerId="customer-123"'])
      ).rejects.toThrow(SDKError);

      try {
        await queryOrders(mockApiRoot, 'test-project', [
          'customerId="customer-123"',
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to query orders');
      }
    });
  });

  describe('verifyOrderBelongsToCustomer', () => {
    it('should verify order belongs to customer by ID', async () => {
      const mockOrdersResponse = {
        results: [
          {
            id: 'order-123',
            customerId: 'customer-123',
          },
        ],
        count: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrdersResponse});

      const result = await verifyOrderBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        'order-123'
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-123"', 'id="order-123"'],
          limit: 1,
        },
      });
      expect(result).toBe(true);
    });

    it('should verify order belongs to customer by order number', async () => {
      const mockOrdersResponse = {
        results: [
          {
            id: 'order-123',
            orderNumber: 'ORDER-001',
            customerId: 'customer-123',
          },
        ],
        count: 1,
      };
      mockExecute.mockResolvedValue({body: mockOrdersResponse});

      const result = await verifyOrderBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        undefined,
        'ORDER-001',
        'test-store'
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-123"', 'orderNumber="ORDER-001"'],
          limit: 1,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false when order does not belong to customer', async () => {
      const mockOrdersResponse = {
        results: [],
        count: 0,
      };
      mockExecute.mockResolvedValue({body: mockOrdersResponse});

      const result = await verifyOrderBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        'order-456'
      );

      expect(result).toBe(false);
    });

    it('should throw error when neither ID nor order number provided', async () => {
      await expect(
        verifyOrderBelongsToCustomer(
          mockApiRoot,
          'test-project',
          'customer-123'
        )
      ).rejects.toThrow(SDKError);

      try {
        await verifyOrderBelongsToCustomer(
          mockApiRoot,
          'test-project',
          'customer-123'
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to verify order ownership'
        );
      }
    });
  });

  describe('Associate Functions', () => {
    describe('readOrderByIdAsAssociate', () => {
      it('should read order by ID as associate', async () => {
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'ORDER-001',
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await readOrderByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'order-123'
        );

        expect(mockWithProjectKey).toHaveBeenCalledWith({
          projectKey: 'test-project',
        });
        expect(mockAsAssociate).toHaveBeenCalled();
        expect(mockWithAssociateIdValue).toHaveBeenCalledWith({
          associateId: 'associate-123',
        });
        expect(
          mockInBusinessUnitKeyWithBusinessUnitKeyValue
        ).toHaveBeenCalledWith({
          businessUnitKey: 'business-unit-key',
        });
        expect(mockOrders).toHaveBeenCalled();
        expect(mockWithId).toHaveBeenCalledWith({ID: 'order-123'});
        expect(mockGet).toHaveBeenCalledWith({
          queryArgs: {},
        });
        expect(result).toEqual(mockOrder);
      });

      it('should read order by ID as associate with expand', async () => {
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'ORDER-001',
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await readOrderByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'order-123',
          ['cart', 'paymentInfo']
        );

        expect(mockGet).toHaveBeenCalledWith({
          queryArgs: {
            expand: ['cart', 'paymentInfo'],
          },
        });
        expect(result).toEqual(mockOrder);
      });

      it('should handle errors when reading order by ID as associate', async () => {
        const mockError = new Error('Order not found');
        mockExecute.mockRejectedValue(mockError);

        await expect(
          readOrderByIdAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'order-123'
          )
        ).rejects.toThrow(SDKError);

        try {
          await readOrderByIdAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'order-123'
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to read order by ID as associate'
          );
        }
      });
    });

    describe('readOrderByOrderNumberAsAssociate', () => {
      it('should read order by order number as associate', async () => {
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'ORDER-001',
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await readOrderByOrderNumberAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'ORDER-001'
        );

        expect(mockWithOrderNumber).toHaveBeenCalledWith({
          orderNumber: 'ORDER-001',
        });
        expect(result).toEqual(mockOrder);
      });

      it('should handle errors when reading order by order number as associate', async () => {
        const mockError = new Error('Order not found');
        mockExecute.mockRejectedValue(mockError);

        await expect(
          readOrderByOrderNumberAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'ORDER-001'
          )
        ).rejects.toThrow(SDKError);

        try {
          await readOrderByOrderNumberAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'ORDER-001'
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to read order by order number as associate'
          );
        }
      });
    });

    describe('queryOrdersAsAssociate', () => {
      it('should query orders as associate with all parameters', async () => {
        const mockOrdersResponse = {
          results: [
            {
              id: 'order-123',
              orderNumber: 'ORDER-001',
              version: 1,
            },
          ],
          total: 1,
          count: 1,
          offset: 5,
          limit: 15,
        };
        mockExecute.mockResolvedValue({body: mockOrdersResponse});

        const result = await queryOrdersAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          ['orderState="Open"'],
          15,
          5,
          ['createdAt desc'],
          ['lineItems']
        );

        expect(mockGet).toHaveBeenCalledWith({
          queryArgs: {
            where: ['orderState="Open"'],
            limit: 15,
            offset: 5,
            sort: ['createdAt desc'],
            expand: ['lineItems'],
          },
        });
        expect(result).toEqual(mockOrdersResponse);
      });

      it('should query orders as associate with minimal parameters', async () => {
        const mockOrdersResponse = {
          results: [],
          total: 0,
          count: 0,
          offset: 0,
          limit: 10,
        };
        mockExecute.mockResolvedValue({body: mockOrdersResponse});

        const result = await queryOrdersAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key'
        );

        expect(mockGet).toHaveBeenCalledWith({
          queryArgs: {
            limit: 10, // Default limit
          },
        });
        expect(result).toEqual(mockOrdersResponse);
      });

      it('should handle errors when querying orders as associate', async () => {
        const mockError = new Error('Query failed');
        mockExecute.mockRejectedValue(mockError);

        await expect(
          queryOrdersAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key'
          )
        ).rejects.toThrow(SDKError);

        try {
          await queryOrdersAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key'
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to query orders as associate'
          );
        }
      });
    });

    describe('createOrderFromCartAsAssociate', () => {
      it('should create order from cart as associate without order number', async () => {
        const mockOrder = {
          id: 'order-123',
          cart: {
            id: 'cart-123',
          },
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await createOrderFromCartAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'cart-123',
          1
        );

        expect(mockPost).toHaveBeenCalledWith({
          body: {
            id: 'cart-123',
            version: 1,
          },
        });
        expect(result).toEqual(mockOrder);
      });

      it('should create order from cart as associate with order number', async () => {
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'CUSTOM-ORDER-001',
          cart: {
            id: 'cart-123',
          },
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await createOrderFromCartAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'cart-123',
          1,
          'CUSTOM-ORDER-001'
        );

        expect(mockPost).toHaveBeenCalledWith({
          body: {
            id: 'cart-123',
            version: 1,
            orderNumber: 'CUSTOM-ORDER-001',
          },
        });
        expect(result).toEqual(mockOrder);
      });

      it('should handle errors when creating order from cart as associate', async () => {
        const mockError = new Error('Creation failed');
        mockExecute.mockRejectedValue(mockError);

        await expect(
          createOrderFromCartAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'cart-123',
            1
          )
        ).rejects.toThrow(SDKError);

        try {
          await createOrderFromCartAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'cart-123',
            1
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to create order from cart as associate'
          );
        }
      });
    });

    describe('createOrderFromQuoteAsAssociate', () => {
      it('should create order from quote as associate without order number', async () => {
        const mockOrder = {
          id: 'order-123',
          quote: {
            id: 'quote-123',
          },
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await createOrderFromQuoteAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123',
          1
        );

        expect(mockOrderQuote).toHaveBeenCalled();
        expect(mockPost).toHaveBeenCalledWith({
          body: {
            quote: {
              typeId: 'quote',
              id: 'quote-123',
            },
            version: 1,
          },
        });
        expect(result).toEqual(mockOrder);
      });

      it('should create order from quote as associate with order number', async () => {
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'QUOTE-ORDER-001',
          quote: {
            id: 'quote-123',
          },
          version: 1,
        };
        mockExecute.mockResolvedValue({body: mockOrder});

        const result = await createOrderFromQuoteAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123',
          1,
          'QUOTE-ORDER-001'
        );

        expect(mockPost).toHaveBeenCalledWith({
          body: {
            quote: {
              typeId: 'quote',
              id: 'quote-123',
            },
            version: 1,
            orderNumber: 'QUOTE-ORDER-001',
          },
        });
        expect(result).toEqual(mockOrder);
      });

      it('should handle errors when creating order from quote as associate', async () => {
        const mockError = new Error('Creation failed');
        mockExecute.mockRejectedValue(mockError);

        await expect(
          createOrderFromQuoteAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'quote-123',
            1
          )
        ).rejects.toThrow(SDKError);

        try {
          await createOrderFromQuoteAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'quote-123',
            1
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to create order from quote as associate'
          );
        }
      });
    });

    describe('updateOrderByIdAsAssociate', () => {
      beforeEach(() => {
        // Mock readOrderByIdAsAssociate for updateOrderByIdAsAssociate function
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'ORDER-001',
          version: 2,
        };
        mockExecute.mockResolvedValueOnce({body: mockOrder}); // First call for readOrderByIdAsAssociate
      });

      it('should update order by ID as associate', async () => {
        const actions: OrderUpdateAction[] = [
          {
            action: 'changeOrderState',
            orderState: 'Confirmed',
          },
        ];
        const mockUpdatedOrder = {
          id: 'order-123',
          orderState: 'Confirmed',
          version: 3,
        };
        mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

        const result = await updateOrderByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'order-123',
          actions
        );

        expect(mockPost).toHaveBeenCalledWith({
          body: {
            version: 2, // Uses current version from readOrderByIdAsAssociate
            actions,
          },
        });
        expect(result).toEqual(mockUpdatedOrder);
      });

      it('should handle errors when updating order by ID as associate', async () => {
        const actions: OrderUpdateAction[] = [
          {
            action: 'changeOrderState',
            orderState: 'Confirmed',
          },
        ];
        const mockError = new Error('Update failed');
        mockExecute.mockRejectedValueOnce(mockError); // Second call for update

        await expect(
          updateOrderByIdAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'order-123',
            actions
          )
        ).rejects.toThrow(SDKError);

        try {
          await updateOrderByIdAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'order-123',
            actions
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to update order by ID as associate'
          );
        }
      });
    });

    describe('updateOrderByOrderNumberAsAssociate', () => {
      beforeEach(() => {
        // Mock readOrderByOrderNumberAsAssociate for updateOrderByOrderNumberAsAssociate function
        const mockOrder = {
          id: 'order-123',
          orderNumber: 'ORDER-001',
          version: 2,
        };
        mockExecute.mockResolvedValueOnce({body: mockOrder}); // First call for readOrderByOrderNumberAsAssociate
      });

      it('should update order by order number as associate', async () => {
        const actions: OrderUpdateAction[] = [
          {
            action: 'setOrderNumber',
            orderNumber: 'NEW-ORDER-001',
          },
        ];
        const mockUpdatedOrder = {
          id: 'order-123',
          orderNumber: 'NEW-ORDER-001',
          version: 3,
        };
        mockExecute.mockResolvedValueOnce({body: mockUpdatedOrder}); // Second call for update

        const result = await updateOrderByOrderNumberAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'ORDER-001',
          actions
        );

        expect(mockWithOrderNumber).toHaveBeenCalledWith({
          orderNumber: 'ORDER-001',
        });
        expect(mockPost).toHaveBeenCalledWith({
          body: {
            version: 2, // Uses current version from readOrderByOrderNumberAsAssociate
            actions,
          },
        });
        expect(result).toEqual(mockUpdatedOrder);
      });

      it('should handle errors when updating order by order number as associate', async () => {
        const actions: OrderUpdateAction[] = [
          {
            action: 'changeOrderState',
            orderState: 'Confirmed',
          },
        ];
        const mockError = new Error('Update failed');
        mockExecute.mockRejectedValueOnce(mockError); // Second call for update

        await expect(
          updateOrderByOrderNumberAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'ORDER-001',
            actions
          )
        ).rejects.toThrow(SDKError);

        try {
          await updateOrderByOrderNumberAsAssociate(
            mockApiRoot,
            'test-project',
            'associate-123',
            'business-unit-key',
            'ORDER-001',
            actions
          );
        } catch (error) {
          expect(error).toBeInstanceOf(SDKError);
          expect((error as SDKError).message).toBe(
            'Failed to update order by order number as associate'
          );
        }
      });
    });
  });
});

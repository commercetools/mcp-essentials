import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readQuoteRequest,
  createQuoteRequest,
  updateQuoteRequest,
} from '../admin.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Request Admin Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: {projectKey: string};

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
    };
  });

  describe('readQuoteRequest', () => {
    it('should read quote request by ID', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        expand: ['customer'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        ['customer']
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by ID without expand', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        undefined
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
        expand: ['cart'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        ['cart']
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by key without expand', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        undefined
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by customer ID', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        customerId: 'customer-123',
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customer(id="customer-123")'],
        20,
        10,
        ['createdAt desc'],
        ['customer'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should read quote request by customer ID with minimal parameters', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        customerId: 'customer-123',
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customer(id="customer-123")'],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should query quote requests with where conditions', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        where: ['quoteRequestState="Submitted"'],
        limit: 50,
        offset: 25,
        sort: ['lastModifiedAt desc'],
        expand: ['customer', 'cart'],
        storeKey: 'store-key',
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['quoteRequestState="Submitted"'],
        50,
        25,
        ['lastModifiedAt desc'],
        ['customer', 'cart'],
        'store-key'
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should query quote requests with where conditions only', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        where: ['quoteRequestState="Rejected"'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['quoteRequestState="Rejected"'],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should return all quote requests with pagination', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        limit: 100,
        offset: 0,
        sort: ['createdAt asc'],
        expand: ['customer'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        100,
        0,
        ['createdAt asc'],
        ['customer'],
        undefined
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should return all quote requests with minimal parameters', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {};

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.readQuoteRequestById as jest.Mock).mockRejectedValue(
        error
      );

      const params = {id: 'qr-123'};

      await expect(
        readQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequest(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote request'
        );
      }
    });
  });

  describe('createQuoteRequest', () => {
    it('should create quote request with store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.createQuoteRequest as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        cart: {typeId: 'cart' as const, id: 'cart-123'},
        cartVersion: 1,
        storeKey: 'test-store',
        comment: 'Please provide discount',
      };

      const result = await createQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          cart: {typeId: 'cart', id: 'cart-123'},
          cartVersion: 1,
          storeKey: 'test-store',
          comment: 'Please provide discount',
        },
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should create quote request without store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.createQuoteRequest as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        cart: {typeId: 'cart' as const, id: 'cart-123'},
        cartVersion: 1,
        comment: 'Request for quote',
      };

      const result = await createQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          cart: {typeId: 'cart', id: 'cart-123'},
          cartVersion: 1,
          comment: 'Request for quote',
        }
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should create quote request with all optional parameters', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.createQuoteRequest as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
        cart: {typeId: 'cart' as const, id: 'cart-123'},
        cartVersion: 1,
        comment: 'Bulk order discount request',
        custom: {
          type: {typeId: 'type' as const, id: 'custom-type-id'},
          fields: {priority: 'high'},
        },
        state: {typeId: 'state' as const, id: 'state-123'},
        purchaseOrderNumber: 'PO-2024-001',
        storeKey: 'enterprise-store',
      };

      const result = await createQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params,
        'enterprise-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.createQuoteRequest as jest.Mock).mockRejectedValue(error);

      const params = {
        cart: {typeId: 'cart' as const, id: 'cart-123'},
        cartVersion: 1,
      };

      await expect(
        createQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createQuoteRequest(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create quote request'
        );
      }
    });
  });

  describe('updateQuoteRequest', () => {
    it('should update quote request by ID with store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 2,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Submitted' as const,
          },
        ],
        storeKey: 'test-store',
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        [{action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'}],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should update quote request by ID without store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 2,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated comment'}],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        [{action: 'setComment', comment: 'Updated comment'}],
        undefined
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should update quote request by key with store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 2,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Cancelled' as const,
          },
        ],
        storeKey: 'test-store',
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        [{action: 'changeQuoteRequestState', quoteRequestState: 'Cancelled'}],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should update quote request by key without store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 2,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [
          {
            action: 'setPurchaseOrderNumber' as const,
            purchaseOrderNumber: 'PO-2024-002',
          },
        ],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        [
          {
            action: 'setPurchaseOrderNumber',
            purchaseOrderNumber: 'PO-2024-002',
          },
        ],
        undefined
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should update quote request with multiple actions', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 2,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Submitted' as const,
          },
          {action: 'setComment' as const, comment: 'Urgent request'},
          {
            action: 'setPurchaseOrderNumber' as const,
            purchaseOrderNumber: 'PO-URGENT-001',
          },
        ],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
          {action: 'setComment', comment: 'Urgent request'},
          {
            action: 'setPurchaseOrderNumber',
            purchaseOrderNumber: 'PO-URGENT-001',
          },
        ],
        undefined
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Submitted' as const,
          },
        ],
      } as any; // Using type assertion to test error condition

      await expect(
        updateQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequest(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote request'
        );
      }
    });

    it('should handle errors during update by ID and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockRejectedValue(
        error
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Submitted' as const,
          },
        ],
      };

      await expect(
        updateQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequest(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote request'
        );
      }
    });

    it('should handle errors during update by key and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockRejectedValue(
        error
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Submitted' as const,
          },
        ],
      };

      await expect(
        updateQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequest(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote request'
        );
      }
    });
  });
});

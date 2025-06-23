import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readQuoteRequest,
  createQuoteRequest,
  updateQuoteRequest,
} from '../store.functions';
import {SDKError} from '../../errors/sdkError';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import * as baseFunctions from '../base.functions';

// Mock the base functions
jest.mock('../base.functions', () => ({
  readQuoteRequestById: jest.fn(),
  readQuoteRequestByKey: jest.fn(),
  queryQuoteRequests: jest.fn(),
  createQuoteRequest: jest.fn(),
  updateQuoteRequestById: jest.fn(),
  updateQuoteRequestByKey: jest.fn(),
}));

const mockApiRoot: ApiRoot = {} as any;

const mockContext: CommercetoolsFuncContext = {
  projectKey: 'test-project',
  storeKey: 'test-store',
};

const mockContextWithoutStore: CommercetoolsFuncContext = {
  projectKey: 'test-project',
};

describe('Quote Request Store Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readQuoteRequest', () => {
    it('should read quote request by ID with store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };

      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        expand: ['cart', 'customer'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        ['cart', 'customer'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by key with store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };

      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'quote-request-123',
        expand: ['cart'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-request-123',
        ['cart'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote requests by customer ID with store key', async () => {
      const mockQuoteRequestsResponse = {
        results: [
          {
            id: 'qr-123',
            customerId: 'customer-123',
            quoteRequestState: 'Submitted',
          },
        ],
        total: 1,
        count: 1,
        offset: 0,
        limit: 10,
      };

      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequestsResponse
      );

      const params = {
        customerId: 'customer-123',
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['cart'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customer(id="customer-123")'],
        20,
        10,
        ['createdAt desc'],
        ['cart'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should query quote requests with where conditions and store key', async () => {
      const mockQuoteRequestsResponse = {
        results: [
          {
            id: 'qr-123',
            quoteRequestState: 'Submitted',
          },
        ],
        total: 1,
        count: 1,
        offset: 0,
        limit: 10,
      };

      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequestsResponse
      );

      const params = {
        where: ['quoteRequestState="Submitted"'],
        limit: 15,
        offset: 5,
        sort: ['lastModifiedAt desc'],
        expand: ['customer'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['quoteRequestState="Submitted"'],
        15,
        5,
        ['lastModifiedAt desc'],
        ['customer'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should query quote requests with minimal parameters', async () => {
      const mockQuoteRequestsResponse = {
        results: [],
        total: 0,
        count: 0,
        offset: 0,
        limit: 10,
      };

      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequestsResponse
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
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should throw error when store key is missing', async () => {
      const params = {
        id: 'qr-123',
      };

      await expect(
        readQuoteRequest(mockApiRoot, mockContextWithoutStore, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequest(mockApiRoot, mockContextWithoutStore, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote request'
        );
      }
    });

    it('should handle errors when reading quote request', async () => {
      const mockError = new Error('Quote request not found');
      (baseFunctions.readQuoteRequestById as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        id: 'qr-123',
      };

      await expect(
        readQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequest(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote request'
        );
      }
    });
  });

  describe('createQuoteRequest', () => {
    it('should create quote request with store key', async () => {
      const mockCreatedQuoteRequest = {
        id: 'qr-456',
        key: 'new-quote-request',
        cart: {
          typeId: 'cart',
          id: 'cart-123',
        },
        quoteRequestState: 'Submitted',
        version: 1,
      };

      (baseFunctions.createQuoteRequest as jest.Mock).mockResolvedValue(
        mockCreatedQuoteRequest
      );

      const params = {
        cart: {
          typeId: 'cart' as const,
          id: 'cart-123',
        },
        cartVersion: 1,
        key: 'new-quote-request',
        comment: 'Please provide a quote for this cart',
      };

      const result = await createQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params,
        'test-store'
      );
      expect(result).toEqual(mockCreatedQuoteRequest);
    });

    it('should create quote request with minimal parameters', async () => {
      const mockCreatedQuoteRequest = {
        id: 'qr-789',
        cart: {
          typeId: 'cart',
          id: 'cart-456',
        },
        quoteRequestState: 'Submitted',
        version: 1,
      };

      (baseFunctions.createQuoteRequest as jest.Mock).mockResolvedValue(
        mockCreatedQuoteRequest
      );

      const params = {
        cart: {
          typeId: 'cart' as const,
          id: 'cart-456',
        },
        cartVersion: 2,
      };

      const result = await createQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params,
        'test-store'
      );
      expect(result).toEqual(mockCreatedQuoteRequest);
    });

    it('should throw error when store key is missing', async () => {
      const params = {
        cart: {
          typeId: 'cart' as const,
          id: 'cart-123',
        },
        cartVersion: 1,
      };

      await expect(
        createQuoteRequest(mockApiRoot, mockContextWithoutStore, params)
      ).rejects.toThrow(SDKError);

      try {
        await createQuoteRequest(mockApiRoot, mockContextWithoutStore, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create quote request'
        );
      }
    });

    it('should handle errors when creating quote request', async () => {
      const mockError = new Error('Creation failed');
      (baseFunctions.createQuoteRequest as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        cart: {
          typeId: 'cart' as const,
          id: 'cart-123',
        },
        cartVersion: 1,
      };

      await expect(
        createQuoteRequest(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createQuoteRequest(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create quote request'
        );
      }
    });
  });

  describe('updateQuoteRequest', () => {
    it('should update quote request by ID with store key', async () => {
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        quoteRequestState: 'Accepted',
        version: 2,
      };

      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState',
            quoteRequestState: 'Accepted',
          },
        ],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        params.actions,
        'test-store'
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should update quote request by key with store key', async () => {
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        quoteRequestState: 'Rejected',
        version: 2,
      };

      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        key: 'quote-request-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState',
            quoteRequestState: 'Rejected',
          },
        ],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-request-123',
        params.actions,
        'test-store'
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should throw error when store key is missing', async () => {
      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState',
            quoteRequestState: 'Accepted',
          },
        ],
      };

      await expect(
        updateQuoteRequest(mockApiRoot, mockContextWithoutStore, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequest(mockApiRoot, mockContextWithoutStore, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote request'
        );
      }
    });

    it('should throw error when neither ID nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState',
            quoteRequestState: 'Accepted',
          },
        ],
      };

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

    it('should handle errors when updating quote request by ID', async () => {
      const mockError = new Error('Update failed');
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState',
            quoteRequestState: 'Accepted',
          },
        ],
      };

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

    it('should handle errors when updating quote request by key', async () => {
      const mockError = new Error('Update failed');
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        key: 'quote-request-123',
        version: 1,
        actions: [
          {
            action: 'setCustomField',
            name: 'priority',
            value: 'high',
          },
        ],
      };

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
  });
});

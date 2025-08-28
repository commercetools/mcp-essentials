import {
  ApiRoot,
  QuoteRequestDraft,
  QuoteRequestUpdateAction,
} from '@commercetools/platform-sdk';
import {
  readQuoteRequestById,
  readQuoteRequestByKey,
  queryQuoteRequests,
  updateQuoteRequestById,
  updateQuoteRequestByKey,
  createQuoteRequest,
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
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockQuoteRequests = jest.fn().mockReturnValue({
  withId: mockWithId,
  withKey: mockWithKey,
  get: mockGet,
  post: mockPost,
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  quoteRequests: mockQuoteRequests,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  quoteRequests: mockQuoteRequests,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
});

const mockApiRoot: ApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

describe('Quote Request Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readQuoteRequestById', () => {
    it('should read quote request by ID without storeKey', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequest});

      const result = await readQuoteRequestById(
        mockApiRoot,
        'test-project',
        'qr-123'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'qr-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by ID with storeKey', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequest});

      const result = await readQuoteRequestById(
        mockApiRoot,
        'test-project',
        'qr-123',
        undefined,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'qr-123'});
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by ID with expand parameter', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequest});

      const result = await readQuoteRequestById(
        mockApiRoot,
        'test-project',
        'qr-123',
        ['cart', 'customer']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['cart', 'customer'],
        },
      });
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should handle errors when reading quote request by ID', async () => {
      const mockError = new Error('Quote request not found');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        readQuoteRequestById(mockApiRoot, 'test-project', 'qr-123')
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequestById(mockApiRoot, 'test-project', 'qr-123');
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote request by ID: Quote request not found'
        );
      }
    });
  });

  describe('readQuoteRequestByKey', () => {
    it('should read quote request by key without storeKey', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequest});

      const result = await readQuoteRequestByKey(
        mockApiRoot,
        'test-project',
        'quote-request-123'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'quote-request-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should read quote request by key with storeKey and expand', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 1,
        quoteRequestState: 'Submitted',
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequest});

      const result = await readQuoteRequestByKey(
        mockApiRoot,
        'test-project',
        'quote-request-123',
        ['cart'],
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockWithKey).toHaveBeenCalledWith({key: 'quote-request-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['cart'],
        },
      });
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should handle errors when reading quote request by key', async () => {
      const mockError = new Error('Quote request not found');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        readQuoteRequestByKey(mockApiRoot, 'test-project', 'quote-request-123')
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequestByKey(
          mockApiRoot,
          'test-project',
          'quote-request-123'
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote request by key: Quote request not found'
        );
      }
    });
  });

  describe('queryQuoteRequests', () => {
    it('should query quote requests with all parameters', async () => {
      const mockQuoteRequestsResponse = {
        results: [
          {
            id: 'qr-123',
            key: 'quote-request-123',
            version: 1,
            quoteRequestState: 'Submitted',
          },
        ],
        total: 1,
        count: 1,
        offset: 10,
        limit: 20,
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequestsResponse});

      const result = await queryQuoteRequests(
        mockApiRoot,
        'test-project',
        ['customerId="customer-123"'],
        20,
        10,
        ['createdAt desc'],
        ['cart'],
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
          expand: ['cart'],
        },
      });
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should query quote requests with minimal parameters (default limit)', async () => {
      const mockQuoteRequestsResponse = {
        results: [],
        total: 0,
        count: 0,
        offset: 0,
        limit: 10,
      };
      mockExecute.mockResolvedValue({body: mockQuoteRequestsResponse});

      const result = await queryQuoteRequests(mockApiRoot, 'test-project');

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10, // Default limit
        },
      });
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should query quote requests without storeKey', async () => {
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
      mockExecute.mockResolvedValue({body: mockQuoteRequestsResponse});

      const result = await queryQuoteRequests(
        mockApiRoot,
        'test-project',
        ['quoteRequestState="Submitted"'],
        15
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockInStoreKeyWithStoreKeyValue).not.toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['quoteRequestState="Submitted"'],
          limit: 15,
        },
      });
      expect(result).toEqual(mockQuoteRequestsResponse);
    });

    it('should handle errors when querying quote requests', async () => {
      const mockError = new Error('Query failed');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        queryQuoteRequests(mockApiRoot, 'test-project', [
          'customerId="customer-123"',
        ])
      ).rejects.toThrow(SDKError);

      try {
        await queryQuoteRequests(mockApiRoot, 'test-project', [
          'customerId="customer-123"',
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to query quote requests: Query failed'
        );
      }
    });
  });

  describe('updateQuoteRequestById', () => {
    beforeEach(() => {
      // Mock readQuoteRequestById for updateQuoteRequestById function
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 2,
      };
      mockExecute.mockResolvedValueOnce({body: mockQuoteRequest}); // First call for readQuoteRequestById
    });

    it('should update quote request by ID without storeKey', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'changeQuoteRequestState',
          quoteRequestState: 'Accepted',
        },
      ];
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        quoteRequestState: 'Accepted',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedQuoteRequest}); // Second call for update

      const result = await updateQuoteRequestById(
        mockApiRoot,
        'test-project',
        'qr-123',
        actions
      );

      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readQuoteRequestById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should update quote request by ID with storeKey', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'setCustomField',
          name: 'priority',
          value: 'high',
        },
      ];
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedQuoteRequest}); // Second call for update

      const result = await updateQuoteRequestById(
        mockApiRoot,
        'test-project',
        'qr-123',
        actions,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readQuoteRequestById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should handle errors when updating quote request by ID', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'changeQuoteRequestState',
          quoteRequestState: 'Accepted',
        },
      ];
      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError); // Second call for update

      await expect(
        updateQuoteRequestById(mockApiRoot, 'test-project', 'qr-123', actions)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequestById(
          mockApiRoot,
          'test-project',
          'qr-123',
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote request by ID: Failed to read quote request by ID: Query failed'
        );
      }
    });
  });

  describe('updateQuoteRequestByKey', () => {
    beforeEach(() => {
      // Mock readQuoteRequestByKey for updateQuoteRequestByKey function
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 2,
      };
      mockExecute.mockResolvedValueOnce({body: mockQuoteRequest}); // First call for readQuoteRequestByKey
    });

    it('should update quote request by key without storeKey', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'changeQuoteRequestState',
          quoteRequestState: 'Rejected',
        },
      ];
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        quoteRequestState: 'Rejected',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedQuoteRequest}); // Second call for update

      const result = await updateQuoteRequestByKey(
        mockApiRoot,
        'test-project',
        'quote-request-123',
        actions
      );

      expect(mockWithKey).toHaveBeenCalledWith({key: 'quote-request-123'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readQuoteRequestByKey
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should update quote request by key with storeKey', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'setCustomType',
          type: {
            typeId: 'type',
            key: 'quote-request-type',
          },
        },
      ];
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedQuoteRequest}); // Second call for update

      const result = await updateQuoteRequestByKey(
        mockApiRoot,
        'test-project',
        'quote-request-123',
        actions,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should handle errors when updating quote request by key', async () => {
      const actions: QuoteRequestUpdateAction[] = [
        {
          action: 'changeQuoteRequestState',
          quoteRequestState: 'Accepted',
        },
      ];
      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError); // Second call for update

      await expect(
        updateQuoteRequestByKey(
          mockApiRoot,
          'test-project',
          'quote-request-123',
          actions
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequestByKey(
          mockApiRoot,
          'test-project',
          'quote-request-123',
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote request by key: Failed to read quote request by key: Query failed'
        );
      }
    });
  });

  describe('createQuoteRequest', () => {
    it('should create quote request without storeKey', async () => {
      const quoteRequestDraft: QuoteRequestDraft = {
        cart: {
          typeId: 'cart',
          id: 'cart-123',
        },
        cartVersion: 1,
      };
      const mockCreatedQuoteRequest = {
        id: 'qr-123',
        key: 'quote-request-123',
        cart: {
          typeId: 'cart',
          id: 'cart-123',
        },
        quoteRequestState: 'Submitted',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockCreatedQuoteRequest});

      const result = await createQuoteRequest(
        mockApiRoot,
        'test-project',
        quoteRequestDraft
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: quoteRequestDraft,
      });
      expect(result).toEqual(mockCreatedQuoteRequest);
    });

    it('should create quote request with storeKey', async () => {
      const quoteRequestDraft: QuoteRequestDraft = {
        cart: {
          typeId: 'cart',
          id: 'cart-456',
        },
        cartVersion: 2,
        key: 'my-quote-request',
        comment: 'Please provide a quote for this cart',
      };
      const mockCreatedQuoteRequest = {
        id: 'qr-456',
        key: 'my-quote-request',
        cart: {
          typeId: 'cart',
          id: 'cart-456',
        },
        comment: 'Please provide a quote for this cart',
        quoteRequestState: 'Submitted',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockCreatedQuoteRequest});

      const result = await createQuoteRequest(
        mockApiRoot,
        'test-project',
        quoteRequestDraft,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: quoteRequestDraft,
      });
      expect(result).toEqual(mockCreatedQuoteRequest);
    });

    it('should handle errors when creating quote request', async () => {
      const quoteRequestDraft: QuoteRequestDraft = {
        cart: {
          typeId: 'cart',
          id: 'cart-123',
        },
        cartVersion: 1,
      };
      const mockError = new Error('Creation failed');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        createQuoteRequest(mockApiRoot, 'test-project', quoteRequestDraft)
      ).rejects.toThrow(SDKError);

      try {
        await createQuoteRequest(
          mockApiRoot,
          'test-project',
          quoteRequestDraft
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create quote request: Creation failed'
        );
      }
    });
  });
});

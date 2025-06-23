import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readQuoteRequest, updateQuoteRequest} from '../customer.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Request Customer Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
    };
  });

  describe('readQuoteRequest', () => {
    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
      };

      const params = {id: 'qr-123'};

      await expect(
        readQuoteRequest(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteRequest(
          mockApiRoot,
          contextWithoutCustomer as any,
          params
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote request'
        );
      }
    });

    it('should read quote request by ID when it belongs to customer', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {id: 'qr-123'};

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should throw error when quote request does not belong to customer (by ID)', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'other-customer'},
      };
      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {id: 'qr-123'};

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

    it('should read quote request by key when it belongs to customer', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {key: 'qr-key'};

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key'
      );
      expect(result).toEqual(mockQuoteRequest);
    });

    it('should throw error when quote request does not belong to customer (by key)', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'other-customer'},
      };
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {key: 'qr-key'};

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

    it('should query quote requests with customer filter added', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        where: ['quoteRequestState="Submitted"'],
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
        ['quoteRequestState="Submitted"', 'customer(id="customer-123")'],
        20,
        10,
        ['createdAt desc'],
        ['customer'],
        'test-store'
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should query quote requests with only customer filter when no where provided', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {
        limit: 50,
        offset: 25,
        sort: ['lastModifiedAt desc'],
        expand: ['cart'],
      };

      const result = await readQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuoteRequests).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customer(id="customer-123")'],
        50,
        25,
        ['lastModifiedAt desc'],
        ['cart'],
        undefined
      );
      expect(result).toEqual(mockQuoteRequests);
    });

    it('should query quote requests with minimal parameters', async () => {
      const mockQuoteRequests = {results: [], total: 0};
      (baseFunctions.queryQuoteRequests as jest.Mock).mockResolvedValue(
        mockQuoteRequests
      );

      const params = {};

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

    it('should handle errors during read by ID', async () => {
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

    it('should handle errors during read by key', async () => {
      const error = new Error('API error');
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockRejectedValue(
        error
      );

      const params = {key: 'qr-key'};

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

    it('should handle errors during query', async () => {
      const error = new Error('Query failed');
      (baseFunctions.queryQuoteRequests as jest.Mock).mockRejectedValue(error);

      const params = {where: ['invalid query']};

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

  describe('updateQuoteRequest', () => {
    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
      };

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
      };

      await expect(
        updateQuoteRequest(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteRequest(
          mockApiRoot,
          contextWithoutCustomer as any,
          params
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote request'
        );
      }
    });

    it('should update quote request by ID when it belongs to customer', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Customer update'}],
        storeKey: 'test-store',
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123'
      );
      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        [{action: 'setComment', comment: 'Customer update'}],
        'test-store'
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should update quote request by ID without store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteRequestState' as const,
            quoteRequestState: 'Cancelled' as const,
          },
        ],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123'
      );
      expect(baseFunctions.updateQuoteRequestById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-123',
        [{action: 'changeQuoteRequestState', quoteRequestState: 'Cancelled'}],
        undefined
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should throw error when quote request does not belong to customer (by ID)', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'other-customer'},
      };

      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should update quote request by key when it belongs to customer', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [
          {
            action: 'setPurchaseOrderNumber' as const,
            purchaseOrderNumber: 'PO-123',
          },
        ],
        storeKey: 'customer-store',
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key'
      );
      expect(baseFunctions.updateQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        [{action: 'setPurchaseOrderNumber', purchaseOrderNumber: 'PO-123'}],
        'customer-store'
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should update quote request by key without store key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockUpdatedQuoteRequest
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Final comment'}],
      };

      const result = await updateQuoteRequest(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key'
      );
      expect(baseFunctions.updateQuoteRequestByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'qr-key',
        [{action: 'setComment', comment: 'Final comment'}],
        undefined
      );
      expect(result).toEqual(mockUpdatedQuoteRequest);
    });

    it('should throw error when quote request does not belong to customer (by key)', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'other-customer'},
      };

      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should handle errors during read by ID before update', async () => {
      const error = new Error('Read error');
      (baseFunctions.readQuoteRequestById as jest.Mock).mockRejectedValue(
        error
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should handle errors during read by key before update', async () => {
      const error = new Error('Read error');
      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockRejectedValue(
        error
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should handle errors during update by ID', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const updateError = new Error('Update error');

      (baseFunctions.readQuoteRequestById as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestById as jest.Mock).mockRejectedValue(
        updateError
      );

      const params = {
        id: 'qr-123',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

    it('should handle errors during update by key', async () => {
      const mockQuoteRequest = {
        id: 'qr-123',
        key: 'qr-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const updateError = new Error('Update error');

      (baseFunctions.readQuoteRequestByKey as jest.Mock).mockResolvedValue(
        mockQuoteRequest
      );
      (baseFunctions.updateQuoteRequestByKey as jest.Mock).mockRejectedValue(
        updateError
      );

      const params = {
        key: 'qr-key',
        version: 1,
        actions: [{action: 'setComment' as const, comment: 'Updated'}],
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

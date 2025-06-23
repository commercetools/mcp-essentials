import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readQuote, updateQuote} from '../customer.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Customer Functions', () => {
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

  describe('readQuote', () => {
    it('should read quote by ID when owned by customer', async () => {
      const mockQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        id: 'quote-123',
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        ['customer'],
        'test-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when reading quote by ID not owned by customer', async () => {
      const mockQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'other-customer'},
      };
      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(mockQuote);

      const params = {id: 'quote-123'};

      await expect(readQuote(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read quote');
      }
    });

    it('should read quote by key when owned by customer', async () => {
      const mockQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      (baseFunctions.readQuoteByKey as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        key: 'quote-key',
        expand: ['stagedQuote'],
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        ['stagedQuote'],
        undefined
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when reading quote by key not owned by customer', async () => {
      const mockQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        customer: {id: 'other-customer'},
      };
      (baseFunctions.readQuoteByKey as jest.Mock).mockResolvedValue(mockQuote);

      const params = {key: 'quote-key'};

      await expect(readQuote(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read quote');
      }
    });

    it('should query quotes with customer filter', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotes as jest.Mock).mockResolvedValue(mockQuotes);

      const params = {
        where: ['quoteState="Pending"'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: ['customer(id="customer-123")', 'quoteState="Pending"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['customer'],
        },
        'test-store'
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should query quotes with only customer filter when no where provided', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotes as jest.Mock).mockResolvedValue(mockQuotes);

      const params = {};

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: ['customer(id="customer-123")'],
          limit: undefined,
          offset: undefined,
          sort: undefined,
          expand: undefined,
        },
        undefined
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
      };

      const params = {id: 'quote-123'};

      await expect(
        readQuote(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuote(mockApiRoot, contextWithoutCustomer as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read quote');
      }
    });

    it('should handle base function errors', async () => {
      const error = new Error('API error');
      (baseFunctions.readQuoteById as jest.Mock).mockRejectedValue(error);

      const params = {id: 'quote-123'};

      await expect(readQuote(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe('Failed to read quote');
      }
    });
  });

  describe('updateQuote', () => {
    it('should update quote by ID with allowed action when owned by customer', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );
      (baseFunctions.updateQuoteById as jest.Mock).mockResolvedValue(
        mockUpdatedQuote
      );

      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        ['customer'],
        'test-store'
      );
      expect(baseFunctions.updateQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        ['customer'],
        'test-store'
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should update quote by key with allowed action when owned by customer', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteByKey as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );
      (baseFunctions.updateQuoteByKey as jest.Mock).mockResolvedValue(
        mockUpdatedQuote
      );

      const params = {
        key: 'quote-key',
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Declined' as const,
          },
        ],
      } as any;

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        undefined,
        undefined
      );
      expect(baseFunctions.updateQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Declined'}],
        },
        undefined,
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should allow requestQuoteRenegotiation action', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        version: 2,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );
      (baseFunctions.updateQuoteById as jest.Mock).mockResolvedValue(
        mockUpdatedQuote
      );

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'requestQuoteRenegotiation' as const,
            buyerComment: 'Need lower price',
          },
        ],
      } as any;

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        {
          version: 1,
          actions: [
            {
              action: 'requestQuoteRenegotiation',
              buyerComment: 'Need lower price',
            },
          ],
        },
        undefined,
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should throw error when quote not owned by customer', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'other-customer'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update quote');
      }
    });

    it('should throw error when action not allowed for customers', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'transitionState' as any,
            state: {typeId: 'state', id: 'state-123'},
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update quote');
      }
    });

    it('should throw error when quote state not allowed for customers', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );

      const params = {
        id: 'quote-123',
        actions: [
          {action: 'changeQuoteState' as const, quoteState: 'Pending' as any},
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update quote');
      }
    });

    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
      };

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, contextWithoutCustomer as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update quote');
      }
    });

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update quote');
      }
    });

    it('should handle base function errors during read', async () => {
      const error = new Error('API error');
      (baseFunctions.readQuoteById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote'
        );
      }
    });

    it('should handle base function errors during update', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        customer: {id: 'customer-123'},
      };
      const error = new Error('API error');

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );
      (baseFunctions.updateQuoteById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'quote-123',
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any;

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote'
        );
      }
    });
  });
});

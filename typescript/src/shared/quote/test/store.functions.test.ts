import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readQuote, createQuote, updateQuote} from '../store.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Store Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      storeKey: 'test-store',
    };
  });

  describe('readQuote', () => {
    it('should read quote by ID when it belongs to the store', async () => {
      const mockQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'test-store'},
      };
      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        id: 'quote-123',
        expand: ['customer'],
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

    it('should use storeKey from params if provided', async () => {
      const mockQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'other-store'},
      };
      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        id: 'quote-123',
        storeKey: 'other-store',
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        undefined,
        'other-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when quote does not belong to store (by ID)', async () => {
      const mockQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'other-store'},
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

    it('should read quote by key when it belongs to the store', async () => {
      const mockQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        store: {key: 'test-store'},
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
        'test-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when quote does not belong to store (by key)', async () => {
      const mockQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        store: {key: 'other-store'},
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

    it('should query quotes with store filter added', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotes as jest.Mock).mockResolvedValue(mockQuotes);

      const params = {
        where: ['quoteState="Pending"'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['customer'],
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: ['store(key="test-store")', 'quoteState="Pending"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['customer'],
        },
        'test-store'
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should query quotes with only store filter when no where provided', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotes as jest.Mock).mockResolvedValue(mockQuotes);

      const params = {};

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: ['store(key="test-store")'],
          limit: undefined,
          offset: undefined,
          sort: undefined,
          expand: undefined,
        },
        'test-store'
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should throw error when store key is missing', async () => {
      const contextWithoutStore = {
        projectKey: 'test-project',
      };

      const params = {id: 'quote-123'};

      await expect(
        readQuote(mockApiRoot, contextWithoutStore as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuote(mockApiRoot, contextWithoutStore as any, params);
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

  describe('createQuote', () => {
    it('should create quote with minimal parameters', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.createQuote as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
        stagedQuoteVersion: 1,
        stagedQuoteStateToSent: true,
      };

      const result = await createQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          stagedQuote: {typeId: 'staged-quote', id: 'staged-quote-123'},
          stagedQuoteVersion: 1,
          stagedQuoteStateToSent: true,
        },
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should create quote with all optional parameters', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.createQuote as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        key: 'quote-key',
        stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
        stagedQuoteVersion: 1,
        stagedQuoteStateToSent: true,
        state: {typeId: 'state' as const, id: 'state-123'},
        custom: {
          type: {typeId: 'type' as const, key: 'type-123'},
          fields: {customField: 'value'},
        },
        expand: ['customer'],
        storeKey: 'other-store',
      };

      const result = await createQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'quote-key',
          stagedQuote: {typeId: 'staged-quote', id: 'staged-quote-123'},
          stagedQuoteVersion: 1,
          stagedQuoteStateToSent: true,
          state: {typeId: 'state', id: 'state-123'},
          custom: {
            type: {typeId: 'type', key: 'type-123'},
            fields: {customField: 'value'},
          },
        },
        ['customer'],
        'other-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should create quote with stagedQuoteStateToSent false', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.createQuote as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
        stagedQuoteVersion: 1,
        stagedQuoteStateToSent: false,
      };

      const result = await createQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          stagedQuote: {typeId: 'staged-quote', id: 'staged-quote-123'},
          stagedQuoteVersion: 1,
          stagedQuoteStateToSent: false,
        },
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when store key is missing', async () => {
      const contextWithoutStore = {
        projectKey: 'test-project',
      };

      const params = {
        stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
        stagedQuoteVersion: 1,
        stagedQuoteStateToSent: true,
      };

      await expect(
        createQuote(mockApiRoot, contextWithoutStore as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await createQuote(mockApiRoot, contextWithoutStore as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to create quote');
      }
    });

    it('should handle base function errors', async () => {
      const error = new Error('API error');
      (baseFunctions.createQuote as jest.Mock).mockRejectedValue(error);

      const params = {
        stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
        stagedQuoteVersion: 1,
        stagedQuoteStateToSent: true,
      };

      await expect(
        createQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create quote'
        );
      }
    });
  });

  describe('updateQuote', () => {
    it('should update quote by ID with version provided', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'test-store'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        version: 2,
        store: {key: 'test-store'},
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

    it('should update quote by key with version auto-fetched', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 3,
        store: {key: 'test-store'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 4,
        store: {key: 'test-store'},
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
            quoteState: 'Accepted' as const,
          },
        ],
      } as any; // Use type assertion since we're testing the version auto-fetch

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        undefined,
        'test-store'
      );
      expect(baseFunctions.updateQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        {
          version: 3,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should use storeKey from params when provided', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'other-store'},
      };
      const mockUpdatedQuote = {
        id: 'quote-123',
        version: 2,
        store: {key: 'other-store'},
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
        storeKey: 'other-store',
      };

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        undefined,
        'other-store'
      );
      expect(baseFunctions.updateQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        undefined,
        'other-store'
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should throw error when quote does not belong to store (by ID)', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        version: 1,
        store: {key: 'other-store'},
      };

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
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
      };

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

    it('should throw error when quote does not belong to store (by key)', async () => {
      const mockCurrentQuote = {
        id: 'quote-123',
        key: 'quote-key',
        version: 1,
        store: {key: 'other-store'},
      };

      (baseFunctions.readQuoteByKey as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );

      const params = {
        key: 'quote-key',
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      };

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

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        version: 1,
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

    it('should throw error when store key is missing', async () => {
      const contextWithoutStore = {
        projectKey: 'test-project',
      };

      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      };

      await expect(
        updateQuote(mockApiRoot, contextWithoutStore as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, contextWithoutStore as any, params);
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
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      };

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
        store: {key: 'test-store'},
      };
      const error = new Error('API error');

      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(
        mockCurrentQuote
      );
      (baseFunctions.updateQuoteById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      };

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

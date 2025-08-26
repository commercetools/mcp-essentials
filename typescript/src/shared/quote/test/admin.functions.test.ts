import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readQuote, createQuote, updateQuote} from '../admin.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Admin Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
    };
  });

  describe('readQuote', () => {
    it('should read quote by ID', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
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

    it('should read quote by key', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 1};
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

    it('should query quotes with all parameters', async () => {
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
          where: ['quoteState="Pending"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['customer'],
        },
        'test-store'
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should query quotes with minimal parameters', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotes as jest.Mock).mockResolvedValue(mockQuotes);

      const params = {};

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: undefined,
          limit: undefined,
          offset: undefined,
          sort: undefined,
          expand: undefined,
        },
        undefined
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should read quote by ID without expand and storeKey', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.readQuoteById as jest.Mock).mockResolvedValue(mockQuote);

      const params = {
        id: 'quote-123',
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        undefined,
        undefined
      );
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
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
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote: API error'
        );
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
        undefined
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
        storeKey: 'test-store',
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
        'test-store'
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
        undefined
      );
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
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
          'Failed to create quote: API error'
        );
      }
    });
  });

  describe('updateQuote', () => {
    it('should update quote by ID with version provided', async () => {
      const mockQuote = {id: 'quote-123', version: 2};
      (baseFunctions.updateQuoteById as jest.Mock).mockResolvedValue(mockQuote);

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
      expect(result).toEqual(mockQuote);
    });

    it('should update quote by key with version provided', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 2};
      (baseFunctions.updateQuoteByKey as jest.Mock).mockResolvedValue(
        mockQuote
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

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-key',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        undefined,
        undefined
      );
      expect(result).toEqual(mockQuote);
    });

    it('should update quote by ID without version (fetch version first)', async () => {
      const mockCurrentQuote = {id: 'quote-123', version: 3};
      const mockUpdatedQuote = {id: 'quote-123', version: 4};

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
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any; // Use type assertion since we're testing the version auto-fetch

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        undefined,
        undefined
      );
      expect(baseFunctions.updateQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'quote-123',
        {
          version: 3,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        undefined,
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should update quote by key without version (fetch version first)', async () => {
      const mockCurrentQuote = {id: 'quote-123', key: 'quote-key', version: 3};
      const mockUpdatedQuote = {id: 'quote-123', key: 'quote-key', version: 4};

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
        undefined
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
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should throw error when neither ID nor key provided (with version)', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any; // Using type assertion to test error condition

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote: Either quote ID or key must be provided'
        );
      }
    });

    it('should throw error when neither ID nor key provided (without version)', async () => {
      const params = {
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Accepted' as const,
          },
        ],
      } as any; // Using type assertion to test error condition

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote: Either quote ID or key must be provided'
        );
      }
    });

    it('should handle errors during version fetch and throw SDKError', async () => {
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
      } as any; // Use type assertion since we're testing the version auto-fetch

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote: API error'
        );
      }
    });

    it('should handle errors during update and throw SDKError', async () => {
      const error = new Error('API error');
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
          'Failed to update quote: API error'
        );
      }
    });
  });
});

import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readStagedQuoteById,
  readStagedQuoteByKey,
  queryStagedQuotes,
  createStagedQuote,
  updateStagedQuoteById,
  updateStagedQuoteByKey,
} from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the ApiRoot and its methods
const mockApiRoot = {
  withProjectKey: jest.fn(),
} as unknown as ApiRoot;

const mockProjectRoot = {
  stagedQuotes: jest.fn(),
  inStoreKeyWithStoreKeyValue: jest.fn(),
};

const mockInStoreRoot = {
  stagedQuotes: jest.fn(),
};

const mockStagedQuotesRoot = {
  withId: jest.fn(),
  withKey: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
};

const mockExecute = {
  execute: jest.fn(),
};

describe('Staged Quote Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock chain
    (mockApiRoot.withProjectKey as jest.Mock).mockReturnValue(mockProjectRoot);
    mockProjectRoot.stagedQuotes.mockReturnValue(mockStagedQuotesRoot);
    mockProjectRoot.inStoreKeyWithStoreKeyValue.mockReturnValue(
      mockInStoreRoot
    );
    mockInStoreRoot.stagedQuotes.mockReturnValue(mockStagedQuotesRoot);
    mockStagedQuotesRoot.withId.mockReturnValue(mockStagedQuotesRoot);
    mockStagedQuotesRoot.withKey.mockReturnValue(mockStagedQuotesRoot);
    mockStagedQuotesRoot.get.mockReturnValue(mockExecute);
    mockStagedQuotesRoot.post.mockReturnValue(mockExecute);
  });

  describe('readStagedQuoteById', () => {
    it('should read staged quote by ID without store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await readStagedQuoteById(
        mockApiRoot,
        'test-project',
        'staged-quote-123'
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.stagedQuotes).toHaveBeenCalled();
      expect(mockStagedQuotesRoot.withId).toHaveBeenCalledWith({
        ID: 'staged-quote-123',
      });
      expect(mockStagedQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: undefined,
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should read staged quote by ID with store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await readStagedQuoteById(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        {expand: ['quotationCart']},
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreRoot.stagedQuotes).toHaveBeenCalled();
      expect(mockStagedQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['quotationCart']},
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readStagedQuoteById(mockApiRoot, 'test-project', 'staged-quote-123')
      ).rejects.toThrow(SDKError);

      try {
        await readStagedQuoteById(
          mockApiRoot,
          'test-project',
          'staged-quote-123'
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read staged quote by ID: API error'
        );
      }
    });
  });

  describe('readStagedQuoteByKey', () => {
    it('should read staged quote by key without store key', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 1,
      };
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await readStagedQuoteByKey(
        mockApiRoot,
        'test-project',
        'staged-quote-key'
      );

      expect(mockStagedQuotesRoot.withKey).toHaveBeenCalledWith({
        key: 'staged-quote-key',
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should read staged quote by key with store key and query args', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 1,
      };
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await readStagedQuoteByKey(
        mockApiRoot,
        'test-project',
        'staged-quote-key',
        {expand: ['customer']},
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockStagedQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['customer']},
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readStagedQuoteByKey(mockApiRoot, 'test-project', 'staged-quote-key')
      ).rejects.toThrow(SDKError);

      try {
        await readStagedQuoteByKey(
          mockApiRoot,
          'test-project',
          'staged-quote-key'
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read staged quote by key: API error'
        );
      }
    });
  });

  describe('queryStagedQuotes', () => {
    it('should query staged quotes without store key', async () => {
      const mockStagedQuotes = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuotes});

      const queryArgs = {where: ['stagedQuoteState="InProgress"'], limit: 20};
      const result = await queryStagedQuotes(
        mockApiRoot,
        'test-project',
        queryArgs
      );

      expect(mockProjectRoot.stagedQuotes).toHaveBeenCalled();
      expect(mockStagedQuotesRoot.get).toHaveBeenCalledWith({queryArgs});
      expect(result).toEqual(mockStagedQuotes);
    });

    it('should query staged quotes with store key', async () => {
      const mockStagedQuotes = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuotes});

      const queryArgs = {where: ['stagedQuoteState="InProgress"'], limit: 20};
      const result = await queryStagedQuotes(
        mockApiRoot,
        'test-project',
        queryArgs,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreRoot.stagedQuotes).toHaveBeenCalled();
      expect(result).toEqual(mockStagedQuotes);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        queryStagedQuotes(mockApiRoot, 'test-project', {})
      ).rejects.toThrow(SDKError);

      try {
        await queryStagedQuotes(mockApiRoot, 'test-project', {});
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to query staged quotes: API error'
        );
      }
    });
  });

  describe('createStagedQuote', () => {
    const stagedQuoteDraft = {
      quoteRequest: {typeId: 'quote-request' as const, id: 'quote-request-123'},
      quoteRequestVersion: 1,
    };

    it('should create staged quote without store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await createStagedQuote(
        mockApiRoot,
        'test-project',
        stagedQuoteDraft
      );

      expect(mockStagedQuotesRoot.post).toHaveBeenCalledWith({
        body: stagedQuoteDraft,
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should create staged quote with store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await createStagedQuote(
        mockApiRoot,
        'test-project',
        stagedQuoteDraft,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        createStagedQuote(mockApiRoot, 'test-project', stagedQuoteDraft)
      ).rejects.toThrow(SDKError);

      try {
        await createStagedQuote(mockApiRoot, 'test-project', stagedQuoteDraft);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create staged quote: API error'
        );
      }
    });
  });

  describe('updateStagedQuoteById', () => {
    const updateBody = {
      version: 1,
      actions: [
        {action: 'changeStagedQuoteState' as const, stagedQuoteState: 'Sent'},
      ],
    };

    it('should update staged quote by ID without store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await updateStagedQuoteById(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        updateBody
      );

      expect(mockStagedQuotesRoot.withId).toHaveBeenCalledWith({
        ID: 'staged-quote-123',
      });
      expect(mockStagedQuotesRoot.post).toHaveBeenCalledWith({
        body: updateBody,
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should update staged quote by ID with store key', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await updateStagedQuoteById(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        updateBody,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateStagedQuoteById(
          mockApiRoot,
          'test-project',
          'staged-quote-123',
          updateBody
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateStagedQuoteById(
          mockApiRoot,
          'test-project',
          'staged-quote-123',
          updateBody
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update staged quote by ID: API error'
        );
      }
    });
  });

  describe('updateStagedQuoteByKey', () => {
    const updateBody = {
      version: 1,
      actions: [
        {action: 'changeStagedQuoteState' as const, stagedQuoteState: 'Sent'},
      ],
    };

    it('should update staged quote by key without store key', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 2,
      };
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await updateStagedQuoteByKey(
        mockApiRoot,
        'test-project',
        'staged-quote-key',
        updateBody
      );

      expect(mockStagedQuotesRoot.withKey).toHaveBeenCalledWith({
        key: 'staged-quote-key',
      });
      expect(mockStagedQuotesRoot.post).toHaveBeenCalledWith({
        body: updateBody,
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should update staged quote by key with store key', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 2,
      };
      mockExecute.execute.mockResolvedValue({body: mockStagedQuote});

      const result = await updateStagedQuoteByKey(
        mockApiRoot,
        'test-project',
        'staged-quote-key',
        updateBody,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockStagedQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateStagedQuoteByKey(
          mockApiRoot,
          'test-project',
          'staged-quote-key',
          updateBody
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateStagedQuoteByKey(
          mockApiRoot,
          'test-project',
          'staged-quote-key',
          updateBody
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update staged quote by key: API error'
        );
      }
    });
  });
});

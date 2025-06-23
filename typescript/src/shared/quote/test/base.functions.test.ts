import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readQuoteById,
  readQuoteByKey,
  queryQuotes,
  createQuote,
  updateQuoteById,
  updateQuoteByKey,
  readQuoteByIdAsAssociate,
  readQuoteByKeyAsAssociate,
  queryQuotesAsAssociate,
  updateQuoteByIdAsAssociate,
  updateQuoteByKeyAsAssociate,
} from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the ApiRoot and its methods
const mockApiRoot = {
  withProjectKey: jest.fn(),
} as unknown as ApiRoot;

const mockProjectRoot = {
  quotes: jest.fn(),
  inStoreKeyWithStoreKeyValue: jest.fn(),
  asAssociate: jest.fn(),
};

const mockInStoreRoot = {
  quotes: jest.fn(),
};

const mockQuotesRoot = {
  withId: jest.fn(),
  withKey: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
};

const mockAssociateRoot = {
  withAssociateIdValue: jest.fn(),
};

const mockBusinessUnitRoot = {
  inBusinessUnitKeyWithBusinessUnitKeyValue: jest.fn(),
};

const mockAssociateBusinessUnitRoot = {
  quotes: jest.fn(),
};

const mockExecute = {
  execute: jest.fn(),
};

describe('Quote Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock chain
    (mockApiRoot.withProjectKey as jest.Mock).mockReturnValue(mockProjectRoot);
    mockProjectRoot.quotes.mockReturnValue(mockQuotesRoot);
    mockProjectRoot.inStoreKeyWithStoreKeyValue.mockReturnValue(
      mockInStoreRoot
    );
    mockInStoreRoot.quotes.mockReturnValue(mockQuotesRoot);
    mockQuotesRoot.withId.mockReturnValue(mockQuotesRoot);
    mockQuotesRoot.withKey.mockReturnValue(mockQuotesRoot);
    mockQuotesRoot.get.mockReturnValue(mockExecute);
    mockQuotesRoot.post.mockReturnValue(mockExecute);

    // Setup associate mock chain
    mockProjectRoot.asAssociate.mockReturnValue(mockAssociateRoot);
    mockAssociateRoot.withAssociateIdValue.mockReturnValue(
      mockBusinessUnitRoot
    );
    mockBusinessUnitRoot.inBusinessUnitKeyWithBusinessUnitKeyValue.mockReturnValue(
      mockAssociateBusinessUnitRoot
    );
    mockAssociateBusinessUnitRoot.quotes.mockReturnValue(mockQuotesRoot);
  });

  describe('readQuoteById', () => {
    it('should read quote by ID without store key', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteById(
        mockApiRoot,
        'test-project',
        'quote-123'
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.quotes).toHaveBeenCalled();
      expect(mockQuotesRoot.withId).toHaveBeenCalledWith({ID: 'quote-123'});
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should read quote by ID with store key', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteById(
        mockApiRoot,
        'test-project',
        'quote-123',
        ['lineItems'],
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreRoot.quotes).toHaveBeenCalled();
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['lineItems'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readQuoteById(mockApiRoot, 'test-project', 'quote-123')
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteById(mockApiRoot, 'test-project', 'quote-123');
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote by ID'
        );
      }
    });
  });

  describe('readQuoteByKey', () => {
    it('should read quote by key without store key', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteByKey(
        mockApiRoot,
        'test-project',
        'quote-key'
      );

      expect(mockQuotesRoot.withKey).toHaveBeenCalledWith({key: 'quote-key'});
      expect(result).toEqual(mockQuote);
    });

    it('should read quote by key with store key and expand', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteByKey(
        mockApiRoot,
        'test-project',
        'quote-key',
        ['customer'],
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readQuoteByKey(mockApiRoot, 'test-project', 'quote-key')
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteByKey(mockApiRoot, 'test-project', 'quote-key');
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote by key'
        );
      }
    });
  });

  describe('queryQuotes', () => {
    it('should query quotes without store key', async () => {
      const mockQuotes = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockQuotes});

      const queryArgs = {where: ['quoteState="Sent"'], limit: 20};
      const result = await queryQuotes(mockApiRoot, 'test-project', queryArgs);

      expect(mockProjectRoot.quotes).toHaveBeenCalled();
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({queryArgs});
      expect(result).toEqual(mockQuotes);
    });

    it('should query quotes with store key', async () => {
      const mockQuotes = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockQuotes});

      const queryArgs = {where: ['quoteState="Sent"'], limit: 20};
      const result = await queryQuotes(
        mockApiRoot,
        'test-project',
        queryArgs,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreRoot.quotes).toHaveBeenCalled();
      expect(result).toEqual(mockQuotes);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        queryQuotes(mockApiRoot, 'test-project', {})
      ).rejects.toThrow(SDKError);

      try {
        await queryQuotes(mockApiRoot, 'test-project', {});
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to query quotes'
        );
      }
    });
  });

  describe('createQuote', () => {
    const quoteDraft = {
      stagedQuote: {typeId: 'staged-quote' as const, id: 'staged-quote-123'},
      stagedQuoteVersion: 1,
    };

    it('should create quote without store key', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await createQuote(mockApiRoot, 'test-project', quoteDraft);

      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: quoteDraft,
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should create quote with store key and expand', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await createQuote(
        mockApiRoot,
        'test-project',
        quoteDraft,
        ['customer'],
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: quoteDraft,
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        createQuote(mockApiRoot, 'test-project', quoteDraft)
      ).rejects.toThrow(SDKError);

      try {
        await createQuote(mockApiRoot, 'test-project', quoteDraft);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create quote'
        );
      }
    });
  });

  describe('updateQuoteById', () => {
    const updateData = {
      version: 1,
      actions: [{action: 'changeQuoteState' as const, quoteState: 'Accepted'}],
    };

    it('should update quote by ID without store key', async () => {
      const mockQuote = {id: 'quote-123', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteById(
        mockApiRoot,
        'test-project',
        'quote-123',
        updateData
      );

      expect(mockQuotesRoot.withId).toHaveBeenCalledWith({ID: 'quote-123'});
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should update quote by ID with store key and expand', async () => {
      const mockQuote = {id: 'quote-123', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteById(
        mockApiRoot,
        'test-project',
        'quote-123',
        updateData,
        ['customer'],
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateQuoteById(mockApiRoot, 'test-project', 'quote-123', updateData)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteById(
          mockApiRoot,
          'test-project',
          'quote-123',
          updateData
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote by ID'
        );
      }
    });
  });

  describe('updateQuoteByKey', () => {
    const updateData = {
      version: 1,
      actions: [{action: 'changeQuoteState' as const, quoteState: 'Accepted'}],
    };

    it('should update quote by key without store key', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteByKey(
        mockApiRoot,
        'test-project',
        'quote-key',
        updateData
      );

      expect(mockQuotesRoot.withKey).toHaveBeenCalledWith({key: 'quote-key'});
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should update quote by key with store key and expand', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteByKey(
        mockApiRoot,
        'test-project',
        'quote-key',
        updateData,
        ['lineItems'],
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: ['lineItems'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateQuoteByKey(mockApiRoot, 'test-project', 'quote-key', updateData)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteByKey(
          mockApiRoot,
          'test-project',
          'quote-key',
          updateData
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote by key'
        );
      }
    });
  });

  describe('readQuoteByIdAsAssociate', () => {
    it('should read quote by ID as associate', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteByIdAsAssociate(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-key',
        'quote-123',
        ['customer']
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.asAssociate).toHaveBeenCalled();
      expect(mockAssociateRoot.withAssociateIdValue).toHaveBeenCalledWith({
        associateId: 'associate-123',
      });
      expect(
        mockBusinessUnitRoot.inBusinessUnitKeyWithBusinessUnitKeyValue
      ).toHaveBeenCalledWith({businessUnitKey: 'business-unit-key'});
      expect(mockAssociateBusinessUnitRoot.quotes).toHaveBeenCalled();
      expect(mockQuotesRoot.withId).toHaveBeenCalledWith({ID: 'quote-123'});
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readQuoteByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123'
        )
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123'
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote by ID as associate'
        );
      }
    });
  });

  describe('readQuoteByKeyAsAssociate', () => {
    it('should read quote by key as associate', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await readQuoteByKeyAsAssociate(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-key',
        'quote-key'
      );

      expect(mockQuotesRoot.withKey).toHaveBeenCalledWith({key: 'quote-key'});
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readQuoteByKeyAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-key'
        )
      ).rejects.toThrow(SDKError);

      try {
        await readQuoteByKeyAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-key'
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote by key as associate'
        );
      }
    });
  });

  describe('queryQuotesAsAssociate', () => {
    it('should query quotes as associate', async () => {
      const mockQuotes = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockQuotes});

      const queryArgs = {where: ['quoteState="Sent"'], limit: 20};
      const result = await queryQuotesAsAssociate(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-key',
        queryArgs
      );

      expect(mockAssociateBusinessUnitRoot.quotes).toHaveBeenCalled();
      expect(mockQuotesRoot.get).toHaveBeenCalledWith({queryArgs});
      expect(result).toEqual(mockQuotes);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        queryQuotesAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          {}
        )
      ).rejects.toThrow(SDKError);

      try {
        await queryQuotesAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          {}
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to query quotes as associate'
        );
      }
    });
  });

  describe('updateQuoteByIdAsAssociate', () => {
    const updateData = {
      version: 1,
      actions: [{action: 'changeQuoteState' as const, quoteState: 'Accepted'}],
    };

    it('should update quote by ID as associate', async () => {
      const mockQuote = {id: 'quote-123', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteByIdAsAssociate(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-key',
        'quote-123',
        updateData,
        ['customer']
      );

      expect(mockQuotesRoot.withId).toHaveBeenCalledWith({ID: 'quote-123'});
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateQuoteByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123',
          updateData
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteByIdAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-123',
          updateData
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote by ID as associate'
        );
      }
    });
  });

  describe('updateQuoteByKeyAsAssociate', () => {
    const updateData = {
      version: 1,
      actions: [{action: 'changeQuoteState' as const, quoteState: 'Accepted'}],
    };

    it('should update quote by key as associate', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 2};
      mockExecute.execute.mockResolvedValue({body: mockQuote});

      const result = await updateQuoteByKeyAsAssociate(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-key',
        'quote-key',
        updateData
      );

      expect(mockQuotesRoot.withKey).toHaveBeenCalledWith({key: 'quote-key'});
      expect(mockQuotesRoot.post).toHaveBeenCalledWith({
        body: updateData,
        queryArgs: {
          expand: undefined,
        },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        updateQuoteByKeyAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-key',
          updateData
        )
      ).rejects.toThrow(SDKError);

      try {
        await updateQuoteByKeyAsAssociate(
          mockApiRoot,
          'test-project',
          'associate-123',
          'business-unit-key',
          'quote-key',
          updateData
        );
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote by key as associate'
        );
      }
    });
  });
});

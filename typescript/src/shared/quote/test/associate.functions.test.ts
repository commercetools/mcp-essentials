import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readQuote, updateQuote} from '../associate.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Quote Associate Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
      businessUnitKey: 'business-unit-123',
    };
  });

  describe('readQuote', () => {
    it('should read quote by ID as associate', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.readQuoteByIdAsAssociate as jest.Mock).mockResolvedValue(
        mockQuote
      );

      const params = {
        id: 'quote-123',
        expand: ['customer'],
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-123',
        ['customer']
      );
      expect(result).toEqual(mockQuote);
    });

    it('should read quote by key as associate', async () => {
      const mockQuote = {id: 'quote-123', key: 'quote-key', version: 1};
      (baseFunctions.readQuoteByKeyAsAssociate as jest.Mock).mockResolvedValue(
        mockQuote
      );

      const params = {
        key: 'quote-key',
        expand: ['stagedQuote'],
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByKeyAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-key',
        ['stagedQuote']
      );
      expect(result).toEqual(mockQuote);
    });

    it('should query quotes as associate with all parameters', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotesAsAssociate as jest.Mock).mockResolvedValue(
        mockQuotes
      );

      const params = {
        where: ['quoteState="Pending"'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['customer'],
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotesAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        {
          where: ['quoteState="Pending"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['customer'],
        }
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should query quotes as associate with minimal parameters', async () => {
      const mockQuotes = {results: [], total: 0};
      (baseFunctions.queryQuotesAsAssociate as jest.Mock).mockResolvedValue(
        mockQuotes
      );

      const params = {};

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryQuotesAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        {
          where: undefined,
          limit: undefined,
          offset: undefined,
          sort: undefined,
          expand: undefined,
        }
      );
      expect(result).toEqual(mockQuotes);
    });

    it('should read quote by ID without expand', async () => {
      const mockQuote = {id: 'quote-123', version: 1};
      (baseFunctions.readQuoteByIdAsAssociate as jest.Mock).mockResolvedValue(
        mockQuote
      );

      const params = {
        id: 'quote-123',
      };

      const result = await readQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readQuoteByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-123',
        undefined
      );
      expect(result).toEqual(mockQuote);
    });

    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-123',
      };

      const params = {id: 'quote-123'};

      await expect(
        readQuote(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuote(mockApiRoot, contextWithoutCustomer as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote as associate'
        );
      }
    });

    it('should throw error when business unit key is missing', async () => {
      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'customer-123',
      };

      const params = {id: 'quote-123'};

      await expect(
        readQuote(mockApiRoot, contextWithoutBusinessUnit as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readQuote(mockApiRoot, contextWithoutBusinessUnit as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read quote as associate'
        );
      }
    });

    it('should handle base function errors', async () => {
      const error = new Error('API error');
      (baseFunctions.readQuoteByIdAsAssociate as jest.Mock).mockRejectedValue(
        error
      );

      const params = {id: 'quote-123'};

      await expect(readQuote(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readQuote(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read quote as associate'
        );
      }
    });
  });

  describe('updateQuote', () => {
    it('should update quote by ID with allowed action', async () => {
      const mockUpdatedQuote = {id: 'quote-123', version: 2};
      (baseFunctions.updateQuoteByIdAsAssociate as jest.Mock).mockResolvedValue(
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

      expect(baseFunctions.updateQuoteByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-123',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Accepted'}],
        },
        ['customer']
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should update quote by key with allowed action', async () => {
      const mockUpdatedQuote = {id: 'quote-123', key: 'quote-key', version: 2};
      (
        baseFunctions.updateQuoteByKeyAsAssociate as jest.Mock
      ).mockResolvedValue(mockUpdatedQuote);

      const params = {
        key: 'quote-key',
        version: 1,
        actions: [
          {
            action: 'changeQuoteState' as const,
            quoteState: 'Declined' as const,
          },
        ],
      };

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteByKeyAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-key',
        {
          version: 1,
          actions: [{action: 'changeQuoteState', quoteState: 'Declined'}],
        },
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should allow requestQuoteRenegotiation action', async () => {
      const mockUpdatedQuote = {id: 'quote-123', version: 2};
      (baseFunctions.updateQuoteByIdAsAssociate as jest.Mock).mockResolvedValue(
        mockUpdatedQuote
      );

      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'requestQuoteRenegotiation' as const,
            buyerComment: 'Need better terms',
          },
        ],
      };

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-123',
        {
          version: 1,
          actions: [
            {
              action: 'requestQuoteRenegotiation',
              buyerComment: 'Need better terms',
            },
          ],
        },
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should allow changeCustomer action for associates', async () => {
      const mockUpdatedQuote = {id: 'quote-123', version: 2};
      (baseFunctions.updateQuoteByIdAsAssociate as jest.Mock).mockResolvedValue(
        mockUpdatedQuote
      );

      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'changeCustomer' as any,
            customer: {typeId: 'customer', id: 'customer-456'},
          },
        ],
      };

      const result = await updateQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateQuoteByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'business-unit-123',
        'quote-123',
        {
          version: 1,
          actions: [
            {
              action: 'changeCustomer',
              customer: {typeId: 'customer', id: 'customer-456'},
            },
          ],
        },
        undefined
      );
      expect(result).toEqual(mockUpdatedQuote);
    });

    it('should throw error when action not allowed for associates', async () => {
      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {
            action: 'transitionState' as any,
            state: {typeId: 'state', id: 'state-123'},
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
        expect((error as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });

    it('should throw error when quote state not allowed for associates', async () => {
      const params = {
        id: 'quote-123',
        version: 1,
        actions: [
          {action: 'changeQuoteState' as const, quoteState: 'Pending' as any},
        ],
      };

      await expect(
        updateQuote(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });

    it('should throw error when customer ID is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-123',
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
        updateQuote(mockApiRoot, contextWithoutCustomer as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(mockApiRoot, contextWithoutCustomer as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });

    it('should throw error when business unit key is missing', async () => {
      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'customer-123',
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
        updateQuote(mockApiRoot, contextWithoutBusinessUnit as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateQuote(
          mockApiRoot,
          contextWithoutBusinessUnit as any,
          params
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
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
        expect((error as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });

    it('should handle base function errors during update by ID', async () => {
      const error = new Error('API error');
      (baseFunctions.updateQuoteByIdAsAssociate as jest.Mock).mockRejectedValue(
        error
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
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });

    it('should handle base function errors during update by key', async () => {
      const error = new Error('API error');
      (
        baseFunctions.updateQuoteByKeyAsAssociate as jest.Mock
      ).mockRejectedValue(error);

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
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update quote as associate'
        );
      }
    });
  });
});

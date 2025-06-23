import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {
  readStagedQuote,
  createStagedQuote,
  updateStagedQuote,
} from '../admin.functions';
import * as baseFunctions from '../base.functions';

// Mock the base functions
jest.mock('../base.functions');

describe('Staged Quote Admin Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
    };
  });

  describe('readStagedQuote', () => {
    it('should read staged quote by ID', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      (baseFunctions.readStagedQuoteById as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        id: 'staged-quote-123',
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await readStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStagedQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        {expand: ['customer']},
        'test-store'
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should read staged quote by key', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 1,
      };
      (baseFunctions.readStagedQuoteByKey as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        key: 'staged-quote-key',
        expand: ['quotationCart'],
      };

      const result = await readStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStagedQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'staged-quote-key',
        {expand: ['quotationCart']},
        undefined
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should query staged quotes with all parameters', async () => {
      const mockStagedQuotes = {results: [], total: 0};
      (baseFunctions.queryStagedQuotes as jest.Mock).mockResolvedValue(
        mockStagedQuotes
      );

      const params = {
        where: ['stagedQuoteState="InProgress"'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['customer'],
        storeKey: 'test-store',
      };

      const result = await readStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryStagedQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          where: ['stagedQuoteState="InProgress"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['customer'],
        },
        'test-store'
      );
      expect(result).toEqual(mockStagedQuotes);
    });

    it('should query staged quotes with minimal parameters', async () => {
      const mockStagedQuotes = {results: [], total: 0};
      (baseFunctions.queryStagedQuotes as jest.Mock).mockResolvedValue(
        mockStagedQuotes
      );

      const params = {};

      const result = await readStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryStagedQuotes).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {},
        undefined
      );
      expect(result).toEqual(mockStagedQuotes);
    });

    it('should read staged quote by ID without expand', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      (baseFunctions.readStagedQuoteById as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        id: 'staged-quote-123',
      };

      const result = await readStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStagedQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        {},
        undefined
      );
      expect(result).toEqual(mockStagedQuote);
    });
  });

  describe('createStagedQuote', () => {
    it('should create staged quote with minimal parameters', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      (baseFunctions.createStagedQuote as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        quoteRequest: {
          typeId: 'quote-request' as const,
          id: 'quote-request-123',
        },
        quoteRequestVersion: 1,
      };

      const result = await createStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createStagedQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          quoteRequest: {typeId: 'quote-request', id: 'quote-request-123'},
          quoteRequestVersion: 1,
        },
        undefined
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should create staged quote with all optional parameters', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      (baseFunctions.createStagedQuote as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        quoteRequest: {
          typeId: 'quote-request' as const,
          id: 'quote-request-123',
        },
        quoteRequestVersion: 1,
        key: 'staged-quote-key',
        quoteRequestStateToAccepted: true,
        state: {typeId: 'state' as const, id: 'state-123'},
        custom: {
          type: {typeId: 'type' as const, key: 'type-123'},
          fields: {customField: 'value'},
        },
        storeKey: 'test-store',
      };

      const result = await createStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createStagedQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          quoteRequest: {typeId: 'quote-request', id: 'quote-request-123'},
          quoteRequestVersion: 1,
          key: 'staged-quote-key',
          quoteRequestStateToAccepted: true,
          state: {typeId: 'state', id: 'state-123'},
          custom: {
            type: {typeId: 'type', key: 'type-123'},
            fields: {customField: 'value'},
          },
        },
        'test-store'
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should create staged quote with quoteRequestStateToAccepted false', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 1};
      (baseFunctions.createStagedQuote as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        quoteRequest: {
          typeId: 'quote-request' as const,
          id: 'quote-request-123',
        },
        quoteRequestVersion: 1,
        quoteRequestStateToAccepted: false,
      };

      const result = await createStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.createStagedQuote).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          quoteRequest: {typeId: 'quote-request', id: 'quote-request-123'},
          quoteRequestVersion: 1,
          quoteRequestStateToAccepted: false,
        },
        undefined
      );
      expect(result).toEqual(mockStagedQuote);
    });
  });

  describe('updateStagedQuote', () => {
    it('should update staged quote by ID', async () => {
      const mockStagedQuote = {id: 'staged-quote-123', version: 2};
      (baseFunctions.updateStagedQuoteById as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        id: 'staged-quote-123',
        version: 1,
        actions: [
          {action: 'changeStagedQuoteState' as const, stagedQuoteState: 'Sent'},
        ],
        storeKey: 'test-store',
      };

      const result = await updateStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStagedQuoteById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'staged-quote-123',
        {
          version: 1,
          actions: [
            {action: 'changeStagedQuoteState', stagedQuoteState: 'Sent'},
          ],
        },
        'test-store'
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should update staged quote by key', async () => {
      const mockStagedQuote = {
        id: 'staged-quote-123',
        key: 'staged-quote-key',
        version: 2,
      };
      (baseFunctions.updateStagedQuoteByKey as jest.Mock).mockResolvedValue(
        mockStagedQuote
      );

      const params = {
        key: 'staged-quote-key',
        version: 1,
        actions: [
          {action: 'changeStagedQuoteState' as const, stagedQuoteState: 'Sent'},
        ],
      };

      const result = await updateStagedQuote(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStagedQuoteByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'staged-quote-key',
        {
          version: 1,
          actions: [
            {action: 'changeStagedQuoteState', stagedQuoteState: 'Sent'},
          ],
        },
        undefined
      );
      expect(result).toEqual(mockStagedQuote);
    });

    it('should throw error when neither ID nor key provided', () => {
      const params = {
        version: 1,
        actions: [
          {action: 'changeStagedQuoteState' as const, stagedQuoteState: 'Sent'},
        ],
      } as any;

      expect(() => {
        updateStagedQuote(mockApiRoot, mockContext, params);
      }).toThrow('Either id or key must be provided for update operations');
    });
  });
});

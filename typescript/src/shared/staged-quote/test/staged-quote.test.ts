import {
  readStagedQuote,
  createStagedQuote,
  updateStagedQuote,
} from '../functions';
import * as admin from '../admin.functions';
import * as store from '../store.functions';

// Mock the admin and store modules
jest.mock('../admin.functions');
jest.mock('../store.functions');

const mockAdminRead = admin.readStagedQuote as jest.MockedFunction<
  typeof admin.readStagedQuote
>;
const mockAdminCreate = admin.createStagedQuote as jest.MockedFunction<
  typeof admin.createStagedQuote
>;
const mockAdminUpdate = admin.updateStagedQuote as jest.MockedFunction<
  typeof admin.updateStagedQuote
>;

const mockStoreRead = store.readStagedQuote as jest.MockedFunction<
  typeof store.readStagedQuote
>;
const mockStoreCreate = store.createStagedQuote as jest.MockedFunction<
  typeof store.createStagedQuote
>;
const mockStoreUpdate = store.updateStagedQuote as jest.MockedFunction<
  typeof store.updateStagedQuote
>;

const mockApiRoot = {} as any;

describe('Staged Quote Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readStagedQuote', () => {
    it('should call admin.readStagedQuote when context has isAdmin', async () => {
      const context = {projectKey: 'test-project', isAdmin: true};
      const params = {id: 'staged-quote-1'};
      const mockResult: any = {
        id: 'staged-quote-1',
        stagedQuoteState: 'InProgress',
      };

      mockAdminRead.mockResolvedValue(mockResult);

      const result = await readStagedQuote(mockApiRoot, context, params);

      expect(mockAdminRead).toHaveBeenCalledWith(mockApiRoot, context, params);
      expect(result).toBe(mockResult);
    });

    it('should call store.readStagedQuote when context has storeKey', async () => {
      const context = {projectKey: 'test-project', storeKey: 'store-1'};
      const params = {key: 'staged-quote-key'};
      const mockResult: any = {id: 'staged-quote-1', stagedQuoteState: 'Sent'};

      mockStoreRead.mockResolvedValue(mockResult);

      const result = await readStagedQuote(mockApiRoot, context, params);

      expect(mockStoreRead).toHaveBeenCalledWith(mockApiRoot, context, params);
      expect(result).toBe(mockResult);
    });

    it('should default to admin.readStagedQuote when no specific context', async () => {
      const context = {projectKey: 'test-project'};
      const params = {where: ['stagedQuoteState="InProgress"']};
      const mockResult: any = {results: [], total: 0};

      mockAdminRead.mockResolvedValue(mockResult);

      const result = await readStagedQuote(mockApiRoot, context, params);

      expect(mockAdminRead).toHaveBeenCalledWith(mockApiRoot, context, params);
      expect(result).toBe(mockResult);
    });
  });

  describe('createStagedQuote', () => {
    it('should call admin.createStagedQuote when context has isAdmin', async () => {
      const context = {projectKey: 'test-project', isAdmin: true};
      const params = {
        quoteRequest: {typeId: 'quote-request' as const, id: 'quote-request-1'},
        quoteRequestVersion: 1,
        quoteRequestStateToAccepted: true,
      };
      const mockResult: any = {
        id: 'new-staged-quote',
        stagedQuoteState: 'InProgress',
      };

      mockAdminCreate.mockResolvedValue(mockResult);

      const result = await createStagedQuote(mockApiRoot, context, params);

      expect(mockAdminCreate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });

    it('should call store.createStagedQuote when context has storeKey', async () => {
      const context = {projectKey: 'test-project', storeKey: 'store-1'};
      const params = {
        quoteRequest: {
          typeId: 'quote-request' as const,
          key: 'quote-request-key',
        },
        quoteRequestVersion: 2,
        key: 'new-staged-quote',
        state: {typeId: 'state' as const, key: 'custom-state'},
        quoteRequestStateToAccepted: false,
      };
      const mockResult: any = {
        id: 'new-staged-quote',
        stagedQuoteState: 'InProgress',
      };

      mockStoreCreate.mockResolvedValue(mockResult);

      const result = await createStagedQuote(mockApiRoot, context, params);

      expect(mockStoreCreate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });

    it('should default to admin.createStagedQuote when no specific context', async () => {
      const context = {projectKey: 'test-project'};
      const params = {
        quoteRequest: {typeId: 'quote-request' as const, id: 'quote-request-1'},
        quoteRequestVersion: 1,
      };
      const mockResult: any = {
        id: 'new-staged-quote',
        stagedQuoteState: 'InProgress',
      };

      mockAdminCreate.mockResolvedValue(mockResult);

      const result = await createStagedQuote(mockApiRoot, context, params);

      expect(mockAdminCreate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('updateStagedQuote', () => {
    it('should call admin.updateStagedQuote when context has isAdmin', async () => {
      const context = {projectKey: 'test-project', isAdmin: true};
      const params = {
        id: 'staged-quote-1',
        version: 1,
        actions: [{action: 'changeStagedQuoteState', stagedQuoteState: 'Sent'}],
      };
      const mockResult: any = {
        id: 'staged-quote-1',
        version: 2,
        stagedQuoteState: 'Sent',
      };

      mockAdminUpdate.mockResolvedValue(mockResult);

      const result = await updateStagedQuote(mockApiRoot, context, params);

      expect(mockAdminUpdate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });

    it('should call store.updateStagedQuote when context has storeKey', async () => {
      const context = {projectKey: 'test-project', storeKey: 'store-1'};
      const params = {
        key: 'staged-quote-key',
        version: 1,
        actions: [
          {action: 'setSellerComment', sellerComment: 'Updated comment'},
        ],
      };
      const mockResult: any = {
        id: 'staged-quote-1',
        version: 2,
        sellerComment: 'Updated comment',
      };

      mockStoreUpdate.mockResolvedValue(mockResult);

      const result = await updateStagedQuote(mockApiRoot, context, params);

      expect(mockStoreUpdate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });

    it('should default to admin.updateStagedQuote when no specific context', async () => {
      const context = {projectKey: 'test-project'};
      const params = {
        id: 'staged-quote-1',
        version: 1,
        actions: [{action: 'setValidTo', validTo: '2024-12-31T23:59:59.999Z'}],
      };
      const mockResult: any = {
        id: 'staged-quote-1',
        version: 2,
        validTo: '2024-12-31T23:59:59.999Z',
      };

      mockAdminUpdate.mockResolvedValue(mockResult);

      const result = await updateStagedQuote(mockApiRoot, context, params);

      expect(mockAdminUpdate).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from admin functions', async () => {
      const context = {projectKey: 'test-project', isAdmin: true};
      const params = {id: 'non-existent'};
      const error = new Error('Staged quote not found');

      mockAdminRead.mockRejectedValue(error);

      await expect(
        readStagedQuote(mockApiRoot, context, params)
      ).rejects.toThrow('Staged quote not found');
    });

    it('should propagate errors from store functions', async () => {
      const context = {projectKey: 'test-project', storeKey: 'store-1'};
      const params = {
        quoteRequest: {typeId: 'quote-request' as const, id: 'invalid'},
        quoteRequestVersion: 1,
      };
      const error = new Error('Invalid quote request');

      mockStoreCreate.mockRejectedValue(error);

      await expect(
        createStagedQuote(mockApiRoot, context, params)
      ).rejects.toThrow('Invalid quote request');
    });
  });
});

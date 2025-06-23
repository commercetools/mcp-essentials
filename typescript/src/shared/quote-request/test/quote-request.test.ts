import {
  readQuoteRequest,
  createQuoteRequest,
  updateQuoteRequest,
} from '../functions';
import {
  readQuoteRequestParameters,
  createQuoteRequestParameters,
  updateQuoteRequestParameters,
} from '../parameters';
import {z} from 'zod';
import * as baseFunctions from '../base.functions';
import * as adminFunctions from '../admin.functions';

// Mock base functions
jest.mock('../base.functions', () => ({
  readQuoteRequestById: jest.fn(),
  readQuoteRequestByKey: jest.fn(),
  queryQuoteRequests: jest.fn(),
  updateQuoteRequestById: jest.fn(),
  updateQuoteRequestByKey: jest.fn(),
  createQuoteRequest: jest.fn(),
}));

// Mock admin functions
jest.mock('../admin.functions', () => ({
  readQuoteRequest: jest.fn(),
  createQuoteRequest: jest.fn(),
  updateQuoteRequest: jest.fn(),
}));

// Mock API Root
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockWithKey = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockQuoteRequests = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockInStore = jest.fn().mockReturnValue({
  quoteRequests: mockQuoteRequests,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  quoteRequests: mockQuoteRequests,
  inStoreKeyWithStoreKeyValue: mockInStore,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

const context = {projectKey: 'test-project'};

describe('Quote Request Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default successful response
    mockExecute.mockResolvedValue({body: {id: 'mocked-quote-request-id'}});

    // Set up proper chaining
    mockGet.mockReturnValue({execute: mockExecute});
    mockPost.mockReturnValue({execute: mockExecute});
    mockWithId.mockReturnValue({get: mockGet, post: mockPost});
    mockWithKey.mockReturnValue({get: mockGet, post: mockPost});
    mockQuoteRequests.mockReturnValue({
      get: mockGet,
      post: mockPost,
      withId: mockWithId,
      withKey: mockWithKey,
    });
    mockInStore.mockReturnValue({
      quoteRequests: mockQuoteRequests,
    });
    mockWithProjectKey.mockReturnValue({
      quoteRequests: mockQuoteRequests,
      inStoreKeyWithStoreKeyValue: mockInStore,
    });
  });

  describe('readQuoteRequest', () => {
    it('should read a quote request by ID', async () => {
      const params = {id: 'quote-request-id'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {id: 'quote-request-id', version: 1};
      (adminFunctions.readQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should read a quote request by key', async () => {
      const params = {key: 'quote-request-key'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {key: 'quote-request-key', version: 1};
      (adminFunctions.readQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should read quote requests by customer ID', async () => {
      const params = {customerId: 'customer-id'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {
        results: [{id: 'quote-request-id', customer: {id: 'customer-id'}}],
        total: 1,
      };
      (adminFunctions.readQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should read quote requests with where query', async () => {
      const params = {where: ['quoteRequestState="Submitted"']} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {
        results: [{id: 'quote-request-id', quoteRequestState: 'Submitted'}],
        total: 1,
      };
      (adminFunctions.readQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });
  });

  describe('createQuoteRequest', () => {
    it('should create a quote request', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart'},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 1};
      (adminFunctions.createQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await createQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should handle errors', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart'},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      (adminFunctions.createQuoteRequest as jest.Mock).mockRejectedValueOnce(
        new Error('Creation failed')
      );

      await expect(
        createQuoteRequest(mockApiRoot as any, context, params)
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('updateQuoteRequest', () => {
    it('should update a quote request by ID', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 2};
      (adminFunctions.updateQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await updateQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.updateQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should update a quote request by key', async () => {
      const params = {
        key: 'quote-request-key',
        version: 1,
        actions: [{action: 'setComment', comment: 'Updated comment'}],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const mockResult = {key: 'quote-request-key', version: 2};
      (adminFunctions.updateQuoteRequest as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await updateQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(adminFunctions.updateQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should handle errors', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      (adminFunctions.updateQuoteRequest as jest.Mock).mockRejectedValueOnce(
        new Error('Update failed')
      );

      await expect(
        updateQuoteRequest(mockApiRoot as any, context, params)
      ).rejects.toThrow('Update failed');
    });
  });
});

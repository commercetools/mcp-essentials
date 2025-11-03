import {readTransaction, createTransaction} from '../functions';
import * as admin from '../admin.functions';

// Mock the admin functions
jest.mock('../admin.functions');

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockTransactions = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  transactions: mockTransactions,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

// Mock context
const mockContext = {
  projectKey: 'test-project',
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Transaction Functions', () => {
  describe('readTransaction', () => {
    it('should call admin.readTransaction', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['key="transaction-key"'],
        expand: ['application', 'cart'],
      };
      const mockResult = {results: []};
      (admin.readTransaction as jest.Mock).mockResolvedValue(mockResult);

      const result = await readTransaction(
        mockApiRoot as any,
        mockContext,
        params
      );

      expect(admin.readTransaction).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params,
        undefined
      );
      expect(result).toEqual(mockResult);
    });

    it('should call admin.readTransaction with getApiRoot', async () => {
      const params = {
        id: 'test-id',
        expand: ['application', 'cart'],
      };
      const mockResult = {id: 'test-id'};
      const mockGetApiRoot = jest.fn();
      (admin.readTransaction as jest.Mock).mockResolvedValue(mockResult);

      const result = await readTransaction(
        mockApiRoot as any,
        mockContext,
        params,
        mockGetApiRoot
      );

      expect(admin.readTransaction).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params,
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });

    it('should call admin.readTransaction with key', async () => {
      const params = {
        key: 'test-key',
        expand: ['application', 'cart'],
      };
      const mockResult = {key: 'test-key'};
      (admin.readTransaction as jest.Mock).mockResolvedValue(mockResult);

      const result = await readTransaction(
        mockApiRoot as any,
        mockContext,
        params
      );

      expect(admin.readTransaction).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params,
        undefined
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('createTransaction', () => {
    it('should call admin.createTransaction', async () => {
      const params = {
        key: 'test-key',
        application: {
          typeId: 'application',
          id: 'app-id',
        },
        cart: {
          typeId: 'cart',
          id: 'cart-id',
        },
        transactionItems: [
          {
            paymentIntegration: {
              typeId: 'payment-integration',
              id: 'payment-integration-id',
            },
            amount: {
              centAmount: 1000,
              currencyCode: 'EUR',
            },
          },
        ],
      };
      const mockResult = {id: 'new-id', key: 'test-key'};
      const mockGetApiRoot = jest.fn();
      (admin.createTransaction as jest.Mock).mockResolvedValue(mockResult);

      const result = await createTransaction(
        mockApiRoot as any,
        mockContext,
        params,
        mockGetApiRoot
      );

      expect(admin.createTransaction).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params,
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });
  });
});

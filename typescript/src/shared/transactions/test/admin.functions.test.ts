import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {SDKError} from '../../errors/sdkError';
import {createTransactionParameters} from '../parameters';
import z from 'zod';

// Mock the base functions
jest.mock('../base.functions');

const mockApiRoot = {} as ApiRoot;
const mockContext: CommercetoolsFuncContext = {
  projectKey: 'test-project',
  isAdmin: true,
};
const mockGetApiRoot = jest.fn();

describe('Transaction Admin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readTransaction', () => {
    it('should read transaction by ID', async () => {
      const mockResult = {id: 'test-id', key: 'test-key'};
      (base.readTransactionById as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readTransaction(
        mockApiRoot,
        mockContext,
        {
          id: 'test-id',
        },
        mockGetApiRoot
      );

      expect(base.readTransactionById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {id: 'test-id', expand: undefined},
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });

    it('should read transaction by key', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
      };
      (base.readTransactionByKey as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readTransaction(
        mockApiRoot,
        mockContext,
        {
          key: 'test-key',
        },
        mockGetApiRoot
      );

      expect(base.readTransactionByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {key: 'test-key', expand: undefined},
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });

    it('should return undefined when neither id nor key provided', async () => {
      const result = await admin.readTransaction(mockApiRoot, mockContext, {
        limit: 10,
      });

      expect(result).toBeUndefined();
    });

    it('should handle errors when reading transaction', async () => {
      const error = new Error('Base function error');
      (base.readTransactionById as jest.Mock).mockRejectedValue(error);

      await expect(
        admin.readTransaction(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const mockResult = {id: 'new-id', key: 'new-key'};
      (base.createTransaction as jest.Mock).mockResolvedValue(mockResult);

      const params = {
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
      const result = await admin.createTransaction(
        mockApiRoot,
        mockContext,
        params as z.infer<typeof createTransactionParameters>,
        mockGetApiRoot
      );

      expect(base.createTransaction).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params,
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors when creating transaction', async () => {
      const error = new Error('Base function error');
      (base.createTransaction as jest.Mock).mockRejectedValue(error);

      const params = {
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
      await expect(
        admin.createTransaction(
          mockApiRoot,
          mockContext,
          params as z.infer<typeof createTransactionParameters>,
          mockGetApiRoot
        )
      ).rejects.toThrow(SDKError);
    });
  });
});

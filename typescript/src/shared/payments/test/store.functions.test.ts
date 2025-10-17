import {
  storeReadPayment,
  storeCreatePayment,
  storeUpdatePayment,
} from '../store.functions';
import {
  readPaymentById,
  readPaymentByKey,
  queryPayments,
  createPayment,
  updatePaymentById,
  updatePaymentByKey,
} from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');
const mockedReadPaymentById = readPaymentById as jest.MockedFunction<
  typeof readPaymentById
>;
const mockedReadPaymentByKey = readPaymentByKey as jest.MockedFunction<
  typeof readPaymentByKey
>;
const mockedQueryPayments = queryPayments as jest.MockedFunction<
  typeof queryPayments
>;
const mockedCreatePayment = createPayment as jest.MockedFunction<
  typeof createPayment
>;
const mockedUpdatePaymentById = updatePaymentById as jest.MockedFunction<
  typeof updatePaymentById
>;
const mockedUpdatePaymentByKey = updatePaymentByKey as jest.MockedFunction<
  typeof updatePaymentByKey
>;

// Mock the ApiRoot
const mockApiRoot = {
  withProjectKey: jest.fn(),
};

const mockContext = {
  projectKey: 'test-project',
};

describe('Payment Store Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeReadPayment', () => {
    it('should read payment by ID with store filtering', async () => {
      const params = {
        id: 'payment-123',
        storeKey: 'store-123',
        expand: ['customer'],
      };

      mockedReadPaymentById.mockResolvedValue({id: 'payment-123'});

      const result = await storeReadPayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedReadPaymentById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          id: 'payment-123',
          expand: ['customer'],
        }
      );
      expect(result).toEqual({id: 'payment-123'});
    });

    it('should read payment by key with store filtering', async () => {
      const params = {
        key: 'payment-key-123',
        storeKey: 'store-123',
        expand: ['customer'],
      };

      mockedReadPaymentByKey.mockResolvedValue({key: 'payment-key-123'});

      const result = await storeReadPayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedReadPaymentByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'payment-key-123',
          expand: ['customer'],
        }
      );
      expect(result).toEqual({key: 'payment-key-123'});
    });

    it('should query payments with store filtering', async () => {
      const params = {
        storeKey: 'store-123',
        limit: 10,
        offset: 0,
        where: ['amountPlanned.centAmount > 500'],
      };

      mockedQueryPayments.mockResolvedValue({results: []});

      const result = await storeReadPayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedQueryPayments).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          limit: 10,
          offset: 0,
          sort: undefined,
          where: ['amountPlanned.centAmount > 500', 'store(key="store-123")'],
          expand: undefined,
        }
      );
      expect(result).toEqual({results: []});
    });

    it('should handle errors', async () => {
      const params = {id: 'payment-123', storeKey: 'store-123'};
      mockedReadPaymentById.mockRejectedValue(new Error('API error'));

      await expect(
        storeReadPayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('storeCreatePayment', () => {
    it('should create a payment successfully', async () => {
      const params = {
        key: 'payment-key-123',
        storeKey: 'store-123',
        interfaceId: 'stripe',
        amountPlanned: {
          type: 'centPrecision' as const,
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
      };

      mockedCreatePayment.mockResolvedValue({id: 'payment-123'});

      const result = await storeCreatePayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedCreatePayment).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'payment-key-123',
          interfaceId: 'stripe',
          amountPlanned: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1000,
            fractionDigits: 2,
          },
        }
      );
      expect(result).toEqual({id: 'payment-123'});
    });

    it('should throw error when storeKey is missing', async () => {
      const params = {
        key: 'payment-key-123',
        interfaceId: 'stripe',
        amountPlanned: {
          type: 'centPrecision' as const,
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
      };

      await expect(
        storeCreatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow('Missing storeKey in storeCreatePayment parameters');
    });

    it('should handle errors', async () => {
      const params = {
        key: 'payment-key-123',
        storeKey: 'store-123',
        interfaceId: 'stripe',
        amountPlanned: {
          type: 'centPrecision' as const,
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
      };

      mockedCreatePayment.mockRejectedValue(new Error('API error'));

      await expect(
        storeCreatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('storeUpdatePayment', () => {
    it('should update payment by ID', async () => {
      const params = {
        id: 'payment-123',
        storeKey: 'store-123',
        version: 1,
        actions: [
          {
            action: 'changeAmountPlanned',
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 1500,
            },
          },
        ],
      };

      mockedUpdatePaymentById.mockResolvedValue({id: 'payment-123'});

      const result = await storeUpdatePayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedUpdatePaymentById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          id: 'payment-123',
          version: 1,
          actions: [
            {
              action: 'changeAmountPlanned',
              amount: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 1500,
              },
            },
          ],
        }
      );
      expect(result).toEqual({id: 'payment-123'});
    });

    it('should update payment by key', async () => {
      const params = {
        key: 'payment-key-123',
        storeKey: 'store-123',
        version: 1,
        actions: [
          {
            action: 'setKey',
            key: 'new-payment-key',
          },
        ],
      };

      mockedUpdatePaymentByKey.mockResolvedValue({key: 'payment-key-123'});

      const result = await storeUpdatePayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedUpdatePaymentByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'payment-key-123',
          version: 1,
          actions: [
            {
              action: 'setKey',
              key: 'new-payment-key',
            },
          ],
        }
      );
      expect(result).toEqual({key: 'payment-key-123'});
    });

    it('should throw error when neither id nor key provided', async () => {
      const params = {
        storeKey: 'store-123',
        version: 1,
        actions: [
          {
            action: 'setKey',
            key: 'new-payment-key',
          },
        ],
      };

      await expect(
        storeUpdatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a payment'
      );
    });

    it('should handle errors', async () => {
      const params = {
        id: 'payment-123',
        storeKey: 'store-123',
        version: 1,
        actions: [
          {
            action: 'changeAmountPlanned',
            amount: {
              type: 'centPrecision',
              currencyCode: 'USD',
              centAmount: 1500,
            },
          },
        ],
      };

      mockedUpdatePaymentById.mockRejectedValue(new Error('API error'));

      await expect(
        storeUpdatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

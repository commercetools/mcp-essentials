import {
  customerReadPayment,
  customerCreatePayment,
  customerUpdatePayment,
} from '../customer.functions';
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
  customerId: 'customer-123',
};

describe('Payment Customer Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('customerReadPayment', () => {
    it('should read payment by ID with customer filtering', async () => {
      const params = {
        id: 'payment-123',
        expand: ['customer'],
      };

      mockedReadPaymentById.mockResolvedValue({id: 'payment-123'});

      const result = await customerReadPayment(
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

    it('should read payment by key with customer filtering', async () => {
      const params = {
        key: 'payment-key-123',
        expand: ['customer'],
      };

      mockedReadPaymentByKey.mockResolvedValue({
        key: 'payment-key-123',
      });

      const result = await customerReadPayment(
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

    it('should query payments with customer filtering', async () => {
      const params = {
        limit: 10,
        offset: 0,
        where: ['amountPlanned.centAmount > 500'],
      };

      mockedQueryPayments.mockResolvedValue({results: []});

      const result = await customerReadPayment(
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
          where: [
            'amountPlanned.centAmount > 500',
            'customer(id="customer-123")',
          ],
          sort: undefined,
          expand: undefined,
        }
      );
      expect(result).toEqual({results: []});
    });

    it('should handle errors', async () => {
      const params = {id: 'payment-123'};
      mockedReadPaymentById.mockRejectedValue(new Error('API error'));

      await expect(
        customerReadPayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('customerCreatePayment', () => {
    it('should create a payment successfully', async () => {
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

      mockedCreatePayment.mockResolvedValue({id: 'payment-123'});

      const result = await customerCreatePayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedCreatePayment).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual({id: 'payment-123'});
    });

    it('should handle errors', async () => {
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

      mockedCreatePayment.mockRejectedValue(new Error('API error'));

      await expect(
        customerCreatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('customerUpdatePayment', () => {
    it('should update payment by ID', async () => {
      const params = {
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
      };

      mockedUpdatePaymentById.mockResolvedValue({id: 'payment-123'});

      const result = await customerUpdatePayment(
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
        version: 1,
        actions: [
          {
            action: 'setKey',
            key: 'new-payment-key',
          },
        ],
      };

      mockedUpdatePaymentByKey.mockResolvedValue({key: 'payment-key-123'});

      const result = await customerUpdatePayment(
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
        version: 1,
        actions: [
          {
            action: 'setKey',
            key: 'new-payment-key',
          },
        ],
      };

      await expect(
        customerUpdatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a payment'
      );
    });

    it('should handle errors', async () => {
      const params = {
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
      };

      mockedUpdatePaymentById.mockRejectedValue(new Error('API error'));

      await expect(
        customerUpdatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

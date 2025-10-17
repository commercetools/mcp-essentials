import {readPayment, createPayment, updatePayment} from '../admin.functions';
import {
  readPaymentById,
  readPaymentByKey,
  queryPayments,
  createPayment as baseCreatePayment,
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
const mockedCreatePayment = baseCreatePayment as jest.MockedFunction<
  typeof baseCreatePayment
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

describe('Payment Admin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readPayment', () => {
    it('should read payment by ID', async () => {
      mockedReadPaymentById.mockResolvedValue({
        body: {id: 'payment-123'},
      } as any);

      const params = {
        id: 'payment-123',
        expand: ['customer'],
      };
      const result = await readPayment(
        mockApiRoot as any,
        mockContext as any,
        params as any
      );

      expect(mockedReadPaymentById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          id: 'payment-123',
          expand: ['customer'],
        }
      );
      expect(result).toEqual({body: {id: 'payment-123'}});
    });

    it('should read payment by key', async () => {
      const params = {
        key: 'payment-key-123',
        expand: ['customer'],
      };

      // Fix: The mock should return an object matching Payment type (remove 'body' wrapper).
      mockedReadPaymentByKey.mockResolvedValue({
        body: {key: 'payment-key-123'},
      } as any);

      const result = await readPayment(mockApiRoot as any, mockContext as any, {
        key: 'payment-key-123',
        expand: ['customer'],
        // add default values for required parameters to match input type and silence lint error
        limit: 0,
        offset: 0,
      });

      expect(mockedReadPaymentByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'payment-key-123',
          expand: ['customer'],
        }
      );
      expect(result).toEqual({body: {key: 'payment-key-123'}});
    });

    it('should query payments when no id or key provided', async () => {
      const params = {
        limit: 10,
        offset: 0,
        where: ['amountPlanned.centAmount > 500'],
      };

      mockedQueryPayments.mockResolvedValue({body: {results: []}} as any);

      const result = await readPayment(
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
          where: ['amountPlanned.centAmount > 500'],
          sort: undefined,
          expand: undefined,
        }
      );
      expect(result).toEqual({body: {results: []}});
    });

    it('should handle errors', async () => {
      const params = {id: 'payment-123'};
      mockedReadPaymentById.mockRejectedValue(new Error('API error'));

      // Fix: Pass all required parameters (limit, offset) to match input type
      await expect(
        readPayment(mockApiRoot as any, mockContext as any, {
          id: 'payment-123',
          limit: 0,
          offset: 0,
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createPayment', () => {
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

      mockedCreatePayment.mockResolvedValue({body: {id: 'payment-123'}} as any);

      const result = await createPayment(
        mockApiRoot as any,
        mockContext as any,
        params
      );

      expect(mockedCreatePayment).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual({body: {id: 'payment-123'}});
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
        createPayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updatePayment', () => {
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

      mockedUpdatePaymentById.mockResolvedValue({
        body: {id: 'payment-123'},
      } as any);

      const result = await updatePayment(
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
      expect(result).toEqual({body: {id: 'payment-123'}});
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

      mockedUpdatePaymentByKey.mockResolvedValue({
        body: {key: 'payment-key-123'},
      } as any);

      const result = await updatePayment(
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
      expect(result).toEqual({body: {key: 'payment-key-123'}});
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
        updatePayment(mockApiRoot as any, mockContext as any, params)
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
        updatePayment(mockApiRoot as any, mockContext as any, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

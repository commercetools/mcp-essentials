import {
  readPaymentById,
  readPaymentByKey,
  queryPayments,
  createPayment,
  updatePaymentById,
  updatePaymentByKey,
} from '../base.functions';

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
const mockPayments = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  payments: mockPayments,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Payment Base Functions', () => {
  const projectKey = 'test-project';

  describe('readPaymentById', () => {
    it('should read a payment by ID', async () => {
      const params = {
        id: 'payment-123',
        expand: ['customer'],
      };

      await readPaymentById(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'payment-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('readPaymentByKey', () => {
    it('should read a payment by key', async () => {
      const params = {
        key: 'payment-key-123',
        expand: ['customer'],
      };

      await readPaymentByKey(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'payment-key-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('queryPayments', () => {
    it('should query payments with filters', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['amountPlanned.centAmount > 500'],
        expand: ['customer'],
      };

      await queryPayments(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['amountPlanned.centAmount > 500'],
          expand: ['customer'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
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
        paymentMethodInfo: {
          paymentInterface: 'Stripe',
          method: 'Credit Card',
          name: {en: 'Credit Card'},
        },
      };

      await createPayment(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'payment-key-123',
          interfaceId: 'stripe',
          amountPlanned: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1000,
            fractionDigits: 2,
          },
          paymentMethodInfo: {
            paymentInterface: 'Stripe',
            method: 'Credit Card',
            name: {en: 'Credit Card'},
          },
          custom: undefined,
          transaction: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updatePaymentById', () => {
    it('should update a payment by ID', async () => {
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

      await updatePaymentById(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'payment-123'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
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
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updatePaymentByKey', () => {
    it('should update a payment by key', async () => {
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

      await updatePaymentByKey(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPayments).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'payment-key-123'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setKey',
              key: 'new-payment-key',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle errors properly', async () => {
      const errlog = console.error;
      console.error = () => {}; // temporarily override native log fn

      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readPaymentById(mockApiRoot as any, projectKey, {id: 'payment-123'})
      ).rejects.toThrow('API error');

      console.error = errlog; // restore native log fn
    });
  });
});

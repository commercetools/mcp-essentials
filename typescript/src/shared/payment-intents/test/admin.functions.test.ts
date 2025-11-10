import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

const mockApiRoot = {} as ApiRoot;
const mockContext: CommercetoolsFuncContext = {
  projectKey: 'test-project',
  isAdmin: true,
};
const mockGetApiRoot = jest.fn();

describe('Payment Intent Admin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePaymentIntent', () => {
    it('should update a payment intent', async () => {
      const mockResult = {success: true};
      (base.managePaymentIntentById as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        paymentId: 'payment-123',
        actions: [
          {
            action: 'capturePayment' as const,
            amount: {
              centAmount: 10000,
              currencyCode: 'EUR',
            },
            merchantReference: 'invoice-123',
          },
        ],
      };
      const result = await admin.updatePaymentIntent(
        mockApiRoot,
        mockContext,
        params,
        mockGetApiRoot
      );

      expect(base.managePaymentIntentById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          paymentId: 'payment-123',
          actions: params.actions,
        },
        mockGetApiRoot
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors when updating payment intent', async () => {
      const error = new Error('Base function error');
      (base.managePaymentIntentById as jest.Mock).mockRejectedValue(error);

      const params = {
        paymentId: 'payment-123',
        actions: [
          {
            action: 'capturePayment' as const,
            amount: {
              centAmount: 10000,
              currencyCode: 'EUR',
            },
          },
        ],
      };
      await expect(
        admin.updatePaymentIntent(
          mockApiRoot,
          mockContext,
          params,
          mockGetApiRoot
        )
      ).rejects.toThrow(SDKError);
    });
  });
});

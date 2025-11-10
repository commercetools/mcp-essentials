import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the execute method
const mockExecute = jest.fn();
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithPaymentId = jest.fn().mockReturnValue({
  post: mockPost,
});
const mockPaymentIntents = jest.fn().mockReturnValue({
  post: mockPost,
  withPaymentId: mockWithPaymentId,
});

const mockWithProjectKey = jest.fn().mockReturnValue({
  paymentIntents: mockPaymentIntents,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

const projectKey = 'test-project';
const mockGetApiRoot = jest.fn().mockReturnValue(mockApiRoot);

describe('Payment Intent Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetApiRoot.mockReturnValue(mockApiRoot);
  });

  describe('managePaymentIntentById', () => {
    it('should manage a payment intent by ID', async () => {
      const mockResponse = {
        body: {success: true},
      };
      mockExecute.mockResolvedValue(mockResponse);

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

      const result = await base.managePaymentIntentById(
        mockApiRoot,
        projectKey,
        params,
        mockGetApiRoot
      );

      expect(mockGetApiRoot).toHaveBeenCalledWith(
        expect.any(Function),
        'https://checkout.europe-west1.gcp.commercetools.com'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentIntents).toHaveBeenCalled();
      expect(mockWithPaymentId).toHaveBeenCalledWith({
        paymentId: 'payment-123',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          actions: params.actions,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when managing payment intent by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

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
        base.managePaymentIntentById(
          mockApiRoot,
          projectKey,
          params,
          mockGetApiRoot
        )
      ).rejects.toThrow(SDKError);
      await expect(
        base.managePaymentIntentById(
          mockApiRoot,
          projectKey,
          params,
          mockGetApiRoot
        )
      ).rejects.toThrow('Error managing payment intent by ID');
    });
  });
});

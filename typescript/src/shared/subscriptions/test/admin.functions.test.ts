import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

jest.mock('../base.functions');

describe('Subscription Admin Functions', () => {
  const mockApiRoot = {} as ApiRoot;
  const mockContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readSubscription', () => {
    it('should read subscription by ID', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
      };

      (base.readSubscriptionById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {id: 'subscription-123'};
      const result = await admin.readSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.readSubscriptionById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResponse);
    });

    it('should read subscription by key', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
      };

      (base.readSubscriptionByKey as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {key: 'my-subscription'};
      const result = await admin.readSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.readSubscriptionByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResponse);
    });

    it('should query subscriptions when neither id nor key is provided', async () => {
      const mockResponse = {
        results: [{id: 'subscription-1'}, {id: 'subscription-2'}],
      };

      (base.querySubscriptions as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {limit: 20, offset: 0};
      const result = await admin.readSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.querySubscriptions).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const mockResponse = {
        id: 'new-subscription',
        key: 'my-subscription',
        destination: {
          type: 'SQS',
          queueUrl: 'https://sqs.amazonaws.com/my-queue',
        },
      };

      (base.createSubscription as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        destination: {
          type: 'SQS' as const,
          queueUrl: 'https://sqs.amazonaws.com/my-queue',
          region: 'us-east-1',
        },
        changes: [
          {
            resourceTypeId: 'order' as const,
          },
        ],
      };

      const result = await admin.createSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.createSubscription).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription by ID', async () => {
      const mockResponse = {
        id: 'subscription-123',
        version: 2,
      };

      (base.updateSubscriptionById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        id: 'subscription-123',
        version: 1,
        actions: [
          {
            action: 'changeDestination' as const,
            destination: {
              type: 'SNS' as const,
              topicArn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
            },
          },
        ],
      };

      const result = await admin.updateSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateSubscriptionById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'subscription-123',
          version: 1,
          actions: params.actions,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should update subscription by key', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
        version: 2,
      };

      (base.updateSubscriptionByKey as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        key: 'my-subscription',
        version: 1,
        actions: [
          {
            action: 'setKey' as const,
            key: 'updated-subscription',
          },
        ],
      };

      const result = await admin.updateSubscription(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateSubscriptionByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'my-subscription',
          version: 1,
          actions: params.actions,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'setKey' as const,
            key: 'updated-subscription',
          },
        ],
      };

      try {
        await admin.updateSubscription(mockApiRoot, mockContext, params as any);
        fail('Expected updateSubscription to throw an error');
      } catch (error: any) {
        expect(error.message).toContain(
          'Either id or key must be provided for updating a subscription'
        );
      }
    });
  });
});

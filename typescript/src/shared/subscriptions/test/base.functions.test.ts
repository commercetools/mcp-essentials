import * as base from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

describe('Subscription Base Functions', () => {
  const mockApiRoot = {} as ApiRoot;
  const projectKey = 'test-project';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readSubscriptionById', () => {
    it('should read a subscription by ID', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
        destination: {
          type: 'SQS',
          queueUrl: 'https://sqs.amazonaws.com/my-queue',
        },
        changes: [
          {
            resourceTypeId: 'cart',
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const result = await base.readSubscriptionById(mockApiRoot, projectKey, {
        id: 'subscription-123',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when reading by ID', async () => {
      const mockError = new Error('Subscription not found');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      await expect(
        base.readSubscriptionById(mockApiRoot, projectKey, {
          id: 'subscription-123',
        })
      ).rejects.toThrow('Error reading subscription by ID');
    });
  });

  describe('readSubscriptionByKey', () => {
    it('should read a subscription by key', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
        destination: {
          type: 'SNS',
          topicArn: 'arn:aws:sns:us-east-1:123456789012:my-topic',
        },
        messages: [
          {
            resourceTypeId: 'order',
            types: ['OrderCreated'],
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const result = await base.readSubscriptionByKey(mockApiRoot, projectKey, {
        key: 'my-subscription',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when reading by key', async () => {
      const mockError = new Error('Subscription not found');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      await expect(
        base.readSubscriptionByKey(mockApiRoot, projectKey, {
          key: 'my-subscription',
        })
      ).rejects.toThrow('Error reading subscription by key');
    });
  });

  describe('querySubscriptions', () => {
    it('should query subscriptions', async () => {
      const mockResponse = {
        results: [
          {
            id: 'subscription-1',
            key: 'sub-1',
            destination: {type: 'SQS'},
          },
          {
            id: 'subscription-2',
            key: 'sub-2',
            destination: {type: 'SNS'},
          },
        ],
        limit: 20,
        offset: 0,
        count: 2,
        total: 2,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({body: mockResponse}),
          }),
        }),
      });

      const result = await base.querySubscriptions(mockApiRoot, projectKey, {
        limit: 20,
        offset: 0,
        where: ['key="sub-1"'],
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when querying', async () => {
      const mockError = new Error('Query failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockRejectedValue(mockError),
          }),
        }),
      });

      await expect(
        base.querySubscriptions(mockApiRoot, projectKey, {limit: 20})
      ).rejects.toThrow('Error querying subscriptions');
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const mockResponse = {
        id: 'new-subscription-123',
        key: 'new-subscription',
        destination: {
          type: 'SQS',
          queueUrl: 'https://sqs.amazonaws.com/my-queue',
          region: 'us-east-1',
        },
        changes: [
          {
            resourceTypeId: 'order',
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({body: mockResponse}),
          }),
        }),
      });

      const params = {
        key: 'new-subscription',
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

      const result = await base.createSubscription(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating', async () => {
      const mockError = new Error('Creation failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockRejectedValue(mockError),
          }),
        }),
      });

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

      await expect(
        base.createSubscription(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error creating subscription');
    });
  });

  describe('updateSubscriptionById', () => {
    it('should update a subscription by ID', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
        version: 2,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const params = {
        id: 'subscription-123',
        version: 1,
        actions: [
          {
            action: 'setKey' as const,
            key: 'updated-subscription',
          },
        ],
      };

      const result = await base.updateSubscriptionById(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating by ID', async () => {
      const mockError = new Error('Update failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      const params = {
        id: 'subscription-123',
        version: 1,
        actions: [
          {
            action: 'setKey' as const,
            key: 'updated-subscription',
          },
        ],
      };

      await expect(
        base.updateSubscriptionById(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating subscription by ID');
    });
  });

  describe('updateSubscriptionByKey', () => {
    it('should update a subscription by key', async () => {
      const mockResponse = {
        id: 'subscription-123',
        key: 'my-subscription',
        version: 2,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const params = {
        key: 'my-subscription',
        version: 1,
        actions: [
          {
            action: 'setChanges' as const,
            changes: [
              {
                resourceTypeId: 'cart' as const,
              },
            ],
          },
        ],
      };

      const result = await base.updateSubscriptionByKey(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating by key', async () => {
      const mockError = new Error('Update failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        subscriptions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      const params = {
        key: 'my-subscription',
        version: 1,
        actions: [
          {
            action: 'setChanges' as const,
            changes: [
              {
                resourceTypeId: 'cart' as const,
              },
            ],
          },
        ],
      };

      await expect(
        base.updateSubscriptionByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating subscription by key');
    });
  });
});

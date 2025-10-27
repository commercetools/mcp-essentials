import {contextToSubscriptionFunctionMapping} from '../functions';
import {
  readSubscription,
  createSubscription,
  updateSubscription,
} from '../functions';
import * as admin from '../admin.functions';

// Mock the admin functions
jest.mock('../admin.functions');

describe('Subscription Functions', () => {
  const mockApiRoot = {} as any;
  const mockContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToSubscriptionFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {isAdmin: true};
      const mapping = contextToSubscriptionFunctionMapping(context);

      expect(mapping).toEqual({
        read_subscription: admin.readSubscription,
        create_subscription: admin.createSubscription,
        update_subscription: admin.updateSubscription,
      });
    });

    it('should return empty object when no context is provided', () => {
      const mapping = contextToSubscriptionFunctionMapping();

      expect(mapping).toEqual({});
    });

    it('should return empty object when context does not include isAdmin', () => {
      const context = {};
      const mapping = contextToSubscriptionFunctionMapping(context);

      expect(mapping).toEqual({});
    });
  });

  describe('readSubscription', () => {
    it('should call admin readSubscription', async () => {
      const mockResponse = {id: 'subscription-123'};
      (admin.readSubscription as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {id: 'subscription-123'};
      const result = await readSubscription(mockApiRoot, mockContext, params);

      expect(admin.readSubscription).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createSubscription', () => {
    it('should call admin createSubscription', async () => {
      const mockResponse = {id: 'new-subscription'};
      (admin.createSubscription as jest.Mock) = jest
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

      const result = await createSubscription(mockApiRoot, mockContext, params);

      expect(admin.createSubscription).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateSubscription', () => {
    it('should call admin updateSubscription', async () => {
      const mockResponse = {id: 'subscription-123', version: 2};
      (admin.updateSubscription as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        id: 'subscription-123',
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

      const result = await updateSubscription(mockApiRoot, mockContext, params);

      expect(admin.updateSubscription).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

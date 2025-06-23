import {ApiRoot} from '@commercetools/platform-sdk';
import {updateChannel} from '../admin.functions';
import {SDKError} from '../../errors/sdkError';

// Note: Jest globals are automatically available in test files
describe('updateChannel', () => {
  // Mock setup
  let mockPost: jest.Mock;
  let mockWithId: jest.Mock;
  let mockWithKey: jest.Mock;
  let mockChannels: jest.Mock;
  let mockApiRoot: {withProjectKey: jest.Mock};

  const mockContext = {projectKey: 'test-project'};
  const mockUpdatedChannel = {
    id: 'test-channel-id',
    version: 2,
    key: 'updated-channel-key',
    roles: ['InventorySupply', 'ProductDistribution'],
    createdAt: '2023-01-01T00:00:00.000Z',
    lastModifiedAt: '2023-01-02T00:00:00.000Z',
  };

  beforeEach(() => {
    // Initialize mock functions
    mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({body: mockUpdatedChannel}),
    });

    mockWithId = jest.fn().mockReturnValue({
      post: mockPost,
    });

    mockWithKey = jest.fn().mockReturnValue({
      post: mockPost,
    });

    mockChannels = jest.fn().mockReturnValue({
      withId: mockWithId,
      withKey: mockWithKey,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };
  });

  it('should update a channel by ID', async () => {
    const params = {
      id: 'test-channel-id',
      version: 1,
      actions: [
        {
          action: 'changeKey',
          key: 'updated-channel-key',
        },
        {
          action: 'addRoles',
          roles: ['ProductDistribution'],
        },
      ],
    };

    const result = await updateChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockUpdatedChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockWithId).toHaveBeenCalledWith({ID: 'test-channel-id'});
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: params.actions,
      },
    });
  });

  it('should update a channel by key', async () => {
    const params = {
      key: 'test-channel-key',
      version: 1,
      actions: [
        {
          action: 'changeKey',
          key: 'updated-channel-key',
        },
        {
          action: 'setRoles',
          roles: ['InventorySupply', 'ProductDistribution'],
        },
      ],
    };

    const result = await updateChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockUpdatedChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockWithKey).toHaveBeenCalledWith({key: 'test-channel-key'});
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: params.actions,
      },
    });
  });

  it('should throw an error if neither id nor key is provided', async () => {
    const params = {
      version: 1,
      actions: [
        {
          action: 'changeKey',
          key: 'updated-channel-key',
        },
      ],
    };

    await expect(
      updateChannel(mockApiRoot as unknown as ApiRoot, mockContext, params)
    ).rejects.toThrow('Failed to update channel');
  });

  it('should handle errors and wrap them in SDKError', async () => {
    const error = new Error('API error');
    mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockRejectedValue(error),
    });

    mockWithId = jest.fn().mockReturnValue({
      post: mockPost,
    });

    mockChannels = jest.fn().mockReturnValue({
      withId: mockWithId,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };

    const params = {
      id: 'test-channel-id',
      version: 1,
      actions: [
        {
          action: 'changeKey',
          key: 'updated-channel-key',
        },
      ],
    };

    await expect(
      updateChannel(mockApiRoot as unknown as ApiRoot, mockContext, params)
    ).rejects.toThrow(SDKError);
  });
});

import {ApiRoot} from '@commercetools/platform-sdk';
import {createChannel} from '../admin.functions';
import {SDKError} from '../../errors/sdkError';

// Note: Jest globals are automatically available in test files
describe('createChannel', () => {
  // Mock setup
  let mockPost: jest.Mock;
  let mockChannels: jest.Mock;
  let mockApiRoot: {withProjectKey: jest.Mock};

  const mockContext = {projectKey: 'test-project'};
  const mockChannel = {
    id: 'new-channel-id',
    version: 1,
    key: 'new-channel-key',
    roles: ['InventorySupply'],
    createdAt: '2023-01-01T00:00:00.000Z',
    lastModifiedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    // Initialize mock functions
    mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({body: mockChannel}),
    });

    mockChannels = jest.fn().mockReturnValue({
      post: mockPost,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };
  });

  it('should create a channel with required fields', async () => {
    const params = {
      key: 'new-channel-key',
      roles: ['InventorySupply' as const],
    };

    const result = await createChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockPost).toHaveBeenCalledWith({
      body: params,
    });
  });

  it('should create a channel with all optional fields', async () => {
    const params = {
      key: 'new-channel-key',
      roles: ['InventorySupply' as const, 'ProductDistribution' as const],
      name: {
        en: 'Main Warehouse',
        de: 'Hauptlager',
      },
      description: {
        en: 'Main warehouse for inventory',
        de: 'Hauptlager für Inventar',
      },
      address: {
        country: 'DE',
        city: 'Berlin',
      },
      geoLocation: {
        type: 'Point' as const,
        coordinates: [13.377704, 52.516275] as [number, number],
      },
    };

    const result = await createChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockChannel);
    expect(mockPost).toHaveBeenCalledWith({
      body: params,
    });
  });

  it('should handle errors and wrap them in SDKError', async () => {
    const error = new Error('API error');
    mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockRejectedValue(error),
    });

    mockChannels = jest.fn().mockReturnValue({
      post: mockPost,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };

    const params = {
      key: 'new-channel-key',
      roles: ['InventorySupply' as const],
    };

    await expect(
      createChannel(mockApiRoot as unknown as ApiRoot, mockContext, params)
    ).rejects.toThrow(SDKError);
  });
});

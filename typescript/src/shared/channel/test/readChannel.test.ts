import {ApiRoot} from '@commercetools/platform-sdk';
import {readChannel} from '../admin.functions';
import {SDKError} from '../../errors/sdkError';

// Note: Jest globals are automatically available in test files
describe('readChannel', () => {
  // Mock setup
  let mockGet: jest.Mock;
  let mockWithId: jest.Mock;
  let mockWithKey: jest.Mock;
  let mockChannels: jest.Mock;
  let mockApiRoot: {withProjectKey: jest.Mock};

  const mockContext = {projectKey: 'test-project'};
  const mockChannel = {
    id: 'test-channel-id',
    version: 1,
    key: 'test-channel-key',
    roles: ['InventorySupply'],
    createdAt: '2023-01-01T00:00:00.000Z',
    lastModifiedAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    // Initialize mock functions
    mockGet = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({body: mockChannel}),
    });

    mockWithId = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockWithKey = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockChannels = jest.fn().mockReturnValue({
      withId: mockWithId,
      withKey: mockWithKey,
      get: mockGet,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };
  });

  it('should read channel by ID when ID is provided', async () => {
    const params = {id: 'test-channel-id'};
    const result = await readChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockWithId).toHaveBeenCalledWith({ID: 'test-channel-id'});
  });

  it('should read channel by key when key is provided', async () => {
    const params = {key: 'test-channel-key'};
    const result = await readChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockWithKey).toHaveBeenCalledWith({key: 'test-channel-key'});
  });

  it('should query channels when neither ID nor key is provided', async () => {
    const params = {
      where: ['roles contains any "InventorySupply"'],
      limit: 10,
      offset: 0,
      sort: ['createdAt desc'],
    };

    const result = await readChannel(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(result).toEqual(mockChannel);
    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockGet).toHaveBeenCalledWith({
      queryArgs: {
        limit: 10,
        sort: ['createdAt desc'],
        where: ['roles contains any "InventorySupply"'],
      },
    });
  });

  it('should handle errors and wrap them in SDKError', async () => {
    const error = new Error('API error');
    mockGet = jest.fn().mockReturnValue({
      execute: jest.fn().mockRejectedValue(error),
    });

    mockWithId = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockChannels = jest.fn().mockReturnValue({
      withId: mockWithId,
    });

    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        channels: mockChannels,
      }),
    };

    const params = {id: 'test-channel-id'};
    await expect(
      readChannel(mockApiRoot as unknown as ApiRoot, mockContext, params)
    ).rejects.toThrow(SDKError);
  });
});

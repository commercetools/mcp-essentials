import {createStore} from '../functions';
import {SDKError} from '../../errors/sdkError';

// Mock API Root
const mockExecute = jest.fn();
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockStores = jest.fn().mockReturnValue({
  post: mockPost,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  stores: mockStores,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

describe('createStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default successful response
    mockExecute.mockResolvedValue({body: {id: 'mocked-store-id'}});

    // Set up proper chaining
    mockPost.mockReturnValue({execute: mockExecute});
    mockStores.mockReturnValue({
      post: mockPost,
    });
    mockWithProjectKey.mockReturnValue({
      stores: mockStores,
    });
  });

  it('should create a store successfully', async () => {
    const mockStore = {
      id: 'store-id',
      key: 'test-store',
      name: {en: 'Test Store'},
      version: 1,
    };

    mockExecute.mockResolvedValue({
      body: mockStore,
    });

    const context = {
      projectKey: 'test-project',
      isAdmin: true,
    };

    const params = {
      key: 'test-store',
      name: {en: 'Test Store'},
    };

    const result = await createStore(mockApiRoot as any, context, params);

    expect(result).toEqual(mockStore);
    expect(mockWithProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockStores).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        key: 'test-store',
        name: {en: 'Test Store'},
      },
    });
  });

  it('should throw error when not admin', async () => {
    const context = {
      projectKey: 'test-project',
      isAdmin: false,
    };

    const params = {
      key: 'test-store',
      name: {en: 'Test Store'},
    };

    await expect(
      createStore(mockApiRoot as any, context, params)
    ).rejects.toThrow(SDKError);
  });

  it('should handle API errors', async () => {
    const context = {
      projectKey: 'test-project',
      isAdmin: true,
    };

    const params = {
      key: 'test-store',
      name: {en: 'Test Store'},
    };

    mockExecute.mockRejectedValue(new Error('API Error'));

    await expect(
      createStore(mockApiRoot as any, context, params)
    ).rejects.toThrow(SDKError);
  });
});

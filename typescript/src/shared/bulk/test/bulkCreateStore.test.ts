import {bulkCreate} from '../base.functions';
import * as storeFunctions from '../../store/functions';

// Mock store functions
jest.mock('../../store/functions', () => ({
  createStore: jest.fn(),
}));

const mockApiRoot = {
  withProjectKey: jest.fn(),
} as any;

const context = {
  projectKey: 'test-project',
  isAdmin: true,
};

describe('Bulk Create Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create stores in bulk', async () => {
    const mockStore1 = {
      id: 'store-1',
      key: 'store-1',
      name: {en: 'Store 1'},
      version: 1,
    };

    const mockStore2 = {
      id: 'store-2',
      key: 'store-2',
      name: {en: 'Store 2'},
      version: 1,
    };

    (storeFunctions.createStore as jest.Mock)
      .mockResolvedValueOnce(mockStore1)
      .mockResolvedValueOnce(mockStore2);

    const params = {
      items: [
        {
          entityType: 'store' as const,
          data: {
            key: 'store-1',
            name: {en: 'Store 1'},
          },
        },
        {
          entityType: 'store' as const,
          data: {
            key: 'store-2',
            name: {en: 'Store 2'},
          },
        },
      ],
    };

    const result = await bulkCreate(mockApiRoot, context, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual(mockStore1);
    expect(result.results[1]).toEqual(mockStore2);

    expect(storeFunctions.createStore).toHaveBeenCalledTimes(2);
    expect(storeFunctions.createStore).toHaveBeenCalledWith(
      mockApiRoot,
      context,
      {
        key: 'store-1',
        name: {en: 'Store 1'},
      }
    );
    expect(storeFunctions.createStore).toHaveBeenCalledWith(
      mockApiRoot,
      context,
      {
        key: 'store-2',
        name: {en: 'Store 2'},
      }
    );
  });

  it('should handle errors in bulk store creation', async () => {
    (storeFunctions.createStore as jest.Mock).mockRejectedValue(
      new Error('Store creation failed')
    );

    const params = {
      items: [
        {
          entityType: 'store' as const,
          data: {
            key: 'store-1',
            name: {en: 'Store 1'},
          },
        },
      ],
    };

    await expect(bulkCreate(mockApiRoot, context, params)).rejects.toThrow(
      'Bulk creation failed: Store creation failed'
    );
  });
});

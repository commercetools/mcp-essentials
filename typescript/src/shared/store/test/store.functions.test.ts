import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readStore, updateStore} from '../store.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Store Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      storeKey: 'test-store',
    };
  });

  describe('readStore', () => {
    it('should throw error when store key is missing', async () => {
      const contextWithoutStoreKey = {
        projectKey: 'test-project',
      };

      const params = {id: 'store-123'};

      await expect(
        readStore(mockApiRoot, contextWithoutStoreKey as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await readStore(mockApiRoot, contextWithoutStoreKey as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read store');
      }
    });

    it('should read store by ID when it belongs to the context store', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.readStoreById as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        id: 'store-123',
        expand: ['channels'],
      };

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'store-123',
        ['channels']
      );
      expect(result).toEqual(mockStore);
    });

    it('should read store by ID without expand', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.readStoreById as jest.Mock).mockResolvedValue(mockStore);

      const params = {id: 'store-123'};

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'store-123',
        undefined
      );
      expect(result).toEqual(mockStore);
    });

    it('should throw error when store ID does not belong to context store', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'other-store',
        name: {en: 'Other Store'},
        version: 1,
      };
      (baseFunctions.readStoreById as jest.Mock).mockResolvedValue(mockStore);

      const params = {id: 'store-123'};

      await expect(readStore(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readStore(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read store');
      }
    });

    it('should read store by key using context store key', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.readStoreByKey as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        key: 'any-key', // This should be ignored and context.storeKey used
        expand: ['distributionChannels'],
      };

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store', // Uses context.storeKey, not params.key
        ['distributionChannels']
      );
      expect(result).toEqual(mockStore);
    });

    it('should read store by key without expand', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.readStoreByKey as jest.Mock).mockResolvedValue(mockStore);

      const params = {key: 'any-key'};

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        undefined
      );
      expect(result).toEqual(mockStore);
    });

    it('should query stores with context store key filter added', async () => {
      const mockStores = {results: [], total: 0};
      (baseFunctions.queryStores as jest.Mock).mockResolvedValue(mockStores);

      const params = {
        where: ['name(en="Test Store")'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['channels'],
      };

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryStores).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['name(en="Test Store")', 'key="test-store"'],
        20,
        10,
        ['createdAt desc'],
        ['channels']
      );
      expect(result).toEqual(mockStores);
    });

    it('should query stores with only context store key filter when no where provided', async () => {
      const mockStores = {results: [], total: 0};
      (baseFunctions.queryStores as jest.Mock).mockResolvedValue(mockStores);

      const params = {
        limit: 50,
        offset: 25,
        sort: ['lastModifiedAt desc'],
        expand: ['distributionChannels'],
      };

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryStores).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['key="test-store"'],
        50,
        25,
        ['lastModifiedAt desc'],
        ['distributionChannels']
      );
      expect(result).toEqual(mockStores);
    });

    it('should query stores with minimal parameters', async () => {
      const mockStores = {results: [], total: 0};
      (baseFunctions.queryStores as jest.Mock).mockResolvedValue(mockStores);

      const params = {};

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryStores).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['key="test-store"'],
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockStores);
    });

    it('should handle errors during read by ID', async () => {
      const error = new Error('API error');
      (baseFunctions.readStoreById as jest.Mock).mockRejectedValue(error);

      const params = {id: 'store-123'};

      await expect(readStore(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readStore(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe('Failed to read store');
      }
    });

    it('should handle errors during read by key', async () => {
      const error = new Error('API error');
      (baseFunctions.readStoreByKey as jest.Mock).mockRejectedValue(error);

      const params = {key: 'test-store'};

      await expect(readStore(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readStore(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe('Failed to read store');
      }
    });

    it('should handle errors during query', async () => {
      const error = new Error('Query failed');
      (baseFunctions.queryStores as jest.Mock).mockRejectedValue(error);

      const params = {where: ['invalid query']};

      await expect(readStore(mockApiRoot, mockContext, params)).rejects.toThrow(
        SDKError
      );

      try {
        await readStore(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe('Failed to read store');
      }
    });
  });

  describe('updateStore', () => {
    it('should throw error when store key is missing', async () => {
      const contextWithoutStoreKey = {
        projectKey: 'test-project',
      };

      const params = {
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      };

      await expect(
        updateStore(mockApiRoot, contextWithoutStoreKey as any, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateStore(mockApiRoot, contextWithoutStoreKey as any, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update store');
      }
    });

    it('should update store using context store key', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Updated Store'},
        version: 2,
      };
      (baseFunctions.updateStoreByKey as jest.Mock).mockResolvedValue(
        mockStore
      );

      const params = {
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      };

      const result = await updateStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        [{action: 'changeName', name: {en: 'Updated Store'}}]
      );
      expect(result).toEqual(mockStore);
    });

    it('should update store with multiple actions', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Updated Store'},
        version: 2,
      };
      (baseFunctions.updateStoreByKey as jest.Mock).mockResolvedValue(
        mockStore
      );

      const params = {
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Store'}},
          {action: 'setLanguages' as const, languages: ['en', 'fr']},
          {
            action: 'setCountries' as const,
            countries: [{code: 'US'}, {code: 'FR'}],
          },
        ],
      };

      const result = await updateStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        [
          {action: 'changeName', name: {en: 'Updated Store'}},
          {action: 'setLanguages', languages: ['en', 'fr']},
          {action: 'setCountries', countries: [{code: 'US'}, {code: 'FR'}]},
        ]
      );
      expect(result).toEqual(mockStore);
    });

    it('should handle errors during update', async () => {
      const error = new Error('API error');
      (baseFunctions.updateStoreByKey as jest.Mock).mockRejectedValue(error);

      const params = {
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      };

      await expect(
        updateStore(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateStore(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update store'
        );
      }
    });
  });
});

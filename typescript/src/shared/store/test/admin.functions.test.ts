import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readStore, createStore, updateStore} from '../admin.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Store Admin Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      isAdmin: true,
    };
  });

  describe('readStore', () => {
    it('should throw error when not admin', async () => {
      const contextWithoutAdmin = {
        projectKey: 'test-project',
        isAdmin: false,
      };

      const params = {id: 'store-123'};

      await expect(
        readStore(mockApiRoot, contextWithoutAdmin, params)
      ).rejects.toThrow(SDKError);

      try {
        await readStore(mockApiRoot, contextWithoutAdmin, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read store: Admin access required'
        );
      }
    });

    it('should read store by ID', async () => {
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

    it('should read store by key', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.readStoreByKey as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        key: 'test-store',
        expand: ['distributionChannels'],
      };

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
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

      const params = {key: 'test-store'};

      const result = await readStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.readStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        undefined
      );
      expect(result).toEqual(mockStore);
    });

    it('should query stores with all parameters', async () => {
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
        ['name(en="Test Store")'],
        20,
        10,
        ['createdAt desc'],
        ['channels']
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
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockStores);
    });

    it('should handle errors and throw SDKError', async () => {
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
        expect((thrownError as SDKError).message).toBe(
          'Failed to read store: API error'
        );
      }
    });
  });

  describe('createStore', () => {
    it('should throw error when not admin', async () => {
      const contextWithoutAdmin = {
        projectKey: 'test-project',
        isAdmin: false,
      };

      const params = {
        key: 'test-store',
        name: {en: 'Test Store'},
      };

      await expect(
        createStore(mockApiRoot, contextWithoutAdmin, params)
      ).rejects.toThrow(SDKError);

      try {
        await createStore(mockApiRoot, contextWithoutAdmin, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create store: Admin access required'
        );
      }
    });

    it('should create store with minimal parameters', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store'},
        version: 1,
      };
      (baseFunctions.createStore as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        key: 'test-store',
        name: {en: 'Test Store'},
      };

      const result = await createStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.createStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'test-store',
          name: {en: 'Test Store'},
        }
      );
      expect(result).toEqual(mockStore);
    });

    it('should create store with all optional parameters', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Test Store', de: 'Test Laden'},
        version: 1,
      };
      (baseFunctions.createStore as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        key: 'test-store',
        name: {en: 'Test Store', de: 'Test Laden'},
        languages: ['en', 'de'],
        countries: [{code: 'US'}, {code: 'DE'}],
        distributionChannels: [
          {typeId: 'channel' as const, id: 'dist-channel-1'},
        ],
        supplyChannels: [{typeId: 'channel' as const, id: 'supply-channel-1'}],
        productSelections: [
          {
            productSelection: {
              typeId: 'product-selection' as const,
              id: 'selection-1',
            },
          },
        ],
        custom: {
          type: {typeId: 'type' as const, id: 'custom-type-1'},
          fields: {priority: 'high'},
        },
      };

      const result = await createStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.createStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'test-store',
          name: {en: 'Test Store', de: 'Test Laden'},
          languages: ['en', 'de'],
          countries: [{code: 'US'}, {code: 'DE'}],
          distributionChannels: [{typeId: 'channel', id: 'dist-channel-1'}],
          supplyChannels: [{typeId: 'channel', id: 'supply-channel-1'}],
          productSelections: [
            {
              productSelection: {
                typeId: 'product-selection',
                id: 'selection-1',
              },
            },
          ],
          custom: {
            type: {typeId: 'type', id: 'custom-type-1'},
            fields: {priority: 'high'},
          },
        }
      );
      expect(result).toEqual(mockStore);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.createStore as jest.Mock).mockRejectedValue(error);

      const params = {
        key: 'test-store',
        name: {en: 'Test Store'},
      };

      await expect(
        createStore(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createStore(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create store: API error'
        );
      }
    });
  });

  describe('updateStore', () => {
    it('should throw error when not admin', async () => {
      const contextWithoutAdmin = {
        projectKey: 'test-project',
        isAdmin: false,
      };

      const params = {
        id: 'store-123',
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      };

      await expect(
        updateStore(mockApiRoot, contextWithoutAdmin, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateStore(mockApiRoot, contextWithoutAdmin, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update store: Admin access required'
        );
      }
    });

    it('should update store by ID', async () => {
      const mockStore = {
        id: 'store-123',
        key: 'test-store',
        name: {en: 'Updated Store'},
        version: 2,
      };
      (baseFunctions.updateStoreById as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        id: 'store-123',
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      };

      const result = await updateStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStoreById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'store-123',
        [{action: 'changeName', name: {en: 'Updated Store'}}]
      );
      expect(result).toEqual(mockStore);
    });

    it('should update store by key', async () => {
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
        key: 'test-store',
        version: 1,
        actions: [{action: 'setLanguages' as const, languages: ['en', 'fr']}],
      };

      const result = await updateStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStoreByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        [{action: 'setLanguages', languages: ['en', 'fr']}]
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
      (baseFunctions.updateStoreById as jest.Mock).mockResolvedValue(mockStore);

      const params = {
        id: 'store-123',
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Store'}},
          {action: 'setLanguages' as const, languages: ['en', 'de']},
          {
            action: 'setCountries' as const,
            countries: [{code: 'US'}, {code: 'DE'}],
          },
        ],
      };

      const result = await updateStore(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateStoreById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'store-123',
        [
          {action: 'changeName', name: {en: 'Updated Store'}},
          {action: 'setLanguages', languages: ['en', 'de']},
          {action: 'setCountries', countries: [{code: 'US'}, {code: 'DE'}]},
        ]
      );
      expect(result).toEqual(mockStore);
    });

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        version: 1,
        actions: [{action: 'changeName' as const, name: {en: 'Updated Store'}}],
      } as any; // Using type assertion to test error condition

      await expect(
        updateStore(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateStore(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update store: Either store ID or key must be provided'
        );
      }
    });

    it('should handle errors during update by ID', async () => {
      const error = new Error('API error');
      (baseFunctions.updateStoreById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'store-123',
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
          'Failed to update store: API error'
        );
      }
    });

    it('should handle errors during update by key', async () => {
      const error = new Error('API error');
      (baseFunctions.updateStoreByKey as jest.Mock).mockRejectedValue(error);

      const params = {
        key: 'test-store',
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
          'Failed to update store: API error'
        );
      }
    });
  });
});

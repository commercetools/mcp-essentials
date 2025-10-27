import * as store from '../store.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';

// Mock the base functions
jest.mock('../base.functions', () => ({
  readShoppingListById: jest.fn(),
  readShoppingListByKey: jest.fn(),
  queryShoppingLists: jest.fn(),
  queryShoppingListsInStore: jest.fn(),
  readShoppingListByIdInStore: jest.fn(),
  readShoppingListByKeyInStore: jest.fn(),
  createShoppingList: jest.fn(),
  createShoppingListInStore: jest.fn(),
  updateShoppingListById: jest.fn(),
  updateShoppingListByKey: jest.fn(),
  updateShoppingListByIdInStore: jest.fn(),
  updateShoppingListByKeyInStore: jest.fn(),
}));

import * as base from '../base.functions';

const mockApiRoot = {} as any;
const mockContext: CommercetoolsFuncContext = {
  projectKey: 'test-project',
  storeKey: 'test-store',
  customerId: 'test-customer',
  businessUnitKey: 'test-business-unit',
};

describe('Shopping List Store Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readShoppingList', () => {
    it('should read shopping list by ID in store', async () => {
      const mockResponse = {id: 'test-id', name: {en: 'Store Shopping List'}};
      (base.readShoppingListByIdInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await store.readShoppingList(mockApiRoot, mockContext, {
        id: 'test-id',
      });

      expect(base.readShoppingListByIdInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          id: 'test-id',
          expand: undefined,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should read shopping list by key in store', async () => {
      const mockResponse = {
        id: 'test-id',
        key: 'test-key',
        name: {en: 'Store Shopping List'},
      };
      (base.readShoppingListByKeyInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await store.readShoppingList(mockApiRoot, mockContext, {
        key: 'test-key',
      });

      expect(base.readShoppingListByKeyInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          key: 'test-key',
          expand: undefined,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should query shopping lists in store', async () => {
      const mockResponse = {
        results: [
          {id: 'test-id-1', name: {en: 'Store Shopping List 1'}},
          {id: 'test-id-2', name: {en: 'Store Shopping List 2'}},
        ],
      };
      (base.queryShoppingListsInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await store.readShoppingList(mockApiRoot, mockContext, {
        limit: 10,
        offset: 0,
        sort: ['name asc'],
        where: ['customer(id="customer-123")'],
        expand: ['customer'],
      });

      expect(base.queryShoppingListsInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          limit: 10,
          offset: 0,
          sort: ['name asc'],
          where: ['customer(id="customer-123")'],
          expand: ['customer'],
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createShoppingList', () => {
    it('should create shopping list in store and set store', async () => {
      const mockResponse = {
        id: 'new-id',
        name: {en: 'New Store Shopping List'},
      };
      (base.createShoppingListInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const params = {
        name: {en: 'New Store Shopping List'},
        key: 'new-key',
      };

      const result = await store.createShoppingList(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.createShoppingListInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          ...params,
          store: {
            key: mockContext.storeKey,
            typeId: 'store',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should not override existing store in params', async () => {
      const mockResponse = {
        id: 'new-id',
        name: {en: 'New Store Shopping List'},
      };
      (base.createShoppingListInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const params = {
        name: {en: 'New Store Shopping List'},
        key: 'new-key',
        store: {
          key: 'existing-store',
          typeId: 'store' as const,
        },
      };

      const result = await store.createShoppingList(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.createShoppingListInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          ...params,
          store: {
            key: 'existing-store',
            typeId: 'store',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when storeKey is not available in context', async () => {
      const contextWithoutStore: CommercetoolsFuncContext = {
        projectKey: 'test-project',
        customerId: 'test-customer',
        businessUnitKey: 'test-business-unit',
      };

      const params = {
        name: {en: 'New Store Shopping List'},
        key: 'new-key',
      };

      await expect(
        store.createShoppingList(mockApiRoot, contextWithoutStore, params)
      ).rejects.toThrow('Store key is required for store-specific operations');
    });
  });

  describe('updateShoppingList', () => {
    it('should update shopping list by ID in store', async () => {
      const mockResponse = {
        id: 'test-id',
        version: 2,
        name: {en: 'Updated Store Shopping List'},
      };
      (base.updateShoppingListByIdInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Store Shopping List'},
          },
        ],
      };

      const result = await store.updateShoppingList(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateShoppingListByIdInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          id: 'test-id',
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Store Shopping List'},
            },
          ],
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should update shopping list by key in store', async () => {
      const mockResponse = {
        id: 'test-id',
        version: 2,
        name: {en: 'Updated Store Shopping List'},
      };
      (base.updateShoppingListByKeyInStore as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Store Shopping List'},
          },
        ],
      };

      const result = await store.updateShoppingList(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateShoppingListByKeyInStore).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        mockContext.storeKey,
        {
          key: 'test-key',
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Store Shopping List'},
            },
          ],
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Store Shopping List'},
          },
        ],
      };

      await expect(
        store.updateShoppingList(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a shopping list'
      );
    });

    it('should throw error when storeKey is not available in context', async () => {
      const contextWithoutStore: CommercetoolsFuncContext = {
        projectKey: 'test-project',
        customerId: 'test-customer',
        businessUnitKey: 'test-business-unit',
      };

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Store Shopping List'},
          },
        ],
      };

      await expect(
        store.updateShoppingList(mockApiRoot, contextWithoutStore, params)
      ).rejects.toThrow('Store key is required for store-specific operations');
    });
  });
});

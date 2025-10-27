import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the execute method
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockShoppingLists = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  shoppingLists: mockShoppingLists,
});

const mockWithProjectKey = jest.fn().mockReturnValue({
  shoppingLists: mockShoppingLists,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

const projectKey = 'test-project';

describe('Shopping List Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readShoppingListById', () => {
    it('should read a shopping list by ID', async () => {
      const mockResponse = {
        body: {id: 'test-id', key: 'test-key', name: {en: 'Test Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShoppingListById(mockApiRoot, projectKey, {
        id: 'test-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when reading shopping list by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readShoppingListById(mockApiRoot, projectKey, {
          id: 'test-id',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('readShoppingListByKey', () => {
    it('should read a shopping list by key', async () => {
      const mockResponse = {
        body: {id: 'test-id', key: 'test-key', name: {en: 'Test Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShoppingListByKey(mockApiRoot, projectKey, {
        key: 'test-key',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('queryShoppingLists', () => {
    it('should query shopping lists', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'test-id-1', name: {en: 'Shopping List 1'}},
            {id: 'test-id-2', name: {en: 'Shopping List 2'}},
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryShoppingLists(mockApiRoot, projectKey, {
        limit: 10,
        offset: 0,
        sort: ['name asc'],
        where: ['customer(id="customer-123")'],
        expand: ['customer'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['name asc'],
          where: ['customer(id="customer-123")'],
          expand: ['customer'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('queryShoppingListsInStore', () => {
    it('should query shopping lists in store', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'test-id-1', name: {en: 'Store Shopping List 1'}},
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryShoppingListsInStore(
        mockApiRoot,
        projectKey,
        'store-key',
        {
          limit: 10,
          offset: 0,
        }
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: undefined,
          where: undefined,
          expand: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('createShoppingList', () => {
    it('should create a shopping list', async () => {
      const mockResponse = {
        body: {id: 'new-id', key: 'new-key', name: {en: 'New Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        name: {en: 'New Shopping List'},
        key: 'new-key',
        customer: {
          id: 'customer-123',
          typeId: 'customer' as const,
        },
      };

      const result = await base.createShoppingList(mockApiRoot, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'new-key',
          name: {en: 'New Shopping List'},
          slug: undefined,
          description: undefined,
          customer: {
            id: 'customer-123',
            typeId: 'customer',
          },
          store: undefined,
          businessUnit: undefined,
          lineItems: undefined,
          textLineItems: undefined,
          deleteDaysAfterLastModification: undefined,
          anonymousId: undefined,
          custom: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('createShoppingListInStore', () => {
    it('should create a shopping list in store', async () => {
      const mockResponse = {
        body: {id: 'new-id', key: 'new-key', name: {en: 'New Store Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        name: {en: 'New Store Shopping List'},
        key: 'new-key',
        store: {
          key: 'store-key',
          typeId: 'store' as const,
        },
      };

      const result = await base.createShoppingListInStore(
        mockApiRoot,
        projectKey,
        'store-key',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'new-key',
          name: {en: 'New Store Shopping List'},
          slug: undefined,
          description: undefined,
          customer: undefined,
          store: {
            key: 'store-key',
            typeId: 'store',
          },
          businessUnit: undefined,
          lineItems: undefined,
          textLineItems: undefined,
          deleteDaysAfterLastModification: undefined,
          anonymousId: undefined,
          custom: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateShoppingListById', () => {
    it('should update a shopping list by ID', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, name: {en: 'Updated Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Shopping List'},
          },
        ],
      };

      const result = await base.updateShoppingListById(mockApiRoot, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Shopping List'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateShoppingListByKey', () => {
    it('should update a shopping list by key', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, name: {en: 'Updated Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Shopping List'},
          },
        ],
      };

      const result = await base.updateShoppingListByKey(mockApiRoot, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Shopping List'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateShoppingListByIdInStore', () => {
    it('should update a shopping list by ID in store', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, name: {en: 'Updated Store Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

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

      const result = await base.updateShoppingListByIdInStore(
        mockApiRoot,
        projectKey,
        'store-key',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Store Shopping List'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateShoppingListByKeyInStore', () => {
    it('should update a shopping list by key in store', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, name: {en: 'Updated Store Shopping List'}},
      };
      mockExecute.mockResolvedValue(mockResponse);

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

      const result = await base.updateShoppingListByKeyInStore(
        mockApiRoot,
        projectKey,
        'store-key',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({storeKey: 'store-key'});
      expect(mockShoppingLists).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Updated Store Shopping List'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });
});

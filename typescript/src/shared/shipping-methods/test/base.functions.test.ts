import {z} from 'zod';
import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';
import {updateShippingMethodParameters} from '../parameters';

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
const mockShippingMethods = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  shippingMethods: mockShippingMethods,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

const projectKey = 'test-project';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Shipping Method Base Functions', () => {
  describe('readShippingMethodById', () => {
    it('should read a shipping method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Test Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShippingMethodById(
        mockApiRoot,
        projectKey,
        {
          id: 'test-id',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading shipping method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readShippingMethodById(mockApiRoot, projectKey, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('readShippingMethodByKey', () => {
    it('should read a shipping method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Test Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShippingMethodByKey(
        mockApiRoot,
        projectKey,
        {
          key: 'test-key',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading shipping method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readShippingMethodByKey(mockApiRoot, projectKey, {key: 'test-key'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('queryShippingMethods', () => {
    it('should query shipping methods', async () => {
      const mockResponse = {
        body: {
          results: [
            {
              id: 'test-id-1',
              key: 'test-key-1',
              name: 'Test Shipping Method 1',
            },
            {
              id: 'test-id-2',
              key: 'test-key-2',
              name: 'Test Shipping Method 2',
            },
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryShippingMethods(mockApiRoot, projectKey, {
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
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
    });

    it('should handle errors when querying shipping methods', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.queryShippingMethods(mockApiRoot, projectKey, {})
      ).rejects.toThrow();
    });
  });

  describe('createShippingMethod', () => {
    it('should create a shipping method', async () => {
      const mockResponse = {
        body: {
          id: 'new-id',
          key: 'new-key',
          name: 'New Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        name: 'New Shipping Method',
        zoneRates: [],
      };

      const result = await base.createShippingMethod(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          name: 'New Shipping Method',
          zoneRates: [],
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when creating shipping method', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        name: 'New Shipping Method',
        zoneRates: [],
      };

      await expect(
        base.createShippingMethod(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateShippingMethodById', () => {
    it('should update a shipping method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Updated Shipping Method',
          version: 2,
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      } as z.infer<typeof updateShippingMethodParameters>;

      const result = await base.updateShippingMethodById(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating shipping method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      } as z.infer<typeof updateShippingMethodParameters>;

      await expect(
        base.updateShippingMethodById(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateShippingMethodByKey', () => {
    it('should update a shipping method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Updated Shipping Method',
          version: 2,
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      const result = await base.updateShippingMethodByKey(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating shipping method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      await expect(
        base.updateShippingMethodByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('getMatchingShippingMethodsForCart', () => {
    it('should get matching shipping methods for a cart', async () => {
      const mockMatchingCart = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const mockResponse = {
        body: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
          },
        ],
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.getMatchingShippingMethodsForCart(
        mockApiRoot,
        projectKey,
        {
          cartId: 'cart-123',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockMatchingCart).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when getting matching shipping methods for cart', async () => {
      const mockMatchingCart = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.getMatchingShippingMethodsForCart(mockApiRoot, projectKey, {
          cartId: 'cart-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('checkMatchingShippingMethodsForCart', () => {
    it('should check if matching shipping methods exist for a cart', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingCart = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      mockExecute.mockResolvedValue({statusCode: 200});

      const result = await base.checkMatchingShippingMethodsForCart(
        mockApiRoot,
        projectKey,
        {
          cartId: 'cart-123',
        }
      );

      expect(result).toEqual({exists: true});
      expect(mockMatchingCart).toHaveBeenCalled();
      expect(mockHead).toHaveBeenCalledWith({
        queryArgs: {cartId: 'cart-123'},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when checking matching shipping methods for cart', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingCart = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.checkMatchingShippingMethodsForCart(mockApiRoot, projectKey, {
          cartId: 'cart-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('getMatchingShippingMethodsForLocation', () => {
    it('should get matching shipping methods for a location', async () => {
      const mockMatchingLocation = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingLocation: mockMatchingLocation,
      });

      const mockResponse = {
        body: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
          },
        ],
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.getMatchingShippingMethodsForLocation(
        mockApiRoot,
        projectKey,
        {
          country: 'DE',
          state: 'Berlin',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockMatchingLocation).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when getting matching shipping methods for location', async () => {
      const mockMatchingLocation = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingLocation: mockMatchingLocation,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.getMatchingShippingMethodsForLocation(mockApiRoot, projectKey, {
          country: 'DE',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('checkMatchingShippingMethodsForLocation', () => {
    it('should check if matching shipping methods exist for a location', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingLocation = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingLocation: mockMatchingLocation,
      });

      mockExecute.mockResolvedValue({statusCode: 200});

      const result = await base.checkMatchingShippingMethodsForLocation(
        mockApiRoot,
        projectKey,
        {
          country: 'DE',
          state: 'Berlin',
        }
      );

      expect(result).toEqual({exists: true});
      expect(mockMatchingLocation).toHaveBeenCalled();
      expect(mockHead).toHaveBeenCalledWith({
        queryArgs: {country: 'DE', state: 'Berlin'},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when checking matching shipping methods for location', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingLocation = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingLocation: mockMatchingLocation,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.checkMatchingShippingMethodsForLocation(mockApiRoot, projectKey, {
          country: 'DE',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('getMatchingShippingMethodsForCartAndLocation', () => {
    it('should get matching shipping methods for a cart and location', async () => {
      const mockMatchingCart = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const mockResponse = {
        body: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
          },
        ],
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.getMatchingShippingMethodsForCartAndLocation(
        mockApiRoot,
        projectKey,
        {
          cartId: 'cart-123',
          country: 'DE',
          state: 'Berlin',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockMatchingCart).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when getting matching shipping methods for cart and location', async () => {
      const mockMatchingCart = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.getMatchingShippingMethodsForCartAndLocation(
          mockApiRoot,
          projectKey,
          {
            cartId: 'cart-123',
            country: 'DE',
          }
        )
      ).rejects.toThrow(SDKError);
    });
  });

  describe('checkMatchingShippingMethodsForCartAndLocation', () => {
    it('should check if matching shipping methods exist for a cart and location', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingCart = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      mockExecute.mockResolvedValue({statusCode: 200});

      const result = await base.checkMatchingShippingMethodsForCartAndLocation(
        mockApiRoot,
        projectKey,
        {
          cartId: 'cart-123',
          country: 'DE',
          state: 'Berlin',
        }
      );

      expect(result).toEqual({exists: true});
      expect(mockMatchingCart).toHaveBeenCalled();
      expect(mockHead).toHaveBeenCalledWith({
        queryArgs: {cartId: 'cart-123', country: 'DE', state: 'Berlin'},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when checking matching shipping methods for cart and location', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingCart = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingCart: mockMatchingCart,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.checkMatchingShippingMethodsForCartAndLocation(
          mockApiRoot,
          projectKey,
          {
            cartId: 'cart-123',
            country: 'DE',
          }
        )
      ).rejects.toThrow(SDKError);
    });
  });

  describe('getMatchingShippingMethodsForCartInStore', () => {
    it('should get matching shipping methods for a cart in store', async () => {
      const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
        shippingMethods: jest.fn().mockReturnValue({
          matchingCart: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({execute: mockExecute}),
          }),
        }),
      });
      mockWithProjectKey.mockReturnValue({
        shippingMethods: mockShippingMethods,
        inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
      });

      const mockResponse = {
        body: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
          },
        ],
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.getMatchingShippingMethodsForCartInStore(
        mockApiRoot,
        projectKey,
        {
          storeKey: 'store-123',
          cartId: 'cart-123',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'store-123',
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when getting matching shipping methods for cart in store', async () => {
      const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
        shippingMethods: jest.fn().mockReturnValue({
          matchingCart: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({execute: mockExecute}),
          }),
        }),
      });
      mockWithProjectKey.mockReturnValue({
        shippingMethods: mockShippingMethods,
        inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.getMatchingShippingMethodsForCartInStore(mockApiRoot, projectKey, {
          storeKey: 'store-123',
          cartId: 'cart-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('checkMatchingShippingMethodsForCartInStore', () => {
    it('should check if matching shipping methods exist for a cart in store', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
        shippingMethods: jest.fn().mockReturnValue({
          matchingCart: jest.fn().mockReturnValue({
            head: mockHead,
          }),
        }),
      });
      mockWithProjectKey.mockReturnValue({
        shippingMethods: mockShippingMethods,
        inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
      });

      mockExecute.mockResolvedValue({statusCode: 200});

      const result = await base.checkMatchingShippingMethodsForCartInStore(
        mockApiRoot,
        projectKey,
        {
          storeKey: 'store-123',
          cartId: 'cart-123',
        }
      );

      expect(result).toEqual({exists: true});
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'store-123',
      });
      expect(mockHead).toHaveBeenCalledWith({
        queryArgs: {cartId: 'cart-123'},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when checking matching shipping methods for cart in store', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
        shippingMethods: jest.fn().mockReturnValue({
          matchingCart: jest.fn().mockReturnValue({
            head: mockHead,
          }),
        }),
      });
      mockWithProjectKey.mockReturnValue({
        shippingMethods: mockShippingMethods,
        inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.checkMatchingShippingMethodsForCartInStore(
          mockApiRoot,
          projectKey,
          {
            storeKey: 'store-123',
            cartId: 'cart-123',
          }
        )
      ).rejects.toThrow(SDKError);
    });
  });

  describe('getMatchingShippingMethodsForOrderEdit', () => {
    it('should get matching shipping methods for an order edit', async () => {
      const mockMatchingOrderedit = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingOrderedit: mockMatchingOrderedit,
      });

      const mockResponse = {
        body: [
          {
            id: 'shipping-method-1',
            name: 'Standard Shipping',
          },
        ],
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.getMatchingShippingMethodsForOrderEdit(
        mockApiRoot,
        projectKey,
        {
          orderEditId: 'order-edit-123',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockMatchingOrderedit).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when getting matching shipping methods for order edit', async () => {
      const mockMatchingOrderedit = jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({execute: mockExecute}),
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingOrderedit: mockMatchingOrderedit,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.getMatchingShippingMethodsForOrderEdit(mockApiRoot, projectKey, {
          orderEditId: 'order-edit-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('checkMatchingShippingMethodsForOrderEdit', () => {
    it('should check if matching shipping methods exist for an order edit', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingOrderedit = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingOrderedit: mockMatchingOrderedit,
      });

      mockExecute.mockResolvedValue({statusCode: 200});

      const result = await base.checkMatchingShippingMethodsForOrderEdit(
        mockApiRoot,
        projectKey,
        {
          orderEditId: 'order-edit-123',
        }
      );

      expect(result).toEqual({exists: true});
      expect(mockMatchingOrderedit).toHaveBeenCalled();
      expect(mockHead).toHaveBeenCalledWith({
        queryArgs: {orderEditId: 'order-edit-123'},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when checking matching shipping methods for order edit', async () => {
      const mockHead = jest.fn().mockReturnValue({execute: mockExecute});
      const mockMatchingOrderedit = jest.fn().mockReturnValue({
        head: mockHead,
      });
      mockShippingMethods.mockReturnValue({
        get: mockGet,
        post: mockPost,
        withId: mockWithId,
        withKey: mockWithKey,
        matchingOrderedit: mockMatchingOrderedit,
      });

      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.checkMatchingShippingMethodsForOrderEdit(mockApiRoot, projectKey, {
          orderEditId: 'order-edit-123',
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

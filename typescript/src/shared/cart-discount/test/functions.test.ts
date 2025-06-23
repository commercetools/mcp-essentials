import {
  readCartDiscount,
  createCartDiscount,
  updateCartDiscount,
} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock cart discount data
const mockCartDiscount = {
  id: 'test-cart-discount-id',
  version: 1,
  key: 'test-cart-discount',
  name: {
    en: 'Test Cart Discount',
  },
  description: {
    en: 'Test Cart Discount Description',
  },
  cartPredicate: 'totalPrice > "100 USD"',
  value: {
    type: 'relative',
    permyriad: 1000,
  },
  target: {
    type: 'lineItems',
    predicate: 'variant.sku = "TEST-SKU"',
  },
  sortOrder: '0.5',
  isActive: true,
  requiresDiscountCode: false,
  createdAt: '2023-01-01T00:00:00.000Z',
  lastModifiedAt: '2023-01-01T00:00:00.000Z',
};

// Mock cart discount list result
const mockCartDiscountList = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [mockCartDiscount],
};

// Mock ApiRoot
const createMockApiRoot = () => {
  const apiRoot = {
    withProjectKey: jest.fn().mockReturnValue({
      cartDiscounts: jest.fn().mockReturnValue({
        withId: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: mockCartDiscount,
            }),
          }),
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: {...mockCartDiscount, version: 2},
            }),
          }),
        }),
        withKey: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: mockCartDiscount,
            }),
          }),
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: {...mockCartDiscount, version: 2},
            }),
          }),
        }),
        get: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValue({
            body: mockCartDiscountList,
          }),
        }),
        post: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValue({
            body: mockCartDiscount,
          }),
        }),
      }),
      inStoreKeyWithStoreKeyValue: jest.fn().mockReturnValue({
        cartDiscounts: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: mockCartDiscount,
              }),
            }),
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: {...mockCartDiscount, version: 2},
              }),
            }),
          }),
          withKey: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: mockCartDiscount,
              }),
            }),
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: {...mockCartDiscount, version: 2},
              }),
            }),
          }),
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: mockCartDiscountList,
            }),
          }),
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({
              body: mockCartDiscount,
            }),
          }),
        }),
      }),
    }),
  };
  return apiRoot as unknown as ApiRoot;
};

describe('Cart Discount Functions', () => {
  let mockApiRoot: ApiRoot;
  let context: {projectKey: string};

  beforeEach(() => {
    mockApiRoot = createMockApiRoot();
    context = {projectKey: 'test-project'};
  });

  describe('readCartDiscount', () => {
    it('should fetch a cart discount by ID', async () => {
      const params = {id: 'test-cart-discount-id'};
      const result = await readCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscount);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should fetch a cart discount by key', async () => {
      const params = {key: 'test-cart-discount'};
      const result = await readCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscount);
    });

    it('should fetch a list of cart discounts with query parameters', async () => {
      const params = {
        limit: 20,
        where: ['isActive = true'],
        sort: ['name.en asc'],
      };
      const result = await readCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscountList);
    });

    it('should fetch a cart discount by ID from a specific store', async () => {
      const params = {
        id: 'test-cart-discount-id',
        storeKey: 'test-store',
      };
      const result = await readCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey: 'test-project'})
          .inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
    });

    it('should handle API errors gracefully', async () => {
      const projectKey = jest.fn().mockReturnValue({
        cartDiscounts: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(new Error('API Error')),
            }),
          }),
        }),
      });

      const errorApiRoot = {
        withProjectKey: projectKey,
      } as unknown as ApiRoot;

      const params = {id: 'test-cart-discount-id'};

      await expect(
        readCartDiscount(errorApiRoot, context, params)
      ).rejects.toThrow('Failed to read cart discount');
    });
  });

  describe('createCartDiscount', () => {
    it('should create a cart discount with all required fields', async () => {
      const params = {
        name: {en: 'Test Cart Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "100 USD"',
        sortOrder: '0.5',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
      };

      const result = await createCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscount);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should create a cart discount in a specific store', async () => {
      const params = {
        name: {en: 'Test Cart Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "100 USD"',
        sortOrder: '0.5',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
        storeKey: 'test-store',
      };

      const result = await createCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey: 'test-project'})
          .inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
    });

    it('should handle API errors gracefully', async () => {
      const projectKey = jest.fn().mockReturnValue({
        cartDiscounts: jest.fn().mockReturnValue({
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockRejectedValue(new Error('API Error')),
          }),
        }),
      });

      const errorApiRoot = {
        withProjectKey: projectKey,
      } as unknown as ApiRoot;

      const params = {
        name: {en: 'Test Cart Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "100 USD"',
        sortOrder: '0.5',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
      };

      await expect(
        createCartDiscount(errorApiRoot, context, params)
      ).rejects.toThrow('Failed to create cart discount');
    });
  });

  describe('updateCartDiscount', () => {
    it('should update a cart discount by ID', async () => {
      const params = {
        id: 'test-cart-discount-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Cart Discount',
            },
          },
        ],
      };

      const result = await updateCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual({...mockCartDiscount, version: 2});
    });

    it('should update a cart discount by key', async () => {
      const params = {
        key: 'test-cart-discount',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Cart Discount',
            },
          },
        ],
      };

      const result = await updateCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual({...mockCartDiscount, version: 2});
    });

    it('should update a cart discount in a specific store', async () => {
      const params = {
        id: 'test-cart-discount-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Cart Discount',
            },
          },
        ],
        storeKey: 'test-store',
      };

      const result = await updateCartDiscount(mockApiRoot, context, params);

      expect(result).toEqual({...mockCartDiscount, version: 2});
      expect(
        mockApiRoot.withProjectKey({projectKey: 'test-project'})
          .inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
    });

    it('should throw an error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Cart Discount',
            },
          },
        ],
      };

      await expect(
        updateCartDiscount(mockApiRoot, context, params)
      ).rejects.toThrow('Failed to update cart discount');
    });

    it('should handle API errors gracefully', async () => {
      const projectKey = jest.fn().mockReturnValue({
        cartDiscounts: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(new Error('API Error')),
            }),
          }),
        }),
      });

      const errorApiRoot = {
        withProjectKey: projectKey,
      } as unknown as ApiRoot;

      const params = {
        id: 'test-cart-discount-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Cart Discount',
            },
          },
        ],
      };

      await expect(
        updateCartDiscount(errorApiRoot, context, params)
      ).rejects.toThrow('Failed to update cart discount');
    });
  });
});

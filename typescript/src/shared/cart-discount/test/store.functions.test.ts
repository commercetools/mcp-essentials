import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {
  readCartDiscount,
  createCartDiscount,
  updateCartDiscount,
} from '../store.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Cart Discount Store Functions', () => {
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

  describe('readCartDiscount', () => {
    it('should read cart discount by ID with storeKey from context', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.readCartDiscountById as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {id: 'cd-123'};

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartDiscountById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cd-123',
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should read cart discount by ID with expand parameter', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.readCartDiscountById as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        id: 'cd-123',
        expand: ['references[*]'],
      };

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartDiscountById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cd-123',
        ['references[*]'],
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should read cart discount by key with storeKey from context', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.readCartDiscountByKey as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {key: 'test-discount'};

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartDiscountByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-discount',
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should read cart discount by key with expand parameter', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.readCartDiscountByKey as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        key: 'test-discount',
        expand: ['target'],
      };

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartDiscountByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-discount',
        ['target'],
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should query cart discounts with all query parameters', async () => {
      const mockCartDiscounts = {
        results: [
          {
            id: 'cd-123',
            key: 'test-discount',
            name: {en: 'Test Discount'},
            version: 1,
          },
        ],
        total: 1,
        count: 1,
        offset: 0,
        limit: 10,
      };
      (baseFunctions.queryCartDiscounts as jest.Mock).mockResolvedValue(
        mockCartDiscounts
      );

      const params = {
        limit: 20,
        offset: 10,
        sort: ['name.en asc', 'createdAt desc'],
        where: ['isActive=true'],
        expand: ['target'],
      };

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCartDiscounts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        20,
        10,
        ['name.en asc', 'createdAt desc'],
        ['isActive=true'],
        ['target'],
        'test-store'
      );
      expect(result).toEqual(mockCartDiscounts);
    });

    it('should query cart discounts with minimal parameters', async () => {
      const mockCartDiscounts = {
        results: [],
        total: 0,
        count: 0,
        offset: 0,
        limit: 10,
      };
      (baseFunctions.queryCartDiscounts as jest.Mock).mockResolvedValue(
        mockCartDiscounts
      );

      const params = {};

      const result = await readCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCartDiscounts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCartDiscounts);
    });

    it('should handle errors when reading cart discount by ID', async () => {
      const mockError = new Error('Cart discount not found');
      (baseFunctions.readCartDiscountById as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {id: 'cd-123'};

      await expect(
        readCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart discount: Cart discount not found'
        );
      }
    });

    it('should handle errors when reading cart discount by key', async () => {
      const mockError = new Error('Cart discount not found');
      (baseFunctions.readCartDiscountByKey as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {key: 'test-discount'};

      await expect(
        readCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart discount: Cart discount not found'
        );
      }
    });

    it('should handle errors when querying cart discounts', async () => {
      const mockError = new Error('Query failed');
      (baseFunctions.queryCartDiscounts as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {limit: 10};

      await expect(
        readCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart discount: Query failed'
        );
      }
    });
  });

  describe('createCartDiscount', () => {
    it('should create cart discount with minimal parameters using storeKey from context', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.createCartDiscount as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        key: 'test-discount',
        name: {en: 'Test Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "10.00 EUR"',
        sortOrder: '0.1',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
      };

      const result = await createCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCartDiscount).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          key: 'test-discount',
          name: {en: 'Test Discount'},
          value: {
            type: 'relative',
            permyriad: 1000,
          },
          cartPredicate: 'totalPrice > "10.00 EUR"',
          sortOrder: '0.1',
          isActive: true,
          requiresDiscountCode: false,
          stackingMode: 'Stacking',
        },
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should create cart discount with all optional parameters, ignoring storeKey from params', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Test Discount'},
        version: 1,
      };
      (baseFunctions.createCartDiscount as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        key: 'test-discount',
        name: {en: 'Test Discount', de: 'Test Rabatt'},
        description: {en: 'A test discount'},
        value: {
          type: 'absolute' as const,
          money: [
            {
              type: 'centPrecision' as const,
              currencyCode: 'EUR',
              centAmount: 500,
            },
          ],
        },
        cartPredicate: 'totalPrice > "10.00 EUR"',
        target: {
          type: 'lineItems' as const,
          predicate: 'product.id = "prod-123"',
        },
        sortOrder: '0.1',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
        storeKey: 'ignored-store', // This should be ignored
      };

      const result = await createCartDiscount(mockApiRoot, mockContext, params);

      const expectedDraft = {...params};
      delete (expectedDraft as any).storeKey; // Should be removed

      expect(baseFunctions.createCartDiscount).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        expectedDraft,
        'test-store' // Uses context.storeKey instead
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should handle errors when creating cart discount', async () => {
      const mockError = new Error('Creation failed');
      (baseFunctions.createCartDiscount as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        name: {en: 'Test Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "10.00 EUR"',
        sortOrder: '0.1',
        isActive: true,
        requiresDiscountCode: false,
        stackingMode: 'Stacking' as const,
      };

      await expect(
        createCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create cart discount: Creation failed'
        );
      }
    });
  });

  describe('updateCartDiscount', () => {
    it('should update cart discount by ID using storeKey from context', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Updated Discount'},
        version: 2,
      };
      (baseFunctions.updateCartDiscountById as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        id: 'cd-123',
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: {en: 'Updated Discount'},
          },
        ],
      };

      const result = await updateCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCartDiscountById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cd-123',
        1,
        [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
        ],
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should update cart discount by key using storeKey from context', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Updated Discount'},
        version: 2,
      };
      (baseFunctions.updateCartDiscountByKey as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        key: 'test-discount',
        version: 1,
        actions: [
          {
            action: 'changeValue' as const,
            value: {
              type: 'relative' as const,
              permyriad: 2000,
            },
          },
        ],
      };

      const result = await updateCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCartDiscountByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-discount',
        1,
        [
          {
            action: 'changeValue',
            value: {
              type: 'relative',
              permyriad: 2000,
            },
          },
        ],
        'test-store'
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should update cart discount with multiple actions, ignoring storeKey from params', async () => {
      const mockCartDiscount = {
        id: 'cd-123',
        key: 'test-discount',
        name: {en: 'Updated Discount'},
        version: 2,
      };
      (baseFunctions.updateCartDiscountById as jest.Mock).mockResolvedValue(
        mockCartDiscount
      );

      const params = {
        id: 'cd-123',
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: {en: 'Updated Discount'},
          },
          {
            action: 'setDescription' as const,
            description: {en: 'Updated description'},
          },
        ],
        storeKey: 'ignored-store', // This should be ignored
      };

      const result = await updateCartDiscount(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCartDiscountById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cd-123',
        1,
        [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
          {
            action: 'setDescription',
            description: {en: 'Updated description'},
          },
        ],
        'test-store' // Uses context.storeKey instead
      );
      expect(result).toEqual(mockCartDiscount);
    });

    it('should throw error when neither ID nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: {en: 'Updated Discount'},
          },
        ],
      };

      await expect(
        updateCartDiscount(mockApiRoot, mockContext, params as any)
      ).rejects.toThrow(SDKError);

      try {
        await updateCartDiscount(mockApiRoot, mockContext, params as any);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update cart discount: Either id or key must be provided to update a cart discount'
        );
      }
    });

    it('should handle errors when updating cart discount by ID', async () => {
      const mockError = new Error('Update failed');
      (baseFunctions.updateCartDiscountById as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        id: 'cd-123',
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: {en: 'Updated Discount'},
          },
        ],
      };

      await expect(
        updateCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update cart discount: Update failed'
        );
      }
    });

    it('should handle errors when updating cart discount by key', async () => {
      const mockError = new Error('Update failed');
      (baseFunctions.updateCartDiscountByKey as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        key: 'test-discount',
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: {en: 'Updated Discount'},
          },
        ],
      };

      await expect(
        updateCartDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateCartDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update cart discount: Update failed'
        );
      }
    });
  });
});

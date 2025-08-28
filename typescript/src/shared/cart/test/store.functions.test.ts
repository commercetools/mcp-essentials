import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {
  readCart,
  createCart,
  updateCart,
  replicateCart,
} from '../store.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Store Cart Functions', () => {
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

  describe('readCart', () => {
    it('should read cart by context cartId successfully', async () => {
      const mockCart = {id: 'cart-123', version: 1, store: {key: 'test-store'}};
      (baseFunctions.readCartById as jest.Mock).mockResolvedValue(mockCart);

      const contextWithCartId = {...mockContext, cartId: 'cart-123'};
      const params = {};
      const result = await readCart(mockApiRoot, contextWithCartId, params);

      expect(baseFunctions.readCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should read cart by ID successfully', async () => {
      const mockCart = {id: 'cart-123', version: 1, store: {key: 'test-store'}};
      (baseFunctions.readCartById as jest.Mock).mockResolvedValue(mockCart);

      const params = {id: 'cart-123'};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should read cart by key successfully', async () => {
      const mockCart = {
        id: 'cart-123',
        key: 'cart-key',
        version: 1,
        store: {key: 'test-store'},
      };
      (baseFunctions.readCartByKey as jest.Mock).mockResolvedValue(mockCart);

      const params = {key: 'cart-key'};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-key',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should query carts by customerId successfully', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {customerId: 'customer-123'};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customerId="customer-123"'],
        undefined,
        undefined,
        undefined,
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCarts);
    });

    it('should query carts with where conditions successfully', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {where: ['cartState="Active"']};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['cartState="Active"'],
        undefined,
        undefined,
        undefined,
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCarts);
    });

    it('should query all carts when no specific parameters provided', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'test-store'
      );
      expect(result).toEqual(mockCarts);
    });

    it('should throw error when storeKey is missing', async () => {
      const contextWithoutStore = {projectKey: 'test-project'};

      await expect(
        readCart(mockApiRoot, contextWithoutStore as any, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, contextWithoutStore as any, {
          id: 'cart-123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart: Store key is required'
        );
      }
    });

    it('should throw error when cart does not belong to store (by ID)', async () => {
      const mockCart = {
        id: 'cart-123',
        version: 1,
        store: {key: 'other-store'},
      };
      (baseFunctions.readCartById as jest.Mock).mockResolvedValue(mockCart);

      await expect(
        readCart(mockApiRoot, mockContext, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, mockContext, {id: 'cart-123'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart: Cart not found'
        );
      }
    });

    it('should throw error when cart does not belong to store (by key)', async () => {
      const mockCart = {
        id: 'cart-123',
        key: 'cart-key',
        version: 1,
        store: {key: 'other-store'},
      };
      (baseFunctions.readCartByKey as jest.Mock).mockResolvedValue(mockCart);

      await expect(
        readCart(mockApiRoot, mockContext, {key: 'cart-key'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, mockContext, {key: 'cart-key'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart: Cart not found'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.readCartById as jest.Mock).mockRejectedValue(baseError);

      await expect(
        readCart(mockApiRoot, mockContext, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, mockContext, {id: 'cart-123'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read cart: Base function error'
        );
      }
    });
  });

  describe('createCart', () => {
    it('should create cart successfully', async () => {
      const mockCart = {
        id: 'new-cart-123',
        version: 1,
        store: {key: 'test-store'},
      };
      (baseFunctions.createCart as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        currency: 'USD',
        lineItems: [],
      };
      const result = await createCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          currency: 'USD',
          lineItems: [],
          store: {
            key: 'test-store',
            typeId: 'store',
          },
        },
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when storeKey is missing', async () => {
      const contextWithoutStore = {projectKey: 'test-project'};

      await expect(
        createCart(mockApiRoot, contextWithoutStore as any, {currency: 'USD'})
      ).rejects.toThrow(SDKError);

      try {
        await createCart(mockApiRoot, contextWithoutStore as any, {
          currency: 'USD',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create cart: Store key is required'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.createCart as jest.Mock).mockRejectedValue(baseError);

      await expect(
        createCart(mockApiRoot, mockContext, {currency: 'USD'})
      ).rejects.toThrow(SDKError);

      try {
        await createCart(mockApiRoot, mockContext, {currency: 'USD'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create cart: Base function error'
        );
      }
    });
  });

  describe('replicateCart', () => {
    it('should replicate cart successfully', async () => {
      const mockCart = {
        id: 'new-cart-123',
        version: 1,
        store: {key: 'test-store'},
      };
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        true
      );
      (baseFunctions.replicateCart as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        key: 'new-cart-key',
      };
      const result = await replicateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        'source-cart-123'
      );
      expect(baseFunctions.replicateCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {typeId: 'cart', id: 'source-cart-123'},
        'new-cart-key',
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when storeKey is missing', async () => {
      const contextWithoutStore = {projectKey: 'test-project'};

      await expect(
        replicateCart(mockApiRoot, contextWithoutStore as any, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when cart does not belong to store', async () => {
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        false
      );

      await expect(
        replicateCart(mockApiRoot, mockContext, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);

      try {
        await replicateCart(mockApiRoot, mockContext, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to replicate cart: Cannot replicate cart: not from this store'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockRejectedValue(
        baseError
      );

      await expect(
        replicateCart(mockApiRoot, mockContext, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateCart', () => {
    it('should update cart by ID successfully', async () => {
      const mockCart = {id: 'cart-123', version: 2, store: {key: 'test-store'}};
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        true
      );
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        id: 'cart-123',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-123', variantId: 1},
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        'cart-123',
        undefined
      );
      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart by key successfully', async () => {
      const mockCart = {
        id: 'cart-123',
        key: 'cart-key',
        version: 2,
        store: {key: 'test-store'},
      };
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        true
      );
      (baseFunctions.updateCartByKey as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        key: 'cart-key',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-123', variantId: 1},
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        undefined,
        'cart-key'
      );
      expect(baseFunctions.updateCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-key',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart using context cartId', async () => {
      const mockCart = {id: 'cart-123', version: 2, store: {key: 'test-store'}};
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        true
      );
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValue(mockCart);

      const contextWithCartId = {...mockContext, cartId: 'cart-123'};
      const params = {
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-123', variantId: 1},
        ],
      };
      const result = await updateCart(mockApiRoot, contextWithCartId, params);

      expect(baseFunctions.verifyCartBelongsToStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'test-store',
        'cart-123',
        undefined
      );
      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when storeKey is missing', async () => {
      const contextWithoutStore = {projectKey: 'test-project'};

      await expect(
        updateCart(mockApiRoot, contextWithoutStore as any, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when neither ID nor key provided', async () => {
      await expect(
        updateCart(mockApiRoot, mockContext, {
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        } as any)
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update cart: Either cart ID or key must be provided'
        );
      }
    });

    it('should throw error when cart does not belong to store', async () => {
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockResolvedValue(
        false
      );

      await expect(
        updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        })
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update cart: Cannot update cart: not from this store'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.verifyCartBelongsToStore as jest.Mock).mockRejectedValue(
        baseError
      );

      await expect(
        updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

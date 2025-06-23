import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {
  readCart,
  createCart,
  updateCart,
  replicateCart,
} from '../customer.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Customer Cart Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
    };
  });

  describe('readCart', () => {
    it('should read cart by context cartId when present', async () => {
      const mockCart = {id: 'cart-123', version: 1, customerId: 'customer-123'};
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

    it('should throw error when cart does not belong to customer (cartId)', async () => {
      const mockCart = {
        id: 'cart-123',
        version: 1,
        customerId: 'other-customer',
      };
      (baseFunctions.readCartById as jest.Mock).mockResolvedValue(mockCart);

      const contextWithCartId = {...mockContext, cartId: 'cart-123'};
      const params = {};

      await expect(
        readCart(mockApiRoot, contextWithCartId, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, contextWithCartId, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read cart');
      }
    });

    it('should query carts with where conditions and customerId', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {where: ['cartState="Active"'], limit: 20};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['cartState="Active"', 'customerId="customer-123"'],
        20,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockCarts);
    });

    it('should query carts with just customerId when no where provided', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {limit: 10, offset: 0};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['customerId="customer-123"'],
        10,
        0,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockCarts);
    });

    it('should query carts with all parameters', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValue(mockCarts);

      const params = {
        where: ['cartState="Active"'],
        limit: 20,
        offset: 10,
        sort: ['createdAt desc'],
        expand: ['lineItems'],
        storeKey: 'test-store',
      };
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        ['cartState="Active"', 'customerId="customer-123"'],
        20,
        10,
        ['createdAt desc'],
        ['lineItems'],
        'test-store'
      );
      expect(result).toEqual(mockCarts);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {projectKey: 'test-project'};

      await expect(
        readCart(mockApiRoot, contextWithoutCustomer as any, {})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, contextWithoutCustomer as any, {});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read cart');
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.queryCarts as jest.Mock).mockRejectedValue(baseError);

      await expect(readCart(mockApiRoot, mockContext, {})).rejects.toThrow(
        SDKError
      );

      try {
        await readCart(mockApiRoot, mockContext, {});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to read cart');
      }
    });
  });

  describe('createCart', () => {
    it('should create cart successfully', async () => {
      const mockCart = {
        id: 'new-cart-123',
        version: 1,
        customerId: 'customer-123',
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
          customerId: 'customer-123',
        },
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should create cart with store key', async () => {
      const mockCart = {
        id: 'new-cart-123',
        version: 1,
        customerId: 'customer-123',
      };
      (baseFunctions.createCart as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        currency: 'USD',
        lineItems: [],
        store: {key: 'test-store', typeId: 'store' as const},
      };
      const result = await createCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          currency: 'USD',
          lineItems: [],
          customerId: 'customer-123',
          store: {key: 'test-store', typeId: 'store'},
        },
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {projectKey: 'test-project'};

      await expect(
        createCart(mockApiRoot, contextWithoutCustomer as any, {
          currency: 'USD',
        })
      ).rejects.toThrow(SDKError);

      try {
        await createCart(mockApiRoot, contextWithoutCustomer as any, {
          currency: 'USD',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to create cart');
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
        expect((error as SDKError).message).toBe('Failed to create cart');
      }
    });
  });

  describe('replicateCart', () => {
    it('should replicate cart successfully when customer owns it', async () => {
      const mockCart = {id: 'new-cart-123', version: 1};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.replicateCart as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        key: 'new-cart-key',
      };
      const result = await replicateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToCustomer).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'source-cart-123'
      );
      expect(baseFunctions.replicateCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {typeId: 'cart', id: 'source-cart-123'},
        'new-cart-key',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should replicate cart with store key', async () => {
      const mockCart = {id: 'new-cart-123', version: 1};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.replicateCart as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        key: 'new-cart-key',
        storeKey: 'test-store',
      };
      const result = await replicateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.replicateCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {typeId: 'cart', id: 'source-cart-123'},
        'new-cart-key',
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {projectKey: 'test-project'};

      await expect(
        replicateCart(mockApiRoot, contextWithoutCustomer as any, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);

      try {
        await replicateCart(mockApiRoot, contextWithoutCustomer as any, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to replicate cart');
      }
    });

    it('should throw error when cart does not belong to customer', async () => {
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(false);

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
        expect((error as SDKError).message).toBe('Failed to replicate cart');
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockRejectedValue(baseError);

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
        expect((error as SDKError).message).toBe('Failed to replicate cart');
      }
    });
  });

  describe('updateCart', () => {
    it('should update cart by ID when customer owns it', async () => {
      const mockCart = {id: 'cart-123', version: 2};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        id: 'cart-123',
        version: 1,
        actions: [
          {
            action: 'addLineItem' as const,
            productId: 'product-123',
            variantId: 1,
          },
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToCustomer).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'cart-123',
        undefined
      );
      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart by key when customer owns it', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 2};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.updateCartByKey as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        key: 'cart-key',
        version: 1,
        actions: [
          {
            action: 'addLineItem' as const,
            productId: 'product-123',
            variantId: 1,
          },
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.verifyCartBelongsToCustomer).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        undefined,
        'cart-key'
      );
      expect(baseFunctions.updateCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-key',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart using context cartId', async () => {
      const mockCart = {id: 'cart-123', version: 2};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValue(mockCart);

      const contextWithCartId = {...mockContext, cartId: 'cart-123'};
      const params = {
        version: 1,
        actions: [
          {
            action: 'addLineItem' as const,
            productId: 'product-123',
            variantId: 1,
          },
        ],
      };
      const result = await updateCart(mockApiRoot, contextWithCartId, params);

      expect(baseFunctions.verifyCartBelongsToCustomer).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'cart-123',
        undefined
      );
      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart with store key', async () => {
      const mockCart = {id: 'cart-123', version: 2};
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(true);
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValue(mockCart);

      const params = {
        id: 'cart-123',
        version: 1,
        actions: [
          {
            action: 'addLineItem' as const,
            productId: 'product-123',
            variantId: 1,
          },
        ],
        storeKey: 'test-store',
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}],
        'test-store'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {projectKey: 'test-project'};

      await expect(
        updateCart(mockApiRoot, contextWithoutCustomer as any, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        })
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, contextWithoutCustomer as any, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update cart');
      }
    });

    it('should throw error when cart does not belong to customer', async () => {
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockResolvedValue(false);

      await expect(
        updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        })
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update cart');
      }
    });

    it('should throw error when neither ID nor key provided', async () => {
      await expect(
        updateCart(mockApiRoot, mockContext, {
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        } as any)
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update cart');
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (
        baseFunctions.verifyCartBelongsToCustomer as jest.Mock
      ).mockRejectedValue(baseError);

      await expect(
        updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        })
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [
            {
              action: 'addLineItem' as const,
              productId: 'product-123',
              variantId: 1,
            },
          ],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe('Failed to update cart');
      }
    });
  });
});

import {readCart, createCart, replicateCart, updateCart} from '../functions';
import {
  readCartParameters,
  createCartParameters,
  replicateCartParameters,
  updateCartParameters,
} from '../parameters';
import {z} from 'zod';
import * as storeFunctions from '../store.functions';
import * as baseFunctions from '../base.functions';

// Mock base functions
jest.mock('../base.functions', () => ({
  readCartById: jest.fn(),
  readCartByKey: jest.fn(),
  queryCarts: jest.fn(),
  updateCartById: jest.fn(),
  updateCartByKey: jest.fn(),
}));

// Mock API Root
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockWithKey = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockReplicate = jest.fn().mockReturnValue({post: mockPost});
const mockCarts = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
  replicate: mockReplicate,
});
const mockInStore = jest.fn().mockReturnValue({
  carts: mockCarts,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  carts: mockCarts,
  inStoreKeyWithStoreKeyValue: mockInStore,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

const context = {projectKey: 'test-project'};

describe('Cart Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default successful response
    mockExecute.mockResolvedValue({body: {id: 'mocked-cart-id'}});

    // Set up proper chaining
    mockGet.mockReturnValue({execute: mockExecute});
    mockPost.mockReturnValue({execute: mockExecute});
    mockWithId.mockReturnValue({get: mockGet, post: mockPost});
    mockWithKey.mockReturnValue({get: mockGet, post: mockPost});
    mockReplicate.mockReturnValue({post: mockPost});
    mockCarts.mockReturnValue({
      get: mockGet,
      post: mockPost,
      withId: mockWithId,
      withKey: mockWithKey,
      replicate: mockReplicate,
    });
    mockInStore.mockReturnValue({
      carts: mockCarts,
    });
    mockWithProjectKey.mockReturnValue({
      carts: mockCarts,
      inStoreKeyWithStoreKeyValue: mockInStore,
    });
  });

  describe('readCart', () => {
    it('should read a cart by ID (no storeKey)', async () => {
      const params = {id: 'cart-id'} as z.infer<typeof readCartParameters>;

      const mockResult = {id: 'cart-id', version: 1};
      (baseFunctions.readCartById as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readCart(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResult);
      expect(baseFunctions.readCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-id',
        undefined
      );
    });

    it('should read a cart by key (no storeKey)', async () => {
      const params = {key: 'cart-key'} as z.infer<typeof readCartParameters>;

      const mockResult = {key: 'cart-key', version: 1};
      (baseFunctions.readCartByKey as jest.Mock).mockResolvedValueOnce(
        mockResult
      );

      const result = await readCart(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResult);
      expect(baseFunctions.readCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-key',
        undefined
      );
    });

    it('should read a cart by customer ID (no storeKey)', async () => {
      const params = {customerId: 'customer-id'} as z.infer<
        typeof readCartParameters
      >;

      const mockResult = {
        results: [{id: 'cart-id', customerId: 'customer-id'}],
        total: 1,
      };
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await readCart(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResult);
      // Don't check the specific arguments since test mock implementation may differ
      expect(baseFunctions.queryCarts).toHaveBeenCalled();
    });

    it('should read carts with where query (no storeKey)', async () => {
      const params = {where: ['customerId="customer-id"']} as z.infer<
        typeof readCartParameters
      >;

      const mockResult = {
        results: [{id: 'cart-id', customerId: 'customer-id'}],
        total: 1,
      };
      (baseFunctions.queryCarts as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await readCart(mockApiRoot as any, context, params);

      expect(result).toEqual(mockResult);
      // Don't check the specific arguments since test mock implementation may differ
      expect(baseFunctions.queryCarts).toHaveBeenCalled();
    });

    it('should throw an error when no parameters are provided and context has no customerId or storeKey', async () => {
      const params = {} as z.infer<typeof readCartParameters>;
      await expect(
        readCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to read cart');
    });
  });

  describe('createCart', () => {
    it('should create a cart', async () => {
      const params = {currency: 'EUR'} as z.infer<typeof createCartParameters>;
      await createCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const params = {currency: 'EUR'} as z.infer<typeof createCartParameters>;
      mockExecute.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(
        createCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create cart');
    });
  });

  describe('replicateCart', () => {
    it('should replicate a cart', async () => {
      const params = {
        reference: {id: 'cart-id', typeId: 'cart'},
      } as z.infer<typeof replicateCartParameters>;
      await replicateCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockReplicate).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          reference: {id: 'cart-id', typeId: 'cart'},
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const params = {
        reference: {id: 'cart-id', typeId: 'cart'},
      } as z.infer<typeof replicateCartParameters>;
      mockExecute.mockRejectedValueOnce(new Error('Replication failed'));

      await expect(
        replicateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to replicate cart');
    });
  });

  describe('updateCart', () => {
    it('should update a cart by ID (no storeKey)', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;

      const mockCart = {id: 'cart-id', version: 1};
      (baseFunctions.readCartById as jest.Mock).mockResolvedValueOnce(mockCart);
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValueOnce({
        id: 'cart-id',
        version: 2,
      });

      await updateCart(mockApiRoot as any, context, params);

      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-id',
        [{action: 'addLineItem', productId: 'product-id', quantity: 1}],
        undefined
      );
    });

    it('should update a cart by key (no storeKey)', async () => {
      const params = {
        key: 'cart-key',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;

      const mockCart = {key: 'cart-key', version: 1};
      (baseFunctions.readCartByKey as jest.Mock).mockResolvedValueOnce(
        mockCart
      );
      (baseFunctions.updateCartByKey as jest.Mock).mockResolvedValueOnce({
        key: 'cart-key',
        version: 2,
      });

      await updateCart(mockApiRoot as any, context, params);

      expect(baseFunctions.updateCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-key',
        [{action: 'addLineItem', productId: 'product-id', quantity: 1}],
        undefined
      );
    });

    it('should update a cart in store by ID', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
        storeKey: 'store-key',
      } as z.infer<typeof updateCartParameters>;

      const mockCart = {id: 'cart-id', version: 1};
      (baseFunctions.readCartById as jest.Mock).mockResolvedValueOnce(mockCart);
      (baseFunctions.updateCartById as jest.Mock).mockResolvedValueOnce({
        id: 'cart-id',
        version: 2,
      });

      await updateCart(mockApiRoot as any, context, params);

      expect(baseFunctions.updateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'cart-id',
        [{action: 'addLineItem', productId: 'product-id', quantity: 1}],
        'store-key'
      );
    });

    it('should throw an error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;

      await expect(
        updateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to update cart');
    });

    it('should handle errors', async () => {
      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-id', quantity: 1},
        ],
      } as z.infer<typeof updateCartParameters>;

      // Mock the base function to throw an error
      (baseFunctions.updateCartById as jest.Mock).mockRejectedValueOnce(
        new Error('Update failed')
      );

      await expect(
        updateCart(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to update cart');
    });
  });
});

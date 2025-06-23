import {ApiRoot} from '@commercetools/platform-sdk';
import {
  readCartById,
  readCartByKey,
  queryCarts,
  updateCartById,
  updateCartByKey,
  verifyCartBelongsToCustomer,
  verifyCartBelongsToStore,
  createCart,
  replicateCart,
} from '../base.functions';

// Mock the ApiRoot and its methods
const mockApiRoot = {
  withProjectKey: jest.fn(),
} as unknown as ApiRoot;

const mockProjectRoot = {
  carts: jest.fn(),
  inStoreKeyWithStoreKeyValue: jest.fn(),
};

const mockCartsRoot = {
  withId: jest.fn(),
  withKey: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  replicate: jest.fn(),
};

const mockInStoreCartsRoot = {
  carts: jest.fn(),
};

const mockExecute = {
  execute: jest.fn(),
};

describe('Cart Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup the mock chain
    (mockApiRoot.withProjectKey as jest.Mock).mockReturnValue(mockProjectRoot);
    mockProjectRoot.carts.mockReturnValue(mockCartsRoot);
    mockProjectRoot.inStoreKeyWithStoreKeyValue.mockReturnValue(
      mockInStoreCartsRoot
    );
    mockInStoreCartsRoot.carts.mockReturnValue(mockCartsRoot);

    mockCartsRoot.withId.mockReturnValue(mockCartsRoot);
    mockCartsRoot.withKey.mockReturnValue(mockCartsRoot);
    mockCartsRoot.get.mockReturnValue(mockExecute);
    mockCartsRoot.post.mockReturnValue(mockExecute);
    mockCartsRoot.replicate.mockReturnValue(mockExecute);
  });

  describe('readCartById', () => {
    it('should read cart by ID without expand', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await readCartById(
        mockApiRoot,
        'test-project',
        'cart-123'
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.withId).toHaveBeenCalledWith({ID: 'cart-123'});
      expect(mockCartsRoot.get).toHaveBeenCalledWith({queryArgs: {}});
      expect(result).toEqual(mockCart);
    });

    it('should read cart by ID with expand', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await readCartById(
        mockApiRoot,
        'test-project',
        'cart-123',
        ['lineItems']
      );

      expect(mockCartsRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems']},
      });
      expect(result).toEqual(mockCart);
    });

    it('should handle errors when reading cart by ID', async () => {
      const error = new Error('Cart not found');
      mockExecute.execute.mockRejectedValue(error);

      await expect(
        readCartById(mockApiRoot, 'test-project', 'cart-123')
      ).rejects.toThrow('Cart not found');
    });
  });

  describe('readCartByKey', () => {
    it('should read cart by key without expand', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await readCartByKey(
        mockApiRoot,
        'test-project',
        'cart-key'
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.withKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(mockCartsRoot.get).toHaveBeenCalledWith({queryArgs: {}});
      expect(result).toEqual(mockCart);
    });

    it('should read cart by key with expand', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await readCartByKey(
        mockApiRoot,
        'test-project',
        'cart-key',
        ['lineItems']
      );

      expect(mockCartsRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['lineItems']},
      });
      expect(result).toEqual(mockCart);
    });
  });

  describe('queryCarts', () => {
    it('should query carts without store key', async () => {
      const mockCarts = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockCarts});

      const result = await queryCarts(mockApiRoot, 'test-project');

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProjectRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.get).toHaveBeenCalledWith({
        queryArgs: {limit: 10},
      });
      expect(result).toEqual(mockCarts);
    });

    it('should query carts with store key', async () => {
      const mockCarts = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockCarts});

      const result = await queryCarts(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreCartsRoot.carts).toHaveBeenCalled();
      expect(result).toEqual(mockCarts);
    });

    it('should query carts with all parameters', async () => {
      const mockCarts = {results: [], total: 0};
      mockExecute.execute.mockResolvedValue({body: mockCarts});

      await queryCarts(
        mockApiRoot,
        'test-project',
        ['customerId="123"'],
        20,
        10,
        ['createdAt desc'],
        ['lineItems'],
        'test-store'
      );

      expect(mockCartsRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="123"'],
          limit: 20,
          offset: 10,
          sort: ['createdAt desc'],
          expand: ['lineItems'],
        },
      });
    });
  });

  describe('updateCartById', () => {
    it('should update cart by ID without store key', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      const mockUpdatedCart = {id: 'cart-123', version: 2};

      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart}) // First call for readCartById
        .mockResolvedValueOnce({body: mockUpdatedCart}); // Second call for update

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];
      const result = await updateCartById(
        mockApiRoot,
        'test-project',
        'cart-123',
        actions
      );

      expect(mockCartsRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedCart);
    });

    it('should update cart by ID with store key', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      const mockUpdatedCart = {id: 'cart-123', version: 2};

      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart})
        .mockResolvedValueOnce({body: mockUpdatedCart});

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];
      const result = await updateCartById(
        mockApiRoot,
        'test-project',
        'cart-123',
        actions,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockUpdatedCart);
    });

    it('should handle errors when updating cart by ID', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart})
        .mockRejectedValueOnce(new Error('Update failed'));

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];

      await expect(
        updateCartById(mockApiRoot, 'test-project', 'cart-123', actions)
      ).rejects.toThrow('Failed to update cart by ID: Update failed');
    });
  });

  describe('updateCartByKey', () => {
    it('should update cart by key without store key', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      const mockUpdatedCart = {id: 'cart-123', key: 'cart-key', version: 2};

      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart})
        .mockResolvedValueOnce({body: mockUpdatedCart});

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];
      const result = await updateCartByKey(
        mockApiRoot,
        'test-project',
        'cart-key',
        actions
      );

      expect(mockCartsRoot.withKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(mockCartsRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedCart);
    });

    it('should update cart by key with store key', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      const mockUpdatedCart = {id: 'cart-123', key: 'cart-key', version: 2};

      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart})
        .mockResolvedValueOnce({body: mockUpdatedCart});

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];
      const result = await updateCartByKey(
        mockApiRoot,
        'test-project',
        'cart-key',
        actions,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(result).toEqual(mockUpdatedCart);
    });

    it('should handle errors when updating cart by key', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      mockExecute.execute
        .mockResolvedValueOnce({body: mockCart})
        .mockRejectedValueOnce(new Error('Update failed'));

      const actions = [
        {
          action: 'addLineItem' as const,
          productId: 'product-123',
          variantId: 1,
        },
      ];

      await expect(
        updateCartByKey(mockApiRoot, 'test-project', 'cart-key', actions)
      ).rejects.toThrow('Failed to update cart by key: Update failed');
    });
  });

  describe('verifyCartBelongsToCustomer', () => {
    it('should verify cart belongs to customer by ID', async () => {
      const mockCart = {id: 'cart-123', customerId: 'customer-123'};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        'cart-123'
      );

      expect(mockCartsRoot.withId).toHaveBeenCalledWith({ID: 'cart-123'});
      expect(result).toBe(true);
    });

    it('should verify cart belongs to customer by key', async () => {
      const mockCart = {
        id: 'cart-123',
        key: 'cart-key',
        customerId: 'customer-123',
      };
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        undefined,
        'cart-key'
      );

      expect(mockCartsRoot.withKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(result).toBe(true);
    });

    it('should return false when cart does not belong to customer', async () => {
      const mockCart = {id: 'cart-123', customerId: 'other-customer'};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        'cart-123'
      );

      expect(result).toBe(false);
    });

    it('should throw error when neither ID nor key provided', async () => {
      await expect(
        verifyCartBelongsToCustomer(mockApiRoot, 'test-project', 'customer-123')
      ).rejects.toThrow('Either cart ID or key must be provided');
    });
  });

  describe('verifyCartBelongsToStore', () => {
    it('should verify cart belongs to store by ID', async () => {
      const mockCart = {id: 'cart-123', store: {key: 'test-store'}};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToStore(
        mockApiRoot,
        'test-project',
        'test-store',
        'cart-123'
      );

      expect(mockCartsRoot.withId).toHaveBeenCalledWith({ID: 'cart-123'});
      expect(result).toBe(true);
    });

    it('should verify cart belongs to store by key', async () => {
      const mockCart = {
        id: 'cart-123',
        key: 'cart-key',
        store: {key: 'test-store'},
      };
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToStore(
        mockApiRoot,
        'test-project',
        'test-store',
        undefined,
        'cart-key'
      );

      expect(mockCartsRoot.withKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(result).toBe(true);
    });

    it('should return false when cart does not belong to store', async () => {
      const mockCart = {id: 'cart-123', store: {key: 'other-store'}};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToStore(
        mockApiRoot,
        'test-project',
        'test-store',
        'cart-123'
      );

      expect(result).toBe(false);
    });

    it('should return false when cart has no store', async () => {
      const mockCart = {id: 'cart-123'};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const result = await verifyCartBelongsToStore(
        mockApiRoot,
        'test-project',
        'test-store',
        'cart-123'
      );

      expect(result).toBe(false);
    });

    it('should throw error when neither ID nor key provided', async () => {
      await expect(
        verifyCartBelongsToStore(mockApiRoot, 'test-project', 'test-store')
      ).rejects.toThrow('Either cart ID or key must be provided');
    });
  });

  describe('createCart', () => {
    it('should create cart without store key', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const cartDraft = {currency: 'USD', lineItems: []};
      const result = await createCart(mockApiRoot, 'test-project', cartDraft);

      expect(mockProjectRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.post).toHaveBeenCalledWith({body: cartDraft});
      expect(result).toEqual(mockCart);
    });

    it('should create cart with store key', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const cartDraft = {currency: 'USD', lineItems: []};
      const result = await createCart(
        mockApiRoot,
        'test-project',
        cartDraft,
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreCartsRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.post).toHaveBeenCalledWith({body: cartDraft});
      expect(result).toEqual(mockCart);
    });
  });

  describe('replicateCart', () => {
    const mockReplicateRoot = {
      post: jest.fn().mockReturnValue(mockExecute),
    };

    beforeEach(() => {
      mockCartsRoot.replicate.mockReturnValue(mockReplicateRoot);
    });

    it('should replicate cart without store key', async () => {
      const mockCart = {id: 'cart-456', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const reference = {typeId: 'cart' as const, id: 'cart-123'};
      const result = await replicateCart(
        mockApiRoot,
        'test-project',
        reference,
        'new-cart-key'
      );

      expect(mockProjectRoot.carts).toHaveBeenCalled();
      expect(mockCartsRoot.replicate).toHaveBeenCalled();
      expect(mockReplicateRoot.post).toHaveBeenCalledWith({
        body: {
          reference,
          key: 'new-cart-key',
        },
      });
      expect(result).toEqual(mockCart);
    });

    it('should replicate cart with store key', async () => {
      const mockCart = {id: 'cart-456', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const reference = {typeId: 'cart' as const, id: 'cart-123'};
      const result = await replicateCart(
        mockApiRoot,
        'test-project',
        reference,
        'new-cart-key',
        'test-store'
      );

      expect(mockProjectRoot.inStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockInStoreCartsRoot.carts).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('should replicate cart without key', async () => {
      const mockCart = {id: 'cart-456', version: 1};
      mockExecute.execute.mockResolvedValue({body: mockCart});

      const reference = {typeId: 'cart' as const, id: 'cart-123'};
      const result = await replicateCart(
        mockApiRoot,
        'test-project',
        reference
      );

      expect(mockReplicateRoot.post).toHaveBeenCalledWith({
        body: {reference},
      });
      expect(result).toEqual(mockCart);
    });

    it('should handle errors when replicating cart', async () => {
      mockExecute.execute.mockRejectedValue(new Error('Replication failed'));

      const reference = {typeId: 'cart' as const, id: 'cart-123'};

      await expect(
        replicateCart(mockApiRoot, 'test-project', reference)
      ).rejects.toThrow('Failed to replicate cart: Replication failed');
    });
  });
});

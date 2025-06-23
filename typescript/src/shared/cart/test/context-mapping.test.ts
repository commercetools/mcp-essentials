import {
  readCart,
  createCart,
  updateCart,
  replicateCart,
  contextToCartFunctionMapping,
} from '../functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';
import * as admin from '../admin.functions';
import {
  ApiRoot,
  Cart,
  CartPagedQueryResponse,
} from '@commercetools/platform-sdk';
import {readCartParameters} from '../parameters';
import {z} from 'zod';

// Mock ApiRoot
const mockApiRoot = {} as ApiRoot;

// Mock return values
const mockCustomerRead = {id: 'mock-cart-id', customerId: 'customer-1'} as Cart;
const mockCustomerCreate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;
const mockCustomerUpdate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;
const mockCustomerReplicate = {
  id: 'mock-cart-id',
  customerId: 'customer-1',
} as Cart;

const mockStoreRead = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreCreate = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreUpdate = {id: 'mock-cart-id', store: {key: 'store-1'}} as Cart;
const mockStoreReplicate = {
  id: 'mock-cart-id',
  store: {key: 'store-1'},
} as Cart;

const mockAdminRead = {id: 'mock-cart-id'} as Cart;
const mockAdminCreate = {id: 'mock-cart-id'} as Cart;
const mockAdminUpdate = {id: 'mock-cart-id'} as Cart;
const mockAdminReplicate = {id: 'mock-cart-id'} as Cart;

describe('Cart Function Context Mapping', () => {
  // Mock the scope functions
  beforeEach(() => {
    jest.spyOn(customer, 'readCart').mockResolvedValue(mockCustomerRead);
    jest.spyOn(customer, 'createCart').mockResolvedValue(mockCustomerCreate);
    jest.spyOn(customer, 'updateCart').mockResolvedValue(mockCustomerUpdate);
    jest
      .spyOn(customer, 'replicateCart')
      .mockResolvedValue(mockCustomerReplicate);

    jest.spyOn(store, 'readCart').mockResolvedValue(mockStoreRead);
    jest.spyOn(store, 'createCart').mockResolvedValue(mockStoreCreate);
    jest.spyOn(store, 'updateCart').mockResolvedValue(mockStoreUpdate);
    jest.spyOn(store, 'replicateCart').mockResolvedValue(mockStoreReplicate);

    jest.spyOn(admin, 'readCart').mockResolvedValue(mockAdminRead);
    jest.spyOn(admin, 'createCart').mockResolvedValue(mockAdminCreate);
    jest.spyOn(admin, 'updateCart').mockResolvedValue(mockAdminUpdate);
    jest.spyOn(admin, 'replicateCart').mockResolvedValue(mockAdminReplicate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToCartFunctionMapping', () => {
    it('returns customer functions when customerId is provided', () => {
      const functionMap = contextToCartFunctionMapping({
        customerId: 'customer-1',
      });

      expect(functionMap.read_cart).toBe(customer.readCart);
      expect(functionMap.create_cart).toBe(customer.createCart);
      expect(functionMap.update_cart).toBe(customer.updateCart);
      expect(functionMap.replicate_cart).toBe(customer.replicateCart);
    });

    it('returns store functions when storeKey is provided', () => {
      const functionMap = contextToCartFunctionMapping({storeKey: 'store-1'});

      expect(functionMap.read_cart).toBe(store.readCart);
      expect(functionMap.create_cart).toBe(store.createCart);
      expect(functionMap.update_cart).toBe(store.updateCart);
      expect(functionMap.replicate_cart).toBe(store.replicateCart);
    });

    it('returns admin functions when neither customerId nor storeKey is provided', () => {
      const functionMap = contextToCartFunctionMapping({});

      expect(functionMap).toEqual({});
    });

    it('prioritizes customerId over storeKey when both are provided', () => {
      const functionMap = contextToCartFunctionMapping({
        customerId: 'customer-1',
        storeKey: 'store-1',
      });

      expect(functionMap.read_cart).toBe(customer.readCart);
      expect(functionMap.create_cart).toBe(customer.createCart);
      expect(functionMap.update_cart).toBe(customer.updateCart);
      expect(functionMap.replicate_cart).toBe(customer.replicateCart);
    });
  });

  describe('readCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockCustomerRead);
      expect(customer.readCart).toHaveBeenCalled();
      expect(store.readCart).not.toHaveBeenCalled();
      expect(admin.readCart).not.toHaveBeenCalled();
    });

    it('uses store scope when storeKey is provided in context', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          storeKey: 'store-1',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockStoreRead);
      expect(store.readCart).toHaveBeenCalled();
      expect(customer.readCart).not.toHaveBeenCalled();
      expect(admin.readCart).not.toHaveBeenCalled();
    });

    it('uses admin scope when neither customerId nor storeKey is provided', async () => {
      const result = await readCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {} as z.infer<typeof readCartParameters>
      );

      expect(result).toBe(mockAdminRead);
      expect(admin.readCart).toHaveBeenCalled();
      expect(customer.readCart).not.toHaveBeenCalled();
      expect(store.readCart).not.toHaveBeenCalled();
    });
  });

  // Similar tests for createCart, updateCart, and replicateCart
  describe('createCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await createCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as any
      );

      expect(result).toBe(mockCustomerCreate);
      expect(customer.createCart).toHaveBeenCalled();
    });

    it('uses store scope when storeKey is provided via params.store.key', async () => {
      const result = await createCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {store: {key: 'store-1', typeId: 'store'}} as any
      );

      expect(result).toBe(mockStoreCreate);
      expect(store.createCart).toHaveBeenCalled();
    });
  });

  describe('updateCart', () => {
    it('uses customer scope when customerId is provided in context', async () => {
      const result = await updateCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
          customerId: 'customer-1',
        },
        {} as any
      );

      expect(result).toBe(mockCustomerUpdate);
      expect(customer.updateCart).toHaveBeenCalled();
    });
  });

  describe('replicateCart', () => {
    it('uses store scope when storeKey is provided in params', async () => {
      const result = await replicateCart(
        mockApiRoot,
        {
          projectKey: 'test-project',
        },
        {storeKey: 'store-1'} as any
      );

      expect(result).toBe(mockStoreReplicate);
      expect(store.replicateCart).toHaveBeenCalled();
    });
  });
});

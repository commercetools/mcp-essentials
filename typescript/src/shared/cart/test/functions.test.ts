import {readCart} from '../functions';
import {readCartParameters} from '../parameters';
import {z} from 'zod';

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

describe('Cart Functions with Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockResolvedValue({body: {}});
  });

  describe('readCart with context.cartId', () => {
    it('should prioritize context.cartId over params.id', async () => {
      const context = {
        projectKey: 'test-project',
        cartId: 'context-cart-id',
      };
      const params = {
        id: 'params-cart-id',
        customerId: 'customer-id',
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'params-cart-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('readCart with context.customerId but no context.cartId', () => {
    it('should use readCartByCustomerId when params.customerId is provided', async () => {
      const context = {
        projectKey: 'test-project',
        customerId: 'context-customer-id',
      };
      const params = {
        customerId: 'params-customer-id',
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="context-customer-id"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should add customerId to where clause when using queryCarts', async () => {
      const context = {
        projectKey: 'test-project',
        customerId: 'context-customer-id',
      };
      const params = {
        where: ['totalPrice > "100 USD"'],
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['totalPrice > "100 USD"', 'customerId="context-customer-id"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should always add context customerId to where clause, even if duplicated', async () => {
      const context = {
        projectKey: 'test-project',
        customerId: 'context-customer-id',
      };
      const params = {
        where: ['customerId="context-customer-id"', 'totalPrice > "100 USD"'],
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: [
            'customerId="context-customer-id"',
            'totalPrice > "100 USD"',
            'customerId="context-customer-id"',
          ],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should default to readCartByCustomerId if no specific params provided', async () => {
      const context = {
        projectKey: 'test-project',
        customerId: 'context-customer-id',
      };
      const params = {} as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="context-customer-id"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('readCart with no context values', () => {
    it('should use the original logic with params.id', async () => {
      const context = {
        projectKey: 'test-project',
      };
      const params = {
        id: 'cart-id',
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'cart-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should use the original logic with params.key', async () => {
      const context = {
        projectKey: 'test-project',
      };
      const params = {
        key: 'cart-key',
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'cart-key'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should use the original logic with params.customerId', async () => {
      const context = {
        projectKey: 'test-project',
      };
      const params = {
        customerId: 'customer-id',
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['customerId="customer-id"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should use the original logic with params.where', async () => {
      const context = {
        projectKey: 'test-project',
      };
      const params = {
        where: ['totalPrice > "100 USD"'],
      } as z.infer<typeof readCartParameters>;

      await readCart(mockApiRoot as any, context, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCarts).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['totalPrice > "100 USD"'],
          limit: 10,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });
});

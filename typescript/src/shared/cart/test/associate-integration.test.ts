import {readCart, createCart, updateCart, replicateCart} from '../functions';
import {
  readCartParameters,
  createCartParameters,
  updateCartParameters,
  replicateCartParameters,
} from '../parameters';
import {z} from 'zod';

// Mock associate functions
jest.mock('../as-associate.functions', () => ({
  readCart: jest.fn(),
  createCart: jest.fn(),
  updateCart: jest.fn(),
  replicateCart: jest.fn(),
}));

const mockApiRoot = {} as any;

describe('Associate Cart Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Context with customerId and businessUnitKey', () => {
    const associateContext = {
      projectKey: 'test-project',
      customerId: 'test-customer-id',
      businessUnitKey: 'test-business-unit',
    };

    it('should use associate functions for readCart', async () => {
      const associateFunctions = require('../as-associate.functions');
      const mockResult = {id: 'cart-id', version: 1};
      associateFunctions.readCart.mockResolvedValue(mockResult);

      const params = {id: 'cart-id'} as z.infer<typeof readCartParameters>;
      const result = await readCart(mockApiRoot, associateContext, params);

      expect(associateFunctions.readCart).toHaveBeenCalledWith(
        mockApiRoot,
        associateContext,
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should use associate functions for createCart', async () => {
      const associateFunctions = require('../as-associate.functions');
      const mockResult = {id: 'cart-id', version: 1};
      associateFunctions.createCart.mockResolvedValue(mockResult);

      const params = {currency: 'EUR'} as z.infer<typeof createCartParameters>;
      const result = await createCart(mockApiRoot, associateContext, params);

      expect(associateFunctions.createCart).toHaveBeenCalledWith(
        mockApiRoot,
        associateContext,
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should use associate functions for updateCart', async () => {
      const associateFunctions = require('../as-associate.functions');
      const mockResult = {id: 'cart-id', version: 2};
      associateFunctions.updateCart.mockResolvedValue(mockResult);

      const params = {
        id: 'cart-id',
        version: 1,
        actions: [
          {
            action: 'addLineItem',
            productId: 'product-id',
            variantId: 1,
            quantity: 1,
          },
        ],
      } as z.infer<typeof updateCartParameters>;
      const result = await updateCart(mockApiRoot, associateContext, params);

      expect(associateFunctions.updateCart).toHaveBeenCalledWith(
        mockApiRoot,
        associateContext,
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should use associate functions for replicateCart', async () => {
      const associateFunctions = require('../as-associate.functions');
      const mockResult = {id: 'new-cart-id', version: 1};
      associateFunctions.replicateCart.mockResolvedValue(mockResult);

      const params = {
        reference: {typeId: 'cart', id: 'source-cart-id'},
      } as z.infer<typeof replicateCartParameters>;
      const result = await replicateCart(mockApiRoot, associateContext, params);

      expect(associateFunctions.replicateCart).toHaveBeenCalledWith(
        mockApiRoot,
        associateContext,
        params
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('Context with only customerId (no businessUnitKey)', () => {
    const customerContext = {
      projectKey: 'test-project',
      customerId: 'test-customer-id',
    };

    it('should use customer functions, not associate functions', async () => {
      const associateFunctions = require('../as-associate.functions');
      const customerFunctions = require('../customer.functions');

      // Mock customer functions
      customerFunctions.readCart = jest.fn().mockResolvedValue({id: 'cart-id'});

      const params = {id: 'cart-id'} as z.infer<typeof readCartParameters>;
      await readCart(mockApiRoot, customerContext, params);

      expect(associateFunctions.readCart).not.toHaveBeenCalled();
      expect(customerFunctions.readCart).toHaveBeenCalledWith(
        mockApiRoot,
        customerContext,
        params
      );
    });
  });

  describe('Context with only businessUnitKey (no customerId)', () => {
    const businessUnitContext = {
      projectKey: 'test-project',
      businessUnitKey: 'test-business-unit',
    };

    it('should use admin functions, not associate functions', async () => {
      const associateFunctions = require('../as-associate.functions');
      const adminFunctions = require('../admin.functions');

      // Mock admin functions
      adminFunctions.readCart = jest.fn().mockResolvedValue({id: 'cart-id'});

      const params = {id: 'cart-id'} as z.infer<typeof readCartParameters>;
      await readCart(mockApiRoot, businessUnitContext, params);

      expect(associateFunctions.readCart).not.toHaveBeenCalled();
      expect(adminFunctions.readCart).toHaveBeenCalledWith(
        mockApiRoot,
        businessUnitContext,
        params
      );
    });
  });
});

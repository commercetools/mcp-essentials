import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {
  readCart,
  createCart,
  updateCart,
  replicateCart,
} from '../as-associate.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Associate Cart Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
      businessUnitKey: 'bu-key',
    };
  });

  describe('readCart', () => {
    it('should read cart by ID successfully', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      (baseFunctions.readAssociateCartById as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {id: 'cart-123'};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.readAssociateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        'cart-123',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should read cart by key successfully', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 1};
      (baseFunctions.readAssociateCartByKey as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {key: 'cart-key'};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.readAssociateCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        'cart-key',
        undefined
      );
      expect(result).toEqual(mockCart);
    });

    it('should query carts when no ID or key provided', async () => {
      const mockCarts = {results: [], total: 0};
      (baseFunctions.queryAssociateCarts as jest.Mock).mockResolvedValue(
        mockCarts
      );

      const params = {limit: 10};
      const result = await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryAssociateCarts).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        undefined,
        10,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockCarts);
    });

    it('should pass expand parameter correctly', async () => {
      const mockCart = {id: 'cart-123', version: 1};
      (baseFunctions.readAssociateCartById as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {id: 'cart-123', expand: ['lineItems[*].productSlug']};
      await readCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.readAssociateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        'cart-123',
        ['lineItems[*].productSlug']
      );
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'bu-key',
      };

      await expect(
        readCart(mockApiRoot, contextWithoutCustomer as any, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, contextWithoutCustomer as any, {
          id: 'cart-123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read associate cart'
        );
      }
    });

    it('should throw error when businessUnitKey is missing', async () => {
      const contextWithoutBU = {
        projectKey: 'test-project',
        customerId: 'customer-123',
      };

      await expect(
        readCart(mockApiRoot, contextWithoutBU as any, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, contextWithoutBU as any, {id: 'cart-123'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read associate cart'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.readAssociateCartById as jest.Mock).mockRejectedValue(
        baseError
      );

      await expect(
        readCart(mockApiRoot, mockContext, {id: 'cart-123'})
      ).rejects.toThrow(SDKError);

      try {
        await readCart(mockApiRoot, mockContext, {id: 'cart-123'});
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read associate cart'
        );
      }
    });
  });

  describe('createCart', () => {
    it('should create cart successfully', async () => {
      const mockCart = {id: 'new-cart-123', version: 1};
      (baseFunctions.createAssociateCart as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {
        currency: 'USD',
        lineItems: [],
      };
      const result = await createCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.createAssociateCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        {
          currency: 'USD',
          lineItems: [],
          customerId: 'customer-123',
          businessUnit: {
            typeId: 'business-unit',
            key: 'bu-key',
          },
        }
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'bu-key',
      };

      await expect(
        createCart(mockApiRoot, contextWithoutCustomer as any, {
          currency: 'USD',
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when businessUnitKey is missing', async () => {
      const contextWithoutBU = {
        projectKey: 'test-project',
        customerId: 'customer-123',
      };

      await expect(
        createCart(mockApiRoot, contextWithoutBU as any, {currency: 'USD'})
      ).rejects.toThrow(SDKError);
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.createAssociateCart as jest.Mock).mockRejectedValue(
        baseError
      );

      await expect(
        createCart(mockApiRoot, mockContext, {currency: 'USD'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateCart', () => {
    it('should update cart by ID successfully', async () => {
      const mockCart = {id: 'cart-123', version: 2};
      (baseFunctions.updateAssociateCartById as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {
        id: 'cart-123',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-123', variantId: 1},
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateAssociateCartById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        'cart-123',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}]
      );
      expect(result).toEqual(mockCart);
    });

    it('should update cart by key successfully', async () => {
      const mockCart = {id: 'cart-123', key: 'cart-key', version: 2};
      (baseFunctions.updateAssociateCartByKey as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {
        key: 'cart-key',
        version: 1,
        actions: [
          {action: 'addLineItem', productId: 'product-123', variantId: 1},
        ],
      };
      const result = await updateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateAssociateCartByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        'cart-key',
        [{action: 'addLineItem', productId: 'product-123', variantId: 1}]
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'bu-key',
      };

      await expect(
        updateCart(mockApiRoot, contextWithoutCustomer as any, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when businessUnitKey is missing', async () => {
      const contextWithoutBU = {
        projectKey: 'test-project',
        customerId: 'customer-123',
      };

      await expect(
        updateCart(mockApiRoot, contextWithoutBU as any, {
          id: 'cart-123',
          version: 1,
          actions: [
            {action: 'addLineItem', productId: 'product-123', variantId: 1},
          ],
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when no actions provided', async () => {
      await expect(
        updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow(SDKError);

      try {
        await updateCart(mockApiRoot, mockContext, {
          id: 'cart-123',
          version: 1,
          actions: [],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update associate cart'
        );
      }
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
          'Failed to update associate cart'
        );
      }
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.updateAssociateCartById as jest.Mock).mockRejectedValue(
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

  describe('replicateCart', () => {
    it('should replicate cart successfully', async () => {
      const mockCart = {id: 'new-cart-123', version: 1};
      (baseFunctions.replicateAssociateCart as jest.Mock).mockResolvedValue(
        mockCart
      );

      const params = {
        reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        key: 'new-cart-key',
      };
      const result = await replicateCart(mockApiRoot, mockContext, params);

      expect(baseFunctions.replicateAssociateCart).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'customer-123',
        'bu-key',
        {typeId: 'cart', id: 'source-cart-123'},
        'new-cart-key'
      );
      expect(result).toEqual(mockCart);
    });

    it('should throw error when customerId is missing', async () => {
      const contextWithoutCustomer = {
        projectKey: 'test-project',
        businessUnitKey: 'bu-key',
      };

      await expect(
        replicateCart(mockApiRoot, contextWithoutCustomer as any, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);
    });

    it('should throw error when businessUnitKey is missing', async () => {
      const contextWithoutBU = {
        projectKey: 'test-project',
        customerId: 'customer-123',
      };

      await expect(
        replicateCart(mockApiRoot, contextWithoutBU as any, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);
    });

    it('should handle base function errors', async () => {
      const baseError = new Error('Base function error');
      (baseFunctions.replicateAssociateCart as jest.Mock).mockRejectedValue(
        baseError
      );

      await expect(
        replicateCart(mockApiRoot, mockContext, {
          reference: {typeId: 'cart' as const, id: 'source-cart-123'},
        })
      ).rejects.toThrow(SDKError);
    });
  });
});

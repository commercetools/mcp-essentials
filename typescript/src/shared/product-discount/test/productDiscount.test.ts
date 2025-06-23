import {
  readProductDiscount,
  createProductDiscount,
  updateProductDiscount,
} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';

// Create a more accurate type for the mock that includes the properties we're using
// This avoids TypeScript errors while keeping the mocking functionality
interface MockApiRoot extends ApiRoot {
  withProjectKey: jest.Mock;
  productDiscounts: jest.Mock;
  withId: jest.Mock;
  withKey: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
}

// Mock API root with the extended type
const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnThis(),
  productDiscounts: jest.fn().mockReturnThis(),
  withId: jest.fn().mockReturnThis(),
  withKey: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  execute: jest.fn(),
} as unknown as MockApiRoot;

const mockContext = {projectKey: 'test-project'};

describe('Product Discount Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readProductDiscount', () => {
    it('should fetch a product discount by ID', async () => {
      const mockProductDiscount = {
        body: {id: 'test-id', name: {en: 'Test Discount'}},
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscount);

      const result = await readProductDiscount(mockApiRoot, mockContext, {
        id: 'test-id',
      });

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscount.body);
    });

    it('should fetch a product discount by key', async () => {
      const mockProductDiscount = {
        body: {id: 'test-id', key: 'test-key', name: {en: 'Test Discount'}},
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscount);

      const result = await readProductDiscount(mockApiRoot, mockContext, {
        key: 'test-key',
      });

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscount.body);
    });

    it('should fetch a list of product discounts', async () => {
      const mockProductDiscounts = {
        body: {
          results: [
            {id: 'test-id-1', name: {en: 'Test Discount 1'}},
            {id: 'test-id-2', name: {en: 'Test Discount 2'}},
          ],
        },
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscounts);

      const result = await readProductDiscount(mockApiRoot, mockContext, {
        limit: 2,
        where: ['name(en="Test")'],
      });

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          limit: 2,
          where: ['name(en="Test")'],
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscounts.body);
    });

    it('should handle errors', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readProductDiscount(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow('Failed to read product discount');
    });
  });

  describe('createProductDiscount', () => {
    it('should create a product discount', async () => {
      const mockProductDiscount = {
        body: {
          id: 'new-id',
          name: {en: 'New Discount'},
        },
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscount);

      const params = {
        name: {en: 'New Discount'},
        value: {
          type: 'absolute' as const,
          money: [
            {
              type: 'centPrecision' as const,
              currencyCode: 'EUR',
              centAmount: 100,
            },
          ],
        },
        predicate: 'product.id = "123"',
        sortOrder: '0.5',
      };

      const result = await createProductDiscount(
        mockApiRoot,
        mockContext,
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscount.body);
    });

    it('should handle errors', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('API error'));

      const params = {
        name: {en: 'New Discount'},
        value: {
          type: 'absolute' as const,
          money: [
            {
              type: 'centPrecision' as const,
              currencyCode: 'EUR',
              centAmount: 100,
            },
          ],
        },
        predicate: 'product.id = "123"',
        sortOrder: '0.5',
      };

      await expect(
        createProductDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to create product discount');
    });
  });

  describe('updateProductDiscount', () => {
    it('should update a product discount by ID', async () => {
      const mockProductDiscount = {
        body: {
          id: 'test-id',
          version: 2,
          name: {en: 'Updated Discount'},
        },
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscount);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
        ],
      };

      const result = await updateProductDiscount(
        mockApiRoot,
        mockContext,
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscount.body);
    });

    it('should update a product discount by key', async () => {
      const mockProductDiscount = {
        body: {
          id: 'test-id',
          key: 'test-key',
          version: 2,
          name: {en: 'Updated Discount'},
        },
      };
      mockApiRoot.execute.mockResolvedValueOnce(mockProductDiscount);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
        ],
      };

      const result = await updateProductDiscount(
        mockApiRoot,
        mockContext,
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productDiscounts).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: params.version,
          actions: params.actions,
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockProductDiscount.body);
    });

    it('should require either id or key', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
        ],
      };

      // We expect exactly one assertion to be called
      expect.assertions(1);

      try {
        await updateProductDiscount(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle errors', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('API error'));

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Discount'},
          },
        ],
      };

      await expect(
        updateProductDiscount(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to update product discount');
    });
  });
});

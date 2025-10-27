import z from 'zod';
import {
  readProductTailoringById,
  readProductTailoringByKey,
  readProductTailoringByProductId,
  readProductTailoringByProductKey,
  queryProductTailoring,
  queryProductTailoringInStore,
  createProductTailoring,
  updateProductTailoringById,
  updateProductTailoringByKey,
} from '../base.functions';
import {createProductTailoringParameters} from '../parameters';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockWithId = jest.fn();
const mockWithKey = jest.fn();
const mockProductTailoring = jest.fn();
const mockWithProductId = jest.fn();
const mockWithProductKey = jest.fn();
const mockProducts = jest.fn();
const mockInStoreKeyWithStoreKeyValue = jest.fn();
const mockWithProjectKey = jest.fn();

const projectKey = 'test-project';

// Create mockApiRoot object
let mockApiRoot: any;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Set up mockExecute to return a proper response with body
  mockExecute.mockResolvedValue({
    body: {id: 'test-id', name: {en: 'Test Product'}},
  });

  // Set up the mock chain - each mock returns the next in the chain
  mockGet.mockReturnValue({execute: mockExecute});
  mockPost.mockReturnValue({execute: mockExecute});
  mockWithId.mockReturnValue({
    get: mockGet,
    post: mockPost,
  });
  mockWithKey.mockReturnValue({
    get: mockGet,
    post: mockPost,
  });
  mockProductTailoring.mockReturnValue({
    get: mockGet,
    post: mockPost,
    withId: mockWithId,
    withKey: mockWithKey,
  });
  mockWithProductId.mockReturnValue({
    productTailoring: mockProductTailoring,
  });
  mockWithProductKey.mockReturnValue({
    productTailoring: mockProductTailoring,
  });
  mockProducts.mockReturnValue({
    withProductId: mockWithProductId,
    withProductKey: mockWithProductKey,
  });
  mockInStoreKeyWithStoreKeyValue.mockReturnValue({
    productTailoring: mockProductTailoring,
    products: mockProducts,
  });
  mockWithProjectKey.mockReturnValue({
    productTailoring: mockProductTailoring,
    inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
    products: mockProducts,
  });

  // Create the mockApiRoot object
  mockApiRoot = {
    withProjectKey: mockWithProjectKey,
  };
});

describe('Product Tailoring Base Functions', () => {
  describe('readProductTailoringById', () => {
    it('should read product tailoring by ID', async () => {
      const params = {
        id: 'test-id',
        expand: ['product', 'store'],
      };

      await readProductTailoringById(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['product', 'store'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when ID is not provided', async () => {
      const params = {};

      await expect(
        readProductTailoringById(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Product tailoring ID is required');
    });

    it('should handle API errors', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      const params = {id: 'test-id'};

      await expect(
        readProductTailoringById(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by ID');
    });
  });

  describe('readProductTailoringByKey', () => {
    it('should read product tailoring by key', async () => {
      const params = {
        key: 'test-key',
        expand: ['product'],
      };

      await readProductTailoringByKey(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['product'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when key is not provided', async () => {
      const params = {};

      await expect(
        readProductTailoringByKey(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by key');
    });
  });

  describe('readProductTailoringByProductId', () => {
    it('should read product tailoring by product ID in store', async () => {
      const params = {
        storeKey: 'test-store',
        productId: 'test-product-id',
        expand: ['product'],
      };

      await readProductTailoringByProductId(
        mockApiRoot as any,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockProducts).toHaveBeenCalled();
      expect(mockWithProductId).toHaveBeenCalledWith({
        productID: 'test-product-id',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['product'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when storeKey is not provided', async () => {
      const params = {productId: 'test-product-id'};

      await expect(
        readProductTailoringByProductId(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by product ID');
    });

    it('should throw error when productId is not provided', async () => {
      const params = {storeKey: 'test-store'};

      await expect(
        readProductTailoringByProductId(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by product ID');
    });
  });

  describe('readProductTailoringByProductKey', () => {
    it('should read product tailoring by product key in store', async () => {
      const params = {
        storeKey: 'test-store',
        productKey: 'test-product-key',
        expand: ['product'],
      };

      await readProductTailoringByProductKey(
        mockApiRoot as any,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockProducts).toHaveBeenCalled();
      expect(mockWithProductKey).toHaveBeenCalledWith({
        productKey: 'test-product-key',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['product'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when storeKey is not provided', async () => {
      const params = {productKey: 'test-product-key'};

      await expect(
        readProductTailoringByProductKey(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by product key');
    });

    it('should throw error when productKey is not provided', async () => {
      const params = {storeKey: 'test-store'};

      await expect(
        readProductTailoringByProductKey(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error reading product tailoring by product key');
    });
  });

  describe('queryProductTailoring', () => {
    it('should query product tailoring entries', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['product(id="product-123")'],
        expand: ['product', 'store'],
      };

      await queryProductTailoring(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['product(id="product-123")'],
          expand: ['product', 'store'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('queryProductTailoringInStore', () => {
    it('should query product tailoring entries in store', async () => {
      const params = {
        storeKey: 'test-store',
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['product(id="product-123")'],
        expand: ['product'],
      };

      await queryProductTailoringInStore(
        mockApiRoot as any,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['product(id="product-123")'],
          expand: ['product'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when storeKey is not provided', async () => {
      const params = {limit: 10};

      await expect(
        queryProductTailoringInStore(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error querying product tailoring in store');
    });
  });

  describe('createProductTailoring', () => {
    it('should create product tailoring with productId and storeKey', async () => {
      const params = {
        productId: 'test-product-id',
        storeKey: 'test-store',
        key: 'test-key',
        name: {en: 'Test Product'},
        published: true,
      };

      const result = await createProductTailoring(
        mockApiRoot as any,
        projectKey,
        params
      );

      expect(result).toEqual({id: 'test-id', name: {en: 'Test Product'}});
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          product: {typeId: 'product', id: 'test-product-id'},
          store: {typeId: 'store', key: 'test-store'},
          key: 'test-key',
          name: {en: 'Test Product'},
          published: true,
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create product tailoring with productKey and store', async () => {
      const params = {
        productKey: 'test-product-key',
        store: {typeId: 'store' as const, key: 'test-store'},
        key: 'test-key',
        name: {en: 'Test Product'},
        published: true,
      };

      await createProductTailoring(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          product: {typeId: 'product', key: 'test-product-key'},
          store: {typeId: 'store', key: 'test-store'},
          key: 'test-key',
          name: {en: 'Test Product'},
          published: true,
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should create product tailoring with store context', async () => {
      const params = {
        productId: 'test-product-id',
        store: {typeId: 'store', key: 'test-store'},
        key: 'test-key',
        name: {en: 'Test Product'},
        published: true,
      };

      const result = await createProductTailoring(
        mockApiRoot as any,
        projectKey,
        params as z.infer<typeof createProductTailoringParameters>
      );

      expect(result).toEqual({id: 'test-id', name: {en: 'Test Product'}});
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          product: {typeId: 'product', id: 'test-product-id'},
          key: 'test-key',
          name: {en: 'Test Product'},
          published: true,
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw error when neither productId nor productKey is provided', async () => {
      const params = {
        key: 'test-key',
        name: {en: 'Test Product'},
      };

      await expect(
        createProductTailoring(mockApiRoot as any, projectKey, params as any)
      ).rejects.toThrow(/Error creating product tailoring/);
    });
  });

  describe('updateProductTailoringById', () => {
    it('should update product tailoring by ID', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'setName' as const,
            name: {en: 'Updated Product Name'},
          },
        ],
      };

      await updateProductTailoringById(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setName',
              name: {en: 'Updated Product Name'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should filter out delete actions', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'setName' as const,
            name: {en: 'Updated Product Name'},
          },
          {
            action: 'delete' as const,
          },
        ],
      };

      await updateProductTailoringById(mockApiRoot as any, projectKey, params);

      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setName',
              name: {en: 'Updated Product Name'},
            },
          ],
        },
      });
    });

    it('should throw error when ID is not provided', async () => {
      const params = {
        version: 1,
        actions: [],
      };

      await expect(
        updateProductTailoringById(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error updating product tailoring by ID');
    });
  });

  describe('updateProductTailoringByKey', () => {
    it('should update product tailoring by key', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'setDescription' as const,
            description: {en: 'Updated Description'},
          },
        ],
      };

      await updateProductTailoringByKey(mockApiRoot as any, projectKey, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockProductTailoring).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setDescription',
              description: {en: 'Updated Description'},
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));
      const params = {
        key: 'test-key',
        version: 1,
        actions: [],
      };

      await expect(
        updateProductTailoringByKey(mockApiRoot as any, projectKey, params)
      ).rejects.toThrow('Error updating product tailoring by key');
    });
  });
});

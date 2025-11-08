// Mock the base functions
jest.mock('../base.functions', () => ({
  readProductTailoringById: jest.fn(),
  readProductTailoringByKey: jest.fn(),
  readProductTailoringByProductId: jest.fn(),
  readProductTailoringByProductKey: jest.fn(),
  queryProductTailoringInStore: jest.fn(),
  createProductTailoring: jest.fn(),
  updateProductTailoringById: jest.fn(),
  updateProductTailoringByKey: jest.fn(),
}));

import {
  readProductTailoringById,
  readProductTailoringByKey,
  readProductTailoringByProductId,
  readProductTailoringByProductKey,
  queryProductTailoringInStore,
  createProductTailoring as baseCreateProductTailoring,
  updateProductTailoringById,
  updateProductTailoringByKey,
} from '../base.functions';

import {
  readProductTailoring,
  createProductTailoring,
  updateProductTailoring,
} from '../store.functions';

const mockApiRoot = {} as any;
const mockContext = {
  projectKey: 'test-project',
  storeKey: 'test-store',
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Store Product Tailoring Functions', () => {
  describe('readProductTailoring', () => {
    it('should read by ID when id is provided', async () => {
      const mockResult = {id: 'test-id', name: {en: 'Test Product'}};
      (readProductTailoringById as jest.Mock).mockResolvedValue(mockResult);

      const params = {id: 'test-id', expand: ['product']};
      const result = await readProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(readProductTailoringById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should read by key when key is provided', async () => {
      const mockResult = {key: 'test-key', name: {en: 'Test Product'}};
      (readProductTailoringByKey as jest.Mock).mockResolvedValue(mockResult);

      const params = {key: 'test-key', expand: ['product']};
      const result = await readProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(readProductTailoringByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should read by product ID when productId is provided', async () => {
      const mockResult = {
        productId: 'test-product',
        name: {en: 'Test Product'},
      };
      (readProductTailoringByProductId as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {productId: 'test-product'};
      const result = await readProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(readProductTailoringByProductId).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {productId: 'test-product'}
      );
      expect(result).toEqual(mockResult);
    });

    it('should read by product key when productKey is provided', async () => {
      const mockResult = {
        productKey: 'test-product',
        name: {en: 'Test Product'},
      };
      (readProductTailoringByProductKey as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {productKey: 'test-product'};
      const result = await readProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(readProductTailoringByProductKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {productKey: 'test-product'}
      );
      expect(result).toEqual(mockResult);
    });

    it('should query in store when no specific identifier is provided', async () => {
      const mockResult = {results: [{id: 'test-1'}, {id: 'test-2'}]};
      (queryProductTailoringInStore as jest.Mock).mockResolvedValue(mockResult);

      const params = {limit: 10, offset: 0};
      const result = await readProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(queryProductTailoringInStore).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {limit: 10, offset: 0}
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors properly', async () => {
      const error = new Error('Base function error');
      (readProductTailoringById as jest.Mock).mockRejectedValue(error);

      const params = {id: 'test-id'};

      await expect(
        readProductTailoring(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to read product tailoring');
    });
  });

  describe('createProductTailoring', () => {
    it('should create product tailoring entry successfully', async () => {
      const mockResult = {id: 'new-id', name: {en: 'New Product'}};
      (baseCreateProductTailoring as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        productId: 'test-product',
        key: 'test-key',
        name: {en: 'New Product'},
        published: true,
      };
      const result = await createProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(baseCreateProductTailoring).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      (baseCreateProductTailoring as jest.Mock).mockRejectedValue(error);

      const params = {
        productId: 'test-product',
        key: 'test-key',
        name: {en: 'New Product'},
      };

      await expect(
        createProductTailoring(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to create product tailoring');
    });
  });

  describe('updateProductTailoring', () => {
    it('should update by ID when id is provided', async () => {
      const mockResult = {id: 'test-id', version: 2};
      (updateProductTailoringById as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'setName' as const, name: {en: 'Updated'}}],
      };
      const result = await updateProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(updateProductTailoringById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should update by key when key is provided', async () => {
      const mockResult = {key: 'test-key', version: 2};
      (updateProductTailoringByKey as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setName' as const, name: {en: 'Updated'}}],
      };
      const result = await updateProductTailoring(
        mockApiRoot,
        mockContext,
        params
      );

      expect(updateProductTailoringByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [{action: 'setName' as const, name: {en: 'Updated'}}],
      };

      await expect(
        updateProductTailoring(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either ID, key, or product ID/key must be provided to update product tailoring'
      );
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      (updateProductTailoringById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'setName' as const, name: {en: 'Updated'}}],
      };

      await expect(
        updateProductTailoring(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to update product tailoring');
    });
  });
});

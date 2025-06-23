import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {readCategory} from '../customer.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Category Customer Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: CommercetoolsFuncContext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApiRoot = {} as ApiRoot;
    mockContext = {
      projectKey: 'test-project',
    };
  });

  describe('readCategory', () => {
    it('should read category by ID', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 1,
        name: {en: 'Test Category'},
      };
      (baseFunctions.readCategoryById as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        id: 'category-123',
        expand: ['parent'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-123',
        ['parent']
      );
      expect(result).toEqual(mockCategory);
    });

    it('should read category by ID without expand', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 1,
        name: {en: 'Test Category'},
      };
      (baseFunctions.readCategoryById as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        id: 'category-123',
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-123',
        undefined
      );
      expect(result).toEqual(mockCategory);
    });

    it('should read category by key', async () => {
      const mockCategory = {
        id: 'category-123',
        key: 'category-key',
        version: 1,
        name: {en: 'Test Category'},
      };
      (baseFunctions.readCategoryByKey as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        key: 'category-key',
        expand: ['parent', 'children'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCategoryByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-key',
        ['parent', 'children']
      );
      expect(result).toEqual(mockCategory);
    });

    it('should read category by key without expand', async () => {
      const mockCategory = {
        id: 'category-123',
        key: 'category-key',
        version: 1,
        name: {en: 'Test Category'},
      };
      (baseFunctions.readCategoryByKey as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        key: 'category-key',
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.readCategoryByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-key',
        undefined
      );
      expect(result).toEqual(mockCategory);
    });

    it('should query categories with all parameters', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {
        limit: 20,
        offset: 10,
        sort: ['name.en asc'],
        where: ['parent is not defined'],
        expand: ['parent'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        20,
        10,
        ['name.en asc'],
        ['parent is not defined'],
        ['parent']
      );
      expect(result).toEqual(mockCategories);
    });

    it('should query categories with minimal parameters', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {};

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockCategories);
    });

    it('should query categories with partial parameters', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {
        limit: 50,
        where: ['name(en="Electronics")'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        50,
        undefined,
        undefined,
        ['name(en="Electronics")'],
        undefined
      );
      expect(result).toEqual(mockCategories);
    });

    it('should query categories with only offset', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {
        offset: 25,
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        25,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockCategories);
    });

    it('should query categories with sorting only', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {
        sort: ['orderHint asc', 'name.en asc'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        ['orderHint asc', 'name.en asc'],
        undefined,
        undefined
      );
      expect(result).toEqual(mockCategories);
    });

    it('should query categories with expand only', async () => {
      const mockCategories = {results: [], total: 0};
      (baseFunctions.queryCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const params = {
        expand: ['parent', 'ancestors'],
      };

      const result = await readCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.queryCategories).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        ['parent', 'ancestors']
      );
      expect(result).toEqual(mockCategories);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.readCategoryById as jest.Mock).mockRejectedValue(error);

      const params = {id: 'category-123'};

      await expect(
        readCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read category'
        );
      }
    });

    it('should handle errors during key lookup', async () => {
      const error = new Error('Category not found');
      (baseFunctions.readCategoryByKey as jest.Mock).mockRejectedValue(error);

      const params = {key: 'non-existent-category'};

      await expect(
        readCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read category'
        );
      }
    });

    it('should handle errors during query', async () => {
      const error = new Error('Query failed');
      (baseFunctions.queryCategories as jest.Mock).mockRejectedValue(error);

      const params = {where: ['invalid query']};

      await expect(
        readCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await readCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to read category'
        );
      }
    });
  });
});

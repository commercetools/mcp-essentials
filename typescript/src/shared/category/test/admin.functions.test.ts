import {ApiRoot} from '@commercetools/platform-sdk';
import {readCategory, createCategory, updateCategory} from '../admin.functions';
import * as baseFunctions from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Category Admin Functions', () => {
  let mockApiRoot: ApiRoot;
  let mockContext: {projectKey: string};

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
          'Failed to read category: API error'
        );
      }
    });
  });

  describe('createCategory', () => {
    it('should create category with minimal parameters', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 1,
        name: {en: 'New Category'},
      };
      (baseFunctions.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        name: {en: 'New Category'},
        slug: {en: 'new-category'},
      };

      const result = await createCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCategory).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          name: {en: 'New Category'},
          slug: {en: 'new-category'},
        }
      );
      expect(result).toEqual(mockCategory);
    });

    it('should create category with all optional parameters', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 1,
        name: {en: 'New Category'},
      };
      (baseFunctions.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        key: 'category-key',
        name: {en: 'New Category', de: 'Neue Kategorie'},
        slug: {en: 'new-category', de: 'neue-kategorie'},
        description: {en: 'Category description'},
        parent: {typeId: 'category' as const, id: 'parent-category-123'},
        orderHint: '0.1',
        externalId: 'ext-123',
        metaTitle: {en: 'Meta Title'},
        metaDescription: {en: 'Meta Description'},
        metaKeywords: {en: 'meta, keywords'},
        custom: {
          type: {typeId: 'type' as const, id: 'category-custom-type-id'},
          fields: {customField: 'value'},
        },
        assets: [],
      };

      const result = await createCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCategory).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        params
      );
      expect(result).toEqual(mockCategory);
    });

    it('should create category with parent reference', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 1,
        name: {en: 'Child Category'},
      };
      (baseFunctions.createCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        name: {en: 'Child Category'},
        slug: {en: 'child-category'},
        parent: {typeId: 'category' as const, id: 'parent-category-id'},
      };

      const result = await createCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.createCategory).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        {
          name: {en: 'Child Category'},
          slug: {en: 'child-category'},
          parent: {typeId: 'category', id: 'parent-category-id'},
        }
      );
      expect(result).toEqual(mockCategory);
    });

    it('should handle errors and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.createCategory as jest.Mock).mockRejectedValue(error);

      const params = {
        name: {en: 'New Category'},
        slug: {en: 'new-category'},
      };

      await expect(
        createCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await createCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to create category: API error'
        );
      }
    });
  });

  describe('updateCategory', () => {
    it('should update category by ID', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 2,
        name: {en: 'Updated Category'},
      };
      (baseFunctions.updateCategoryById as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        id: 'category-123',
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Category'}},
        ],
      };

      const result = await updateCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-123',
        1,
        [{action: 'changeName', name: {en: 'Updated Category'}}]
      );
      expect(result).toEqual(mockCategory);
    });

    it('should update category by key', async () => {
      const mockCategory = {
        id: 'category-123',
        key: 'category-key',
        version: 2,
        name: {en: 'Updated Category'},
      };
      (baseFunctions.updateCategoryByKey as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        key: 'category-key',
        version: 1,
        actions: [
          {action: 'changeSlug' as const, slug: {en: 'updated-category'}},
        ],
      };

      const result = await updateCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCategoryByKey).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-key',
        1,
        [{action: 'changeSlug', slug: {en: 'updated-category'}}]
      );
      expect(result).toEqual(mockCategory);
    });

    it('should update category with multiple actions', async () => {
      const mockCategory = {
        id: 'category-123',
        version: 2,
        name: {en: 'Updated Category'},
      };
      (baseFunctions.updateCategoryById as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const params = {
        id: 'category-123',
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Category'}},
          {
            action: 'setDescription' as const,
            description: {en: 'Updated description'},
          },
          {action: 'changeOrderHint' as const, orderHint: '0.2'},
        ],
      };

      const result = await updateCategory(mockApiRoot, mockContext, params);

      expect(baseFunctions.updateCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'category-123',
        1,
        [
          {action: 'changeName', name: {en: 'Updated Category'}},
          {action: 'setDescription', description: {en: 'Updated description'}},
          {action: 'changeOrderHint', orderHint: '0.2'},
        ]
      );
      expect(result).toEqual(mockCategory);
    });

    it('should throw error when neither ID nor key provided', async () => {
      const params = {
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Category'}},
        ],
      } as any; // Using type assertion to test error condition

      await expect(
        updateCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateCategory(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update category: Either id or key must be provided to update a category'
        );
      }
    });

    it('should handle errors during update by ID and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.updateCategoryById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'category-123',
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Category'}},
        ],
      };

      await expect(
        updateCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update category: API error'
        );
      }
    });

    it('should handle errors during update by key and throw SDKError', async () => {
      const error = new Error('API error');
      (baseFunctions.updateCategoryByKey as jest.Mock).mockRejectedValue(error);

      const params = {
        key: 'category-key',
        version: 1,
        actions: [
          {action: 'changeName' as const, name: {en: 'Updated Category'}},
        ],
      };

      await expect(
        updateCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);

      try {
        await updateCategory(mockApiRoot, mockContext, params);
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SDKError);
        expect((thrownError as SDKError).message).toBe(
          'Failed to update category: API error'
        );
      }
    });
  });
});

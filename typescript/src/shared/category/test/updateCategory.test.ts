import {updateCategory} from '../functions';
import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mocking admin functions
jest.mock('../admin.functions');
jest.mock('../base.functions');

describe('updateCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call admin.updateCategory', async () => {
    const mockApiRoot = {};
    const mockContext = {projectKey: 'test-project'};
    const mockParams = {
      id: 'category-id',
      version: 1,
      actions: [{action: 'changeName', name: {en: 'Updated Category'}}],
    };
    const mockResult = {
      id: 'category-id',
      version: 2,
      name: {en: 'Updated Category'},
    };

    // Setup the mock implementation
    (admin.updateCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await updateCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(admin.updateCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
  });

  it('should call admin.updateCategory even with customer context', async () => {
    const mockApiRoot = {};
    const mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123', // Note: this should not change behavior
    };
    const mockParams = {
      key: 'category-key',
      version: 1,
      actions: [{action: 'changeName', name: {en: 'Updated Category'}}],
    };
    const mockResult = {
      id: 'category-id',
      key: 'category-key',
      version: 2,
      name: {en: 'Updated Category'},
    };

    // Setup the mock implementation
    (admin.updateCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await updateCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(admin.updateCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
  });

  it('should update a category by ID successfully', async () => {
    const mockApiRoot = {};
    const mockCategory = {
      id: 'test-id',
      version: 1,
      name: {en: 'Test Category'},
    };
    const mockUpdateResult = {
      id: 'test-id',
      version: 2,
      name: {en: 'Updated Category'},
    };

    // Mock base.readCategoryById to return the category
    (base.readCategoryById as jest.Mock).mockResolvedValueOnce(mockCategory);

    // Mock base.updateCategoryById to return the updated category
    (base.updateCategoryById as jest.Mock).mockResolvedValueOnce(
      mockUpdateResult
    );

    // Mock admin.updateCategory to call the base function
    (admin.updateCategory as jest.Mock).mockImplementationOnce(
      (_apiRoot, _context, params) => {
        if (params.id) {
          return mockUpdateResult;
        }
      }
    );

    const updateRequest = {
      id: 'test-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    const result = await updateCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      updateRequest
    );

    expect(result).toEqual({
      id: 'test-id',
      version: 2,
      name: {en: 'Updated Category'},
    });
  });

  it('should update a category by key successfully', async () => {
    const mockApiRoot = {};
    const mockCategory = {
      id: 'test-id',
      key: 'test-key',
      version: 1,
      name: {en: 'Test Category'},
    };
    const mockUpdateResult = {
      id: 'test-id',
      key: 'test-key',
      version: 2,
      name: {en: 'Updated Category'},
    };

    // Mock base.readCategoryByKey to return the category
    (base.readCategoryByKey as jest.Mock).mockResolvedValueOnce(mockCategory);

    // Mock base.updateCategoryByKey to return the updated category
    (base.updateCategoryByKey as jest.Mock).mockResolvedValueOnce(
      mockUpdateResult
    );

    // Mock admin.updateCategory to call the base function
    (admin.updateCategory as jest.Mock).mockImplementationOnce(
      (_apiRoot, _context, params) => {
        if (params.key) {
          return mockUpdateResult;
        }
      }
    );

    const updateRequest = {
      key: 'test-key',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    const result = await updateCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      updateRequest
    );

    expect(result).toEqual({
      id: 'test-id',
      key: 'test-key',
      version: 2,
      name: {en: 'Updated Category'},
    });
  });

  it('should throw error when neither id nor key is provided', async () => {
    const mockApiRoot = {};

    // Mock admin.updateCategory to throw an error
    (admin.updateCategory as jest.Mock).mockRejectedValueOnce(
      new SDKError(
        'Failed to update category',
        new Error('Either id or key must be provided to update a category')
      )
    );

    const updateRequest = {
      version: 1,
      actions: [{action: 'changeName', name: {en: 'New Name'}}],
    };

    await expect(
      updateCategory(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        updateRequest
      )
    ).rejects.toThrow('Failed to update category');
  });

  it('should handle API errors properly', async () => {
    const mockApiRoot = {};

    // Mock admin.updateCategory to throw an error
    (admin.updateCategory as jest.Mock).mockRejectedValueOnce(
      new SDKError('Failed to update category', new Error('API Error'))
    );

    const updateRequest = {
      id: 'test-id',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Category'},
        },
      ],
    };

    await expect(
      updateCategory(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        updateRequest
      )
    ).rejects.toThrow('Failed to update category');
  });
});

import {readCategory} from '../functions';
import * as admin from '../admin.functions';
import * as customer from '../customer.functions';
import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mocking both customer and admin functions
jest.mock('../admin.functions');
jest.mock('../customer.functions');
jest.mock('../base.functions');

describe('readCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call admin.readCategory when no customerId is provided', async () => {
    const mockApiRoot = {};
    const mockContext = {projectKey: 'test-project'};
    const mockParams = {id: 'test-id'};
    const mockResult = {id: 'test-id', name: {en: 'Test Category'}};

    // Setup the mock implementation
    (admin.readCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await readCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(admin.readCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
    expect(customer.readCategory).not.toHaveBeenCalled();
  });

  it('should call customer.readCategory when customerId is provided', async () => {
    const mockApiRoot = {};
    const mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
    };
    const mockParams = {id: 'test-id'};
    const mockResult = {id: 'test-id', name: {en: 'Test Category'}};

    // Setup the mock implementation
    (customer.readCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await readCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(customer.readCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
    expect(admin.readCategory).not.toHaveBeenCalled();
  });

  it('should fetch a category by ID', async () => {
    const mockResult = {id: 'test-id', name: {en: 'Test Category'}};
    const mockApiRoot = {};
    const mockParams = {id: 'test-id'};

    // Setup the mock implementation
    (base.readCategoryById as jest.Mock).mockResolvedValueOnce(mockResult);
    (admin.readCategory as jest.Mock).mockImplementationOnce(
      (_apiRoot, _context, params) => {
        if (params.id) {
          return mockResult;
        }
      }
    );

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      mockParams
    );

    expect(result).toEqual({id: 'test-id', name: {en: 'Test Category'}});
  });

  it('should fetch a category by key', async () => {
    const mockResult = {
      id: 'test-id',
      key: 'test-key',
      name: {en: 'Test Category'},
    };
    const mockApiRoot = {};
    const mockParams = {key: 'test-key'};

    // Setup the mock implementation
    (base.readCategoryByKey as jest.Mock).mockResolvedValueOnce(mockResult);
    (admin.readCategory as jest.Mock).mockImplementationOnce(
      (_apiRoot, _context, params) => {
        if (params.key) {
          return mockResult;
        }
      }
    );

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      mockParams
    );

    expect(result).toEqual({
      id: 'test-id',
      key: 'test-key',
      name: {en: 'Test Category'},
    });
  });

  it('should fetch a list of categories with query parameters', async () => {
    const mockResult = {
      results: [
        {id: 'test-id-1', name: {en: 'Test Category 1'}},
        {id: 'test-id-2', name: {en: 'Test Category 2'}},
      ],
      total: 2,
    };
    const mockApiRoot = {};
    const mockParams = {
      limit: 10,
      offset: 0,
      sort: ['name.en asc'],
      where: ['name(en = "Test Category")'],
    };

    // Setup the mock implementation
    (base.queryCategories as jest.Mock).mockResolvedValueOnce(mockResult);
    (admin.readCategory as jest.Mock).mockImplementationOnce(
      (_apiRoot, _context, params) => {
        if (!params.id && !params.key) {
          return mockResult;
        }
      }
    );

    const result = await readCategory(
      mockApiRoot as any,
      {projectKey: 'test-project'},
      mockParams
    );

    expect(result).toEqual({
      results: [
        {id: 'test-id-1', name: {en: 'Test Category 1'}},
        {id: 'test-id-2', name: {en: 'Test Category 2'}},
      ],
      total: 2,
    });
  });

  it('should handle errors properly', async () => {
    const mockApiRoot = {};
    const mockParams = {};

    // Setup the mock implementation to throw an error
    (admin.readCategory as jest.Mock).mockRejectedValueOnce(
      new SDKError('Failed to read category', new Error('API Error'))
    );

    await expect(
      readCategory(mockApiRoot as any, {projectKey: 'test-project'}, mockParams)
    ).rejects.toThrow('Failed to read category');
  });
});

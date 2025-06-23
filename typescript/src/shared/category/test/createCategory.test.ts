import {createCategory} from '../functions';
import * as admin from '../admin.functions';

// Mocking admin functions
jest.mock('../admin.functions');

describe('createCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call admin.createCategory', async () => {
    const mockApiRoot = {};
    const mockContext = {projectKey: 'test-project'};
    const mockParams = {
      name: {en: 'Test Category'},
      slug: {en: 'test-category'},
    };
    const mockResult = {
      id: 'new-category-id',
      name: {en: 'Test Category'},
      slug: {en: 'test-category'},
    };

    // Setup the mock implementation
    (admin.createCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await createCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(admin.createCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
  });

  it('should call admin.createCategory even with customer context', async () => {
    const mockApiRoot = {};
    const mockContext = {
      projectKey: 'test-project',
      customerId: 'customer-123', // Note: this should not change behavior
    };
    const mockParams = {
      name: {en: 'Test Category'},
      slug: {en: 'test-category'},
    };
    const mockResult = {
      id: 'new-category-id',
      name: {en: 'Test Category'},
      slug: {en: 'test-category'},
    };

    // Setup the mock implementation
    (admin.createCategory as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await createCategory(
      mockApiRoot as any,
      mockContext,
      mockParams
    );

    expect(result).toEqual(mockResult);
    expect(admin.createCategory).toHaveBeenCalledWith(
      mockApiRoot,
      mockContext,
      mockParams
    );
  });
});

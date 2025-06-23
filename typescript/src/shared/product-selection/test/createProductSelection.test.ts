import {createProductSelection} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

type MockApiRoot = {
  withProjectKey: jest.Mock;
  productSelections: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
};

describe('createProductSelection', () => {
  let mockApiRoot: MockApiRoot;
  const mockContext = {projectKey: 'test-project'};

  beforeEach(() => {
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      productSelections: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        body: {
          id: 'test-product-selection-id',
          version: 1,
          key: 'test-product-selection-key',
          name: {
            en: 'Test Product Selection',
          },
          mode: 'Individual',
          productCount: 0,
          createdAt: '2024-04-08T00:00:00.000Z',
          lastModifiedAt: '2024-04-08T00:00:00.000Z',
        },
      }),
    };
  });

  it('should create a product selection successfully', async () => {
    const mockProductSelectionDraft = {
      name: {
        en: 'Test Product Selection',
      },
      key: 'test-product-selection-key',
      mode: 'Individual' as const,
    };

    const result = await createProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      mockProductSelectionDraft
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: mockProductSelectionDraft,
    });
    expect(result).toEqual({
      id: 'test-product-selection-id',
      version: 1,
      key: 'test-product-selection-key',
      name: {
        en: 'Test Product Selection',
      },
      mode: 'Individual',
      productCount: 0,
      createdAt: '2024-04-08T00:00:00.000Z',
      lastModifiedAt: '2024-04-08T00:00:00.000Z',
    });
  });

  it('should create a product selection with IndividualExclusion mode', async () => {
    const mockProductSelectionDraft = {
      name: {
        en: 'Test Product Selection',
      },
      key: 'test-product-selection-key',
      mode: 'IndividualExclusion' as const,
    };

    await createProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      mockProductSelectionDraft
    );

    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: mockProductSelectionDraft,
    });
  });

  it('should create a product selection with custom fields', async () => {
    const mockProductSelectionDraft = {
      name: {
        en: 'Test Product Selection',
      },
      key: 'test-product-selection-key',
      mode: 'Individual' as const,
      custom: {
        type: {
          id: 'test-type-id',
          typeId: 'type' as const,
        },
        fields: {
          description: 'Test description',
        },
      },
    };

    await createProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      mockProductSelectionDraft
    );

    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: mockProductSelectionDraft,
    });
  });

  it('should throw an error when the API call fails', async () => {
    const mockError = new Error('API Error');
    (mockApiRoot.execute as jest.Mock) = jest.fn().mockRejectedValue(mockError);

    const mockProductSelectionDraft = {
      name: {
        en: 'Test Product Selection',
      },
      mode: 'Individual' as const,
    };

    await expect(
      createProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        mockProductSelectionDraft
      )
    ).rejects.toThrow('Failed to create ProductSelection');
  });
});

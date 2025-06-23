import {createProduct} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

type MockApiRoot = {
  withProjectKey: jest.Mock;
  products: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
};

describe('createProduct', () => {
  let mockApiRoot: MockApiRoot;
  const mockContext = {projectKey: 'test-project'};

  beforeEach(() => {
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      products: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        body: {
          id: 'test-product-id',
          version: 1,
          createdAt: '2024-04-08T00:00:00.000Z',
          lastModifiedAt: '2024-04-08T00:00:00.000Z',
        },
      }),
    };
  });

  it('should create a product successfully', async () => {
    const mockProductDraft = {
      productType: {
        id: 'test-product-type-id',
        typeId: 'product-type' as const,
      },
      name: {
        en: 'Test Product',
      },
      slug: {
        en: 'test-product',
      },
      masterVariant: {
        sku: 'TEST-SKU-001',
        attributes: [],
      },
    };

    const result = await createProduct(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      mockProductDraft
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.products).toHaveBeenCalled();
    expect(mockApiRoot.post).toHaveBeenCalledWith({
      body: mockProductDraft,
    });
    expect(result).toEqual({
      id: 'test-product-id',
      version: 1,
      createdAt: '2024-04-08T00:00:00.000Z',
      lastModifiedAt: '2024-04-08T00:00:00.000Z',
    });
  });

  it('should throw an error when the API call fails', async () => {
    const mockError = new Error('API Error');
    (mockApiRoot.execute as jest.Mock) = jest.fn().mockRejectedValue(mockError);

    const mockProductDraft = {
      productType: {
        id: 'test-product-type-id',
        typeId: 'product-type' as const,
      },
      name: {
        en: 'Test Product',
      },
      slug: {
        en: 'test-product',
      },
    };

    await expect(
      createProduct(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        mockProductDraft
      )
    ).rejects.toThrow('Failed to create product');
  });
});

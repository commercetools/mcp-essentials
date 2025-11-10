import {bulkCreate} from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock the individual create functions
jest.mock('../../products/functions', () => ({
  createProduct: jest
    .fn()
    .mockImplementation((_apiRoot: any, _context: any, params: any) => {
      return {id: 'mock-product-id', ...params};
    }),
}));

jest.mock('../../customer/functions', () => ({
  createCustomer: jest
    .fn()
    .mockImplementation((_apiRoot: any, _context: any, params: any) => {
      return {id: 'mock-customer-id', ...params};
    }),
}));

jest.mock('../../category/functions', () => ({
  createCategory: jest
    .fn()
    .mockImplementation((_apiRoot: any, _context: any, params: any) => {
      return {id: 'mock-category-id', ...params};
    }),
}));

jest.mock('../../inventory/functions', () => ({
  createInventory: jest
    .fn()
    .mockImplementation((_apiRoot: any, _context: any, params: any) => {
      return {id: 'mock-inventory-id', ...params};
    }),
}));

jest.mock('../../shopping-lists/functions', () => ({
  createShoppingList: jest
    .fn()
    .mockImplementation((_apiRoot: any, _context: any, params: any) => {
      return {id: 'mock-shopping-list-id', ...params};
    }),
}));

describe('bulkCreate function', () => {
  const mockApiRoot = {} as unknown as ApiRoot;
  const mockContext = {projectKey: 'test-project'};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create multiple entities in parallel', async () => {
    const params = {
      items: [
        {
          entityType: 'product' as const,
          data: {
            productType: {
              id: 'product-type-id',
              typeId: 'product-type',
            },
            name: {
              en: 'Test Product',
            },
            slug: {
              en: 'test-product',
            },
          },
        },
        {
          entityType: 'customer' as const,
          data: {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
          },
        },
        {
          entityType: 'category' as const,
          data: {
            name: {
              en: 'Test Category',
            },
            slug: {
              en: 'test-category',
            },
          },
        },
        {
          entityType: 'inventory' as const,
          data: {
            sku: 'SKU-123',
            quantityOnStock: 100,
            key: 'inventory-key-123',
            restockableInDays: 7,
          },
        },
      ],
    };

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result).toEqual({
      success: true,
      results: [
        {id: 'mock-product-id', ...params.items[0].data},
        {id: 'mock-customer-id', ...params.items[1].data},
        {id: 'mock-category-id', ...params.items[2].data},
        {id: 'mock-inventory-id', ...params.items[3].data},
      ],
    });
  });

  it('should create shopping lists in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'shopping-lists' as const,
          data: {
            name: {en: 'My Shopping List'},
            key: 'my-shopping-list',
            customer: {
              id: 'customer-123',
              typeId: 'customer' as const,
            },
          },
        },
        {
          entityType: 'shopping-lists' as const,
          data: {
            name: {en: 'Another Shopping List'},
            key: 'another-shopping-list',
            customer: {
              id: 'customer-456',
              typeId: 'customer' as const,
            },
          },
        },
      ],
    };

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result).toEqual({
      success: true,
      results: [
        {id: 'mock-shopping-list-id', ...params.items[0].data},
        {id: 'mock-shopping-list-id', ...params.items[1].data},
      ],
    });
  });

  it('should handle errors and fail the entire operation', async () => {
    // Mock one of the functions to throw an error
    const createProductMock = require('../../products/functions').createProduct;
    createProductMock.mockRejectedValueOnce(
      new Error('Product creation failed')
    );

    const params = {
      items: [
        {
          entityType: 'product' as const,
          data: {
            productType: {
              id: 'product-type-id',
              typeId: 'product-type',
            },
            name: {
              en: 'Test Product',
            },
            slug: {
              en: 'test-product',
            },
          },
        },
        {
          entityType: 'customer' as const,
          data: {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
          },
        },
      ],
    };

    await expect(bulkCreate(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Bulk creation failed: Product creation failed'
    );
  });

  it('should throw an error for unsupported entity types', async () => {
    // Use type assertion to bypass type checking for this test specifically
    type BulkCreateParams = Parameters<typeof bulkCreate>[2];
    const params = {
      items: [
        {
          // We're specifically testing an invalid entity type here
          entityType: 'unsupported-type' as any,
          data: {
            // We need to provide minimal valid data structure
            name: {en: 'Test'},
            slug: {en: 'test'},
            productType: {id: 'pt1', typeId: 'product-type' as const},
          },
        },
      ],
    } as BulkCreateParams;

    await expect(bulkCreate(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Bulk creation failed: Unsupported entity type: unsupported-type'
    );
  });
});

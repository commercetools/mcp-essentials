import {
  searchProducts,
  contextToProductSearchFunctionMapping,
} from '../functions';
import * as admin from '../admin.functions';

// Mock the admin functions
jest.mock('../admin.functions', () => ({
  searchProducts: jest.fn(),
}));

describe('product-search functions', () => {
  let mockApiRoot: any;
  let mockExecute: jest.Mock;
  let mockContext: any;

  beforeEach(() => {
    mockExecute = jest.fn();
    const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
    const mockSearch = jest.fn().mockReturnValue({post: mockPost});
    const mockProducts = jest.fn().mockReturnValue({search: mockSearch});
    const mockWithProjectKey = jest
      .fn()
      .mockReturnValue({products: mockProducts});

    mockApiRoot = {
      withProjectKey: mockWithProjectKey,
    };

    mockContext = {
      projectKey: 'test-project',
    };

    // Setup mock response
    mockExecute.mockResolvedValue({
      body: {
        count: 2,
        total: 2,
        offset: 0,
        limit: 20,
        results: [
          {id: 'product-1', key: 'product-key-1'},
          {id: 'product-2', key: 'product-key-2'},
        ],
      },
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('contextToProductSearchFunctionMapping', () => {
    it('should return search_products function for admin context', () => {
      const mapping = contextToProductSearchFunctionMapping({isAdmin: true});
      expect(mapping).toHaveProperty('search_products');
      expect(mapping.search_products).toBe(admin.searchProducts);
    });

    it('should return search_products function for customer context', () => {
      const mapping = contextToProductSearchFunctionMapping({
        customerId: 'customer-1',
      });
      expect(mapping).toHaveProperty('search_products');
      expect(mapping.search_products).toBe(admin.searchProducts);
    });

    it('should return search_products function for store context', () => {
      const mapping = contextToProductSearchFunctionMapping({
        storeKey: 'store-1',
      });
      expect(mapping).toHaveProperty('search_products');
      expect(mapping.search_products).toBe(admin.searchProducts);
    });

    it('should return search_products function for empty context', () => {
      const mapping = contextToProductSearchFunctionMapping();
      expect(mapping).toHaveProperty('search_products');
      expect(mapping.search_products).toBe(admin.searchProducts);
    });
  });

  describe('legacy searchProducts function', () => {
    it('should call admin.searchProducts with the correct parameters', async () => {
      const params = {
        query: {
          fullText: {
            value: 'test product',
            locale: 'en',
          },
        },
      };

      // Setup the mock implementation for admin.searchProducts
      (admin.searchProducts as jest.Mock).mockResolvedValue({
        count: 2,
        total: 2,
        results: [
          {id: 'product-1', key: 'product-key-1'},
          {id: 'product-2', key: 'product-key-2'},
        ],
      });

      await searchProducts(mockApiRoot, mockContext, params);

      // Check if admin.searchProducts was called with correct parameters
      expect(admin.searchProducts).toHaveBeenCalledWith(
        mockApiRoot,
        {...mockContext, projectKey: mockContext.projectKey},
        params
      );
    });
  });

  it('should search products with minimal parameters', async () => {
    const params = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
    };

    // Setup the mock implementation for admin.searchProducts
    (admin.searchProducts as jest.Mock).mockResolvedValue({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });

    const result = await searchProducts(mockApiRoot, mockContext, params);

    // We don't need to check withProjectKey since we're mocking admin.searchProducts
    expect(admin.searchProducts).toHaveBeenCalledWith(
      mockApiRoot,
      {...mockContext, projectKey: mockContext.projectKey},
      params
    );

    expect(result).toEqual({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });
  });

  it('should search products with all available parameters', async () => {
    const params = {
      query: {
        exact: {
          field: 'variants.attributes.color',
          fieldType: 'text',
          value: 'red',
        },
      },
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'asc' as const,
          mode: 'min' as const,
        },
      ],
      limit: 10,
      offset: 20,
      markMatchingVariants: true,
      productProjectionParameters: {},
      facets: [
        {
          distinct: {
            name: 'colors',
            field: 'variants.attributes.color',
            fieldType: 'text',
            limit: 10,
          },
        },
      ],
    };

    // Setup the mock implementation for admin.searchProducts
    (admin.searchProducts as jest.Mock).mockResolvedValue({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });

    const result = await searchProducts(mockApiRoot, mockContext, params);

    // We don't need to check withProjectKey since we're mocking admin.searchProducts
    expect(admin.searchProducts).toHaveBeenCalledWith(
      mockApiRoot,
      {...mockContext, projectKey: mockContext.projectKey},
      params
    );

    expect(result).toEqual({
      count: 2,
      total: 2,
      offset: 0,
      limit: 20,
      results: [
        {id: 'product-1', key: 'product-key-1'},
        {id: 'product-2', key: 'product-key-2'},
      ],
    });
  });

  it('should throw an error when API request fails', async () => {
    const error = new Error('API Error');

    // Make admin.searchProducts throw an error
    (admin.searchProducts as jest.Mock).mockRejectedValue(
      new Error('Failed to search products')
    );

    const params = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
    };

    await expect(
      searchProducts(mockApiRoot, mockContext, params)
    ).rejects.toThrow('Failed to search products');
  });
});

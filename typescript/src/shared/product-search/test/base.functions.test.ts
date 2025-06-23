import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

describe('base product search functions', () => {
  let mockApiRoot: any;
  let mockExecute: jest.Mock;

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
  });

  describe('searchProducts', () => {
    it('should search products with minimal parameters', async () => {
      const params = {
        query: {
          fullText: {
            value: 'test product',
            locale: 'en',
          },
        },
      };

      const result = await base.searchProducts(
        mockApiRoot,
        'test-project',
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockExecute).toHaveBeenCalled();
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

      const result = await base.searchProducts(
        mockApiRoot,
        'test-project',
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });

      // Verify that the post body contains all expected parameters
      const mockPostFn = mockApiRoot.withProjectKey().products().search().post;
      expect(mockPostFn).toHaveBeenCalledWith({
        body: {
          query: params.query,
          sort: params.sort,
          limit: params.limit,
          offset: params.offset,
          markMatchingVariants: params.markMatchingVariants,
          productProjectionParameters: params.productProjectionParameters,
          facets: params.facets,
        },
      });

      expect(mockExecute).toHaveBeenCalled();
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

    it('should throw an SDKError when API request fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        query: {
          fullText: {
            value: 'test product',
            locale: 'en',
          },
        },
      };

      await expect(
        base.searchProducts(mockApiRoot, 'test-project', params)
      ).rejects.toThrow(SDKError);

      await expect(
        base.searchProducts(mockApiRoot, 'test-project', params)
      ).rejects.toThrow('Failed to search products');
    });
  });
});

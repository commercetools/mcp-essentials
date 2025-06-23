import {listProducts} from '../functions';

const mockGet = jest.fn();
const mockExecute = jest.fn();
const mockProducts = jest.fn().mockReturnValue({
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  products: mockProducts,
});

const Commercetools = jest.fn().mockImplementation(() => ({
  withProjectKey: mockWithProjectKey,
}));

let commercetools: ReturnType<typeof Commercetools>;

beforeEach(() => {
  commercetools = new Commercetools('fake-api-key');
  // Reset all mocks
  mockGet.mockClear();
  mockExecute.mockClear();
  mockProducts.mockClear();
  mockWithProjectKey.mockClear();
});

describe('listProducts', () => {
  it('should list products with default parameters', async () => {
    const mockProductsData = [
      {id: 'prod_123456', name: 'Test Product 1'},
      {id: 'prod_789012', name: 'Test Product 2'},
    ];

    const context = {
      projectKey: 'test-project',
    };

    mockExecute.mockResolvedValue({body: mockProductsData});
    const result = await listProducts(commercetools, context, {});

    expect(mockWithProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockGet).toHaveBeenCalledWith({
      queryArgs: {
        limit: 10,
      },
    });
    expect(result).toEqual(mockProductsData);
  });

  it('should list products with all query parameters', async () => {
    const mockProductsData = [
      {id: 'prod_123456', name: 'Test Product 1'},
      {id: 'prod_789012', name: 'Test Product 2'},
    ];

    const context = {
      projectKey: 'test-project',
    };

    const params = {
      limit: 20,
      offset: 40,
      sort: ['name.en asc', 'createdAt desc'],
      where: ['masterData.current.name.en = "Test Product"'],
      expand: ['masterData.current.categories[*]'],
    };

    mockExecute.mockResolvedValue({body: mockProductsData});
    const result = await listProducts(commercetools, context, params);

    expect(mockWithProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockGet).toHaveBeenCalledWith({
      queryArgs: {
        limit: 20,
        offset: 40,
        sort: ['name.en asc', 'createdAt desc'],
        where: ['masterData.current.name.en = "Test Product"'],
        expand: ['masterData.current.categories[*]'],
      },
    });
    expect(result).toEqual(mockProductsData);
  });

  it('should handle error when listing products fails', async () => {
    const context = {
      projectKey: 'test-project',
    };

    const error = new Error('Failed to fetch products');
    mockExecute.mockRejectedValue(error);

    await expect(listProducts(commercetools, context, {})).rejects.toThrow(
      'Failed to list products'
    );

    expect(mockWithProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
  });
});

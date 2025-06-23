import {readProductSelection} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';

type MockApiRoot = {
  withProjectKey: jest.Mock;
  productSelections: jest.Mock;
  withId: jest.Mock;
  withKey: jest.Mock;
  get: jest.Mock;
  execute: jest.Mock;
};

describe('readProductSelection', () => {
  let mockApiRoot: MockApiRoot;
  const mockContext = {projectKey: 'test-project'};
  const mockProductSelection = {
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
  };

  const mockProductSelectionsPage = {
    limit: 20,
    offset: 0,
    count: 2,
    total: 2,
    results: [
      mockProductSelection,
      {
        id: 'second-product-selection-id',
        version: 1,
        key: 'second-product-selection-key',
        name: {
          en: 'Second Product Selection',
        },
        mode: 'Individual',
        productCount: 5,
        createdAt: '2024-04-08T00:00:00.000Z',
        lastModifiedAt: '2024-04-08T00:00:00.000Z',
      },
    ],
  };

  beforeEach(() => {
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnThis(),
      productSelections: jest.fn().mockReturnThis(),
      withId: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        body: mockProductSelection,
      }),
    };
  });

  it('should read a product selection by ID successfully', async () => {
    const params = {
      id: 'test-product-selection-id',
    };

    const result = await readProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withId).toHaveBeenCalledWith({
      ID: 'test-product-selection-id',
    });
    expect(mockApiRoot.get).toHaveBeenCalledWith({
      queryArgs: {},
    });
    expect(result).toEqual(mockProductSelection);
  });

  it('should read a product selection by key successfully', async () => {
    const params = {
      key: 'test-product-selection-key',
    };

    const result = await readProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withKey).toHaveBeenCalledWith({
      key: 'test-product-selection-key',
    });
    expect(mockApiRoot.get).toHaveBeenCalledWith({
      queryArgs: {},
    });
    expect(result).toEqual(mockProductSelection);
  });

  it('should query product selections with filtering and sorting', async () => {
    (mockApiRoot.execute as jest.Mock).mockResolvedValueOnce({
      body: mockProductSelectionsPage,
    });

    const params = {
      where: ['name(en="Test Product Selection")'],
      sort: ['name.en asc'],
      limit: 20,
      offset: 0,
    };

    const result = await readProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withId).not.toHaveBeenCalled();
    expect(mockApiRoot.withKey).not.toHaveBeenCalled();
    expect(mockApiRoot.get).toHaveBeenCalledWith({
      queryArgs: {
        where: ['name(en="Test Product Selection")'],
        sort: ['name.en asc'],
        limit: 20,
        offset: 0,
      },
    });
    expect(result).toEqual(mockProductSelectionsPage);
  });

  it('should query all product selections when no parameters are provided', async () => {
    (mockApiRoot.execute as jest.Mock).mockResolvedValueOnce({
      body: mockProductSelectionsPage,
    });

    const params = {};

    const result = await readProductSelection(
      mockApiRoot as unknown as ApiRoot,
      mockContext,
      params
    );

    expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
      projectKey: 'test-project',
    });
    expect(mockApiRoot.productSelections).toHaveBeenCalled();
    expect(mockApiRoot.withId).not.toHaveBeenCalled();
    expect(mockApiRoot.withKey).not.toHaveBeenCalled();
    expect(mockApiRoot.get).toHaveBeenCalledWith({
      queryArgs: {
        limit: 10,
      },
    });
    expect(result).toEqual(mockProductSelectionsPage);
  });

  it('should throw an error when the API call fails', async () => {
    const mockError = new Error('API Error');
    (mockApiRoot.execute as jest.Mock) = jest.fn().mockRejectedValue(mockError);

    const params = {
      id: 'test-product-selection-id',
    };

    await expect(
      readProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        params
      )
    ).rejects.toThrow('Failed to read ProductSelection');
  });
});

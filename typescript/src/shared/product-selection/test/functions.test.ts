import {
  readProductSelection,
  createProductSelection,
  updateProductSelection,
} from '../functions';
import * as admin from '../admin.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock ApiRoot for testing
type MockApiRoot = {
  withProjectKey: jest.Mock;
  productSelections: jest.Mock;
  withId: jest.Mock;
  withKey: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
};

describe('product-selection functions', () => {
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
      post: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        body: mockProductSelection,
      }),
    };
  });

  describe('readProductSelection', () => {
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

    it('should expand references when expand parameter is provided', async () => {
      const params = {
        id: 'test-product-selection-id',
        expand: ['products[*]'],
      };

      await readProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        params
      );

      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['products[*]'],
        },
      });
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
      (mockApiRoot.execute as jest.Mock) = jest
        .fn()
        .mockRejectedValue(mockError);

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

  describe('createProductSelection', () => {
    it('should create a product selection successfully', async () => {
      const params = {
        name: {
          en: 'Test Product Selection',
        },
        key: 'test-product-selection-key',
        mode: 'Individual' as const,
      };

      const result = await createProductSelection(
        mockApiRoot as unknown as ApiRoot,
        mockContext,
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.productSelections).toHaveBeenCalled();
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: params,
      });
      expect(result).toEqual(mockProductSelection);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('API Error');
      (mockApiRoot.execute as jest.Mock) = jest
        .fn()
        .mockRejectedValue(mockError);

      const params = {
        name: {
          en: 'Test Product Selection',
        },
        mode: 'Individual' as const,
      };

      await expect(
        createProductSelection(
          mockApiRoot as unknown as ApiRoot,
          mockContext,
          params
        )
      ).rejects.toThrow('Failed to create ProductSelection');
    });
  });

  describe('updateProductSelection', () => {
    it('should update a product selection by ID successfully', async () => {
      const params = {
        id: 'test-product-selection-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      };

      const result = await updateProductSelection(
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
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {
                en: 'Updated Product Selection',
              },
            },
          ],
        },
      });
      expect(result).toEqual(mockProductSelection);
    });

    it('should update a product selection by key successfully', async () => {
      const params = {
        key: 'test-product-selection-key',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      };

      const result = await updateProductSelection(
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
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {
                en: 'Updated Product Selection',
              },
            },
          ],
        },
      });
      expect(result).toEqual(mockProductSelection);
    });

    it('should throw an error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      };

      // We expect exactly one assertion to be called
      expect.assertions(1);

      try {
        await updateProductSelection(
          mockApiRoot as unknown as ApiRoot,
          mockContext,
          params
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('API Error');
      (mockApiRoot.execute as jest.Mock) = jest
        .fn()
        .mockRejectedValue(mockError);

      const params = {
        id: 'test-product-selection-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {
              en: 'Updated Product Selection',
            },
          },
        ],
      };

      await expect(
        updateProductSelection(
          mockApiRoot as unknown as ApiRoot,
          mockContext,
          params
        )
      ).rejects.toThrow('Failed to update ProductSelection');
    });
  });
});

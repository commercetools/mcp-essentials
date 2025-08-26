import {
  readProductType,
  createProductType,
  updateProductType,
} from '../functions';

describe('Product Type Functions', () => {
  // Read Product Type Tests
  describe('readProductType', () => {
    it('should read a product type by ID', async () => {
      // Mock data
      const mockProductTypeId = 'mock-product-type-id';
      const mockProductType = {
        id: mockProductTypeId,
        name: 'Test Product Type',
        description: 'Test product type description',
        attributes: [],
      };

      // Mock API root
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            withId: jest.fn().mockReturnValue({
              get: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue({
                  body: mockProductType,
                }),
              }),
            }),
          }),
        }),
      };

      const result = await readProductType(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {id: mockProductTypeId}
      );

      // Assert results
      expect(result).toEqual(mockProductType);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().productTypes().withId
      ).toHaveBeenCalledWith({ID: mockProductTypeId});
    });

    it('should handle errors when reading a product type', async () => {
      // Mock API root that throws an error
      const mockError = {
        body: {
          errors: [{detailedErrorMessage: 'Product type not found'}],
        },
      };
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            withId: jest.fn().mockReturnValue({
              get: jest.fn().mockReturnValue({
                execute: jest.fn().mockRejectedValue(mockError),
              }),
            }),
          }),
        }),
      };

      // Assert that the proper error is thrown
      await expect(
        readProductType(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {id: 'non-existent-id'}
        )
      ).rejects.toThrow('Failed to read product type: Product type not found');
    });
  });

  // List Product Types Tests
  describe('listProductTypes', () => {
    it('should list product types with default parameters', async () => {
      // Mock data
      const mockProductTypes = {
        limit: 10,
        offset: 0,
        count: 2,
        total: 2,
        results: [
          {
            id: 'pt-1',
            name: 'Product Type 1',
            description: 'Description 1',
            attributes: [],
          },
          {
            id: 'pt-2',
            name: 'Product Type 2',
            description: 'Description 2',
            attributes: [],
          },
        ],
      };

      // Mock API root
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: mockProductTypes,
              }),
            }),
          }),
        }),
      };

      const result = await readProductType(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {}
      );

      // Assert results
      expect(result).toEqual(mockProductTypes);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().productTypes().get
      ).toHaveBeenCalledWith({
        queryArgs: {limit: 10},
      });
    });

    it('should list product types with custom parameters', async () => {
      // Mock data
      const mockParams = {
        limit: 5,
        offset: 10,
        sort: ['name asc'],
        where: ['name = "Test Type"'],
        expand: ['attributes[*].type'],
      };

      const mockProductTypes = {
        limit: 5,
        offset: 10,
        count: 1,
        total: 1,
        results: [
          {
            id: 'pt-3',
            name: 'Test Type',
            description: 'Test type for filtered search',
            attributes: [],
          },
        ],
      };

      // Mock API root
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: mockProductTypes,
              }),
            }),
          }),
        }),
      };

      const result = await readProductType(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        mockParams
      );

      // Assert results
      expect(result).toEqual(mockProductTypes);
      expect(
        mockApiRoot.withProjectKey().productTypes().get
      ).toHaveBeenCalledWith({
        queryArgs: mockParams,
      });
    });

    it('should handle errors when listing product types', async () => {
      // Mock API root that throws an error
      const mockError = {
        body: {
          errors: [{detailedErrorMessage: 'Invalid sort parameter'}],
        },
      };
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      };

      // Assert that the proper error is thrown
      await expect(
        readProductType(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {sort: ['invalid sort']}
        )
      ).rejects.toThrow('Failed to list product types: Invalid sort parameter');
    });
  });

  // Create Product Type Tests
  describe('createProductType', () => {
    it('should create a product type', async () => {
      // Mock data
      const mockProductTypeData = {
        key: 'test-product-type',
        name: 'Test Product Type',
        description: 'Test product type description',
        attributes: [
          {
            name: 'color',
            label: {en: 'Color'},
            isRequired: false,
            isSearchable: true,
            type: {name: 'text'},
          },
        ],
      };

      const mockCreatedProductType = {
        ...mockProductTypeData,
        id: 'new-product-type-id',
        version: 1,
        createdAt: '2023-01-01T00:00:00.000Z',
        lastModifiedAt: '2023-01-01T00:00:00.000Z',
      };

      // Mock API root
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({
                body: mockCreatedProductType,
              }),
            }),
          }),
        }),
      };

      const result = await createProductType(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        mockProductTypeData
      );

      // Assert results
      expect(result).toEqual(mockCreatedProductType);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().productTypes().post
      ).toHaveBeenCalledWith({
        body: mockProductTypeData,
      });
    });

    it('should handle errors when creating a product type', async () => {
      // Mock data
      const mockProductTypeData = {
        key: 'test-product-type',
        name: 'Test Product Type',
        description: 'Test product type description',
      };

      // Mock API root that throws an error
      const mockError = {
        body: {
          errors: [
            {detailedErrorMessage: 'Product type with key already exists'},
          ],
        },
      };
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      };

      // Assert that the proper error is thrown
      await expect(
        createProductType(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          mockProductTypeData
        )
      ).rejects.toThrow(
        'Failed to create product type: Product type with key already exists'
      );
    });
  });

  // Update Product Type Tests
  describe('updateProductType', () => {
    it('should update a product type', async () => {
      // Mock data
      const mockProductTypeId = 'existing-product-type-id';
      const mockUpdateParams = {
        id: mockProductTypeId,
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Product Type Name',
          },
          {
            action: 'changeDescription',
            description: 'Updated product type description',
          },
        ],
      };

      const mockUpdatedProductType = {
        id: mockProductTypeId,
        version: 2,
        name: 'Updated Product Type Name',
        description: 'Updated product type description',
        attributes: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        lastModifiedAt: '2023-01-02T00:00:00.000Z',
      };

      // Mock API root
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            withId: jest.fn().mockReturnValue({
              post: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue({
                  body: mockUpdatedProductType,
                }),
              }),
            }),
          }),
        }),
      };

      const result = await updateProductType(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        mockUpdateParams
      );

      // Assert results
      expect(result).toEqual(mockUpdatedProductType);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(
        mockApiRoot.withProjectKey().productTypes().withId
      ).toHaveBeenCalledWith({ID: mockProductTypeId});
      expect(
        mockApiRoot.withProjectKey().productTypes().withId().post
      ).toHaveBeenCalledWith({
        body: {
          version: mockUpdateParams.version,
          actions: mockUpdateParams.actions,
        },
      });
    });

    it('should handle errors when updating a product type', async () => {
      // Mock data
      const mockUpdateParams = {
        id: 'existing-product-type-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Product Type Name',
          },
        ],
      };

      // Mock API root that throws an error
      const mockError = {
        body: {
          errors: [{detailedErrorMessage: 'Object not found'}],
        },
      };
      const mockApiRoot = {
        withProjectKey: jest.fn().mockReturnValue({
          productTypes: jest.fn().mockReturnValue({
            withId: jest.fn().mockReturnValue({
              post: jest.fn().mockReturnValue({
                execute: jest.fn().mockRejectedValue(mockError),
              }),
            }),
          }),
        }),
      };

      // Assert that the proper error is thrown
      await expect(
        updateProductType(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          mockUpdateParams
        )
      ).rejects.toThrow('Failed to update product type: Object not found');
    });
  });
});

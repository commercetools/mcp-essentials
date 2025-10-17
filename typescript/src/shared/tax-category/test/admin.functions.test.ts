import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

const mockApiRoot = {} as ApiRoot;
const mockContext: CommercetoolsFuncContext = {
  projectKey: 'test-project',
  isAdmin: true,
};

describe('Tax Category Admin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readTaxCategory', () => {
    it('should read tax category by ID', async () => {
      const mockResult = {id: 'test-id', name: 'Test Category'};
      (base.readTaxCategoryById as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readTaxCategory(mockApiRoot, mockContext, {
        id: 'test-id',
      });

      expect(base.readTaxCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {id: 'test-id', expand: undefined}
      );
      expect(result).toEqual(mockResult);
    });

    it('should read tax category by key', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Test Category',
      };
      (base.readTaxCategoryByKey as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readTaxCategory(mockApiRoot, mockContext, {
        key: 'test-key',
      });

      expect(base.readTaxCategoryByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {key: 'test-key', expand: undefined}
      );
      expect(result).toEqual(mockResult);
    });

    it('should query tax categories when neither id nor key provided', async () => {
      const mockResult = {
        results: [{id: 'test-id-1'}, {id: 'test-id-2'}],
      };
      (base.queryTaxCategories as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readTaxCategory(mockApiRoot, mockContext, {
        limit: 10,
      });

      expect(base.queryTaxCategories).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          limit: 10,
          offset: undefined,
          sort: undefined,
          where: undefined,
          expand: undefined,
        }
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors when reading tax category', async () => {
      const error = new Error('Base function error');
      (base.readTaxCategoryById as jest.Mock).mockRejectedValue(error);

      await expect(
        admin.readTaxCategory(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createTaxCategory', () => {
    it('should create a tax category', async () => {
      const mockResult = {id: 'new-id', name: 'New Category'};
      (base.createTaxCategory as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        name: 'New Category',
        rates: [],
      };
      const result = await admin.createTaxCategory(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.createTaxCategory).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors when creating tax category', async () => {
      const error = new Error('Base function error');
      (base.createTaxCategory as jest.Mock).mockRejectedValue(error);

      const params = {
        name: 'New Category',
        rates: [],
      };
      await expect(
        admin.createTaxCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateTaxCategory', () => {
    it('should update tax category by ID', async () => {
      const mockResult = {id: 'test-id', version: 2, name: 'Updated Category'};
      (base.updateTaxCategoryById as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Category'}],
      };
      const result = await admin.updateTaxCategory(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateTaxCategoryById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'test-id',
          version: 1,
          actions: params.actions,
        }
      );
      expect(result).toEqual(mockResult);
    });

    it('should update tax category by key', async () => {
      const mockResult = {id: 'test-id', version: 2, key: 'updated-key'};
      (base.updateTaxCategoryByKey as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setKey' as const, key: 'updated-key'}],
      };
      const result = await admin.updateTaxCategory(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updateTaxCategoryByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'test-key',
          version: 1,
          actions: params.actions,
        }
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw error when neither id nor key provided', async () => {
      const params = {
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Category'}],
      };

      await expect(
        admin.updateTaxCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
      await expect(
        admin.updateTaxCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a tax category'
      );
    });

    it('should handle errors when updating tax category', async () => {
      const error = new Error('Base function error');
      (base.updateTaxCategoryById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Category'}],
      };
      await expect(
        admin.updateTaxCategory(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

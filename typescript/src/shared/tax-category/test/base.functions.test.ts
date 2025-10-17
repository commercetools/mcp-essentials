import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the execute method
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockTaxCategories = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});

const mockWithProjectKey = jest.fn().mockReturnValue({
  taxCategories: mockTaxCategories,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

const projectKey = 'test-project';

describe('Tax Category Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readTaxCategoryById', () => {
    it('should read a tax category by ID', async () => {
      const mockResponse = {
        body: {id: 'test-id', key: 'test-key', name: 'Test Tax Category'},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readTaxCategoryById(mockApiRoot, projectKey, {
        id: 'test-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading tax category by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readTaxCategoryById(mockApiRoot, projectKey, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
      await expect(
        base.readTaxCategoryById(mockApiRoot, projectKey, {id: 'test-id'})
      ).rejects.toThrow('Error reading tax category by ID');
    });
  });

  describe('readTaxCategoryByKey', () => {
    it('should read a tax category by key', async () => {
      const mockResponse = {
        body: {id: 'test-id', key: 'test-key', name: 'Test Tax Category'},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readTaxCategoryByKey(mockApiRoot, projectKey, {
        key: 'test-key',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when reading tax category by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readTaxCategoryByKey(mockApiRoot, projectKey, {key: 'test-key'})
      ).rejects.toThrow(SDKError);
      await expect(
        base.readTaxCategoryByKey(mockApiRoot, projectKey, {key: 'test-key'})
      ).rejects.toThrow('Error reading tax category by key');
    });
  });

  describe('queryTaxCategories', () => {
    it('should query tax categories', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'test-id-1', name: 'Category 1'},
            {id: 'test-id-2', name: 'Category 2'},
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryTaxCategories(mockApiRoot, projectKey, {
        limit: 10,
        offset: 0,
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: undefined,
          where: undefined,
          expand: undefined,
        },
      });

      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when querying tax categories', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.queryTaxCategories(mockApiRoot, projectKey, {limit: 10})
      ).rejects.toThrow();

      await expect(
        base.queryTaxCategories(mockApiRoot, projectKey, {limit: 10})
      ).rejects.toThrow('Error querying tax categories');
    });
  });

  describe('createTaxCategory', () => {
    it('should create a new tax category', async () => {
      const mockResponse = {
        body: {id: 'new-id', name: 'New Tax Category'},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        name: 'New Tax Category',
        rates: [],
      };
      const result = await base.createTaxCategory(
        mockApiRoot,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({body: params});
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when creating a tax category', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        name: 'New Tax Category',
        rates: [],
      };

      await expect(
        base.createTaxCategory(mockApiRoot, projectKey, params)
      ).rejects.toThrow();

      await expect(
        base.createTaxCategory(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error creating tax category');
    });
  });

  describe('updateTaxCategoryById', () => {
    it('should update a tax category by ID', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, name: 'Updated Category'},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Category'}],
      };

      const result = await base.updateTaxCategoryById(
        mockApiRoot,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: 1, actions: params.actions},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when updating tax category by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Category'}],
      };

      await expect(
        base.updateTaxCategoryById(mockApiRoot, projectKey, params)
      ).rejects.toThrow();
      await expect(
        base.updateTaxCategoryById(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating tax category by ID');
    });
  });

  describe('updateTaxCategoryByKey', () => {
    it('should update a tax category by key', async () => {
      const mockResponse = {
        body: {id: 'test-id', version: 2, key: 'updated-key'},
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setKey' as const, key: 'updated-key'}],
      };

      const result = await base.updateTaxCategoryByKey(
        mockApiRoot,
        projectKey,
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockTaxCategories).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: 1, actions: params.actions},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should handle errors when updating tax category by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setKey' as const, key: 'updated-key'}],
      };
      await expect(
        base.updateTaxCategoryByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow();
      await expect(
        base.updateTaxCategoryByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating tax category by key');
    });
  });
});

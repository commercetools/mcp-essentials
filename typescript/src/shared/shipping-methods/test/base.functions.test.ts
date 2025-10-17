import {ApiRoot} from '@commercetools/platform-sdk';
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
const mockShippingMethods = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  shippingMethods: mockShippingMethods,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

const projectKey = 'test-project';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Shipping Method Base Functions', () => {
  describe('readShippingMethodById', () => {
    it('should read a shipping method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Test Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShippingMethodById(
        mockApiRoot,
        projectKey,
        {
          id: 'test-id',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading shipping method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readShippingMethodById(mockApiRoot, projectKey, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('readShippingMethodByKey', () => {
    it('should read a shipping method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Test Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readShippingMethodByKey(
        mockApiRoot,
        projectKey,
        {
          key: 'test-key',
        }
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading shipping method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readShippingMethodByKey(mockApiRoot, projectKey, {key: 'test-key'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('queryShippingMethods', () => {
    it('should query shipping methods', async () => {
      const mockResponse = {
        body: {
          results: [
            {
              id: 'test-id-1',
              key: 'test-key-1',
              name: 'Test Shipping Method 1',
            },
            {
              id: 'test-id-2',
              key: 'test-key-2',
              name: 'Test Shipping Method 2',
            },
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryShippingMethods(mockApiRoot, projectKey, {
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
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
    });

    it('should handle errors when querying shipping methods', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.queryShippingMethods(mockApiRoot, projectKey, {})
      ).rejects.toThrow();
    });
  });

  describe('createShippingMethod', () => {
    it('should create a shipping method', async () => {
      const mockResponse = {
        body: {
          id: 'new-id',
          key: 'new-key',
          name: 'New Shipping Method',
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        name: 'New Shipping Method',
        zoneRates: [],
      };

      const result = await base.createShippingMethod(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: expect.objectContaining({
          name: 'New Shipping Method',
          zoneRates: [],
        }),
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when creating shipping method', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        name: 'New Shipping Method',
        zoneRates: [],
      };

      await expect(
        base.createShippingMethod(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateShippingMethodById', () => {
    it('should update a shipping method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Updated Shipping Method',
          version: 2,
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      const result = await base.updateShippingMethodById(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating shipping method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      await expect(
        base.updateShippingMethodById(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateShippingMethodByKey', () => {
    it('should update a shipping method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: 'Updated Shipping Method',
          version: 2,
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      const result = await base.updateShippingMethodByKey(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse.body);
      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockShippingMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating shipping method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Shipping Method'}],
      };

      await expect(
        base.updateShippingMethodByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

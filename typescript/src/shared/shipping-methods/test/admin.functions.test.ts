import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions');

describe('Shipping Method Admin Functions', () => {
  let mockApiRoot: jest.Mocked<ApiRoot>;
  const mockContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  beforeEach(() => {
    mockApiRoot = {} as any;
    jest.clearAllMocks();
  });

  describe('readShippingMethod', () => {
    it('should read shipping method by ID', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Test Shipping Method',
      };

      (base.readShippingMethodById as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readShippingMethod(mockApiRoot, mockContext, {
        id: 'test-id',
      });

      expect(result).toEqual(mockResult);
      expect(base.readShippingMethodById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'test-id',
          expand: undefined,
        }
      );
    });

    it('should read shipping method by key', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Test Shipping Method',
      };

      (base.readShippingMethodByKey as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readShippingMethod(mockApiRoot, mockContext, {
        key: 'test-key',
      });

      expect(result).toEqual(mockResult);
      expect(base.readShippingMethodByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'test-key',
          expand: undefined,
        }
      );
    });

    it('should query shipping methods when neither id nor key provided', async () => {
      const mockResult = {
        results: [
          {
            id: 'test-id-1',
            key: 'test-key-1',
            name: 'Test Shipping Method 1',
          },
        ],
      };

      (base.queryShippingMethods as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readShippingMethod(mockApiRoot, mockContext, {
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual(mockResult);
      expect(base.queryShippingMethods).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          limit: 10,
          offset: 0,
          sort: undefined,
          where: undefined,
          expand: undefined,
        }
      );
    });

    it('should handle errors when reading shipping method', async () => {
      const error = new Error('API Error');
      (base.readShippingMethodById as jest.Mock).mockRejectedValue(error);

      await expect(
        admin.readShippingMethod(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createShippingMethod', () => {
    it('should create a shipping method', async () => {
      const mockResult = {
        id: 'new-id',
        key: 'new-key',
        name: 'New Shipping Method',
      };

      (base.createShippingMethod as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        name: 'New Shipping Method',
        zoneRates: [],
      };

      const result = await admin.createShippingMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(result).toEqual(mockResult);
      expect(base.createShippingMethod).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
    });
  });

  describe('updateShippingMethod', () => {
    it('should update shipping method by ID', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Updated Shipping Method',
      };

      (base.updateShippingMethodById as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Shipping Method',
          },
        ],
      };

      const result = await admin.updateShippingMethod(
        mockApiRoot,
        mockContext,
        params as any
      );

      expect(result).toEqual(mockResult);
      expect(base.updateShippingMethodById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'test-id',
          version: 1,
          actions: params.actions,
        }
      );
    });

    it('should update shipping method by key', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Updated Shipping Method',
      };

      (base.updateShippingMethodByKey as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Shipping Method',
          },
        ],
      };

      const result = await admin.updateShippingMethod(
        mockApiRoot,
        mockContext,
        params as any
      );

      expect(result).toEqual(mockResult);
      expect(base.updateShippingMethodByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'test-key',
          version: 1,
          actions: params.actions,
        }
      );
    });

    it('should throw error when neither id nor key provided', async () => {
      const params = {
        version: 1,
        actions: [],
      };

      await expect(
        admin.updateShippingMethod(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a shipping method'
      );
    });

    it('should handle errors when updating shipping method', async () => {
      const error = new Error('API Error');
      (base.updateShippingMethodById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [],
      };

      await expect(
        admin.updateShippingMethod(mockApiRoot, mockContext, params)
      ).rejects.toThrow(error);
    });
  });
});

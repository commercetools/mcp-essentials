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

describe('Zone Admin Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readZone', () => {
    it('should read zone by ID', async () => {
      const mockResult = {id: 'test-id', name: 'Test Zone'};
      (base.readZoneById as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readZone(mockApiRoot, mockContext, {
        id: 'test-id',
      });

      expect(base.readZoneById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {id: 'test-id', expand: undefined}
      );
      expect(result).toEqual(mockResult);
    });

    it('should read zone by key', async () => {
      const mockResult = {
        id: 'test-id',
        key: 'test-key',
        name: 'Test Zone',
      };
      (base.readZoneByKey as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readZone(mockApiRoot, mockContext, {
        key: 'test-key',
      });

      expect(base.readZoneByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {key: 'test-key', expand: undefined}
      );
      expect(result).toEqual(mockResult);
    });

    it('should query zones when neither id nor key provided', async () => {
      const mockResult = {
        results: [{id: 'test-id-1'}, {id: 'test-id-2'}],
      };
      (base.queryZones as jest.Mock).mockResolvedValue(mockResult);

      const result = await admin.readZone(mockApiRoot, mockContext, {
        limit: 10,
      });

      expect(base.queryZones).toHaveBeenCalledWith(
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

    it('should handle errors when reading zone', async () => {
      const error = new Error('Base function error');
      (base.readZoneById as jest.Mock).mockRejectedValue(error);

      await expect(
        admin.readZone(mockApiRoot, mockContext, {id: 'test-id'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createZone', () => {
    it('should create a zone', async () => {
      const mockResult = {id: 'new-id', name: 'New Zone'};
      (base.createZone as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        name: 'New Zone',
        locations: [],
      };
      const result = await admin.createZone(mockApiRoot, mockContext, params);

      expect(base.createZone).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle errors when creating zone', async () => {
      const error = new Error('Base function error');
      (base.createZone as jest.Mock).mockRejectedValue(error);

      const params = {
        name: 'New Zone',
        locations: [],
      };
      await expect(
        admin.createZone(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateZone', () => {
    it('should update zone by ID', async () => {
      const mockResult = {id: 'test-id', version: 2, name: 'Updated Zone'};
      (base.updateZoneById as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Zone'}],
      };
      const result = await admin.updateZone(mockApiRoot, mockContext, params);

      expect(base.updateZoneById).toHaveBeenCalledWith(
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

    it('should update zone by key', async () => {
      const mockResult = {id: 'test-id', version: 2, key: 'updated-key'};
      (base.updateZoneByKey as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setKey' as const, key: 'updated-key'}],
      };
      const result = await admin.updateZone(mockApiRoot, mockContext, params);

      expect(base.updateZoneByKey).toHaveBeenCalledWith(
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
        actions: [{action: 'changeName' as const, name: 'Updated Zone'}],
      };

      await expect(
        admin.updateZone(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
      await expect(
        admin.updateZone(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a zone'
      );
    });

    it('should handle errors when updating zone', async () => {
      const error = new Error('Base function error');
      (base.updateZoneById as jest.Mock).mockRejectedValue(error);

      const params = {
        id: 'test-id',
        version: 1,
        actions: [{action: 'changeName' as const, name: 'Updated Zone'}],
      };
      await expect(
        admin.updateZone(mockApiRoot, mockContext, params)
      ).rejects.toThrow(SDKError);
    });
  });
});

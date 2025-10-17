import {ApiRoot} from '@commercetools/platform-sdk';
import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the commercetools SDK
jest.mock('@commercetools/platform-sdk', () => ({
  ApiRoot: jest.fn(),
}));

describe('Zone Base Functions', () => {
  let mockApiRoot: jest.Mocked<ApiRoot>;
  let mockExecute: jest.Mock;
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;
  let mockWithId: jest.Mock;
  let mockWithKey: jest.Mock;
  let mockZones: jest.Mock;
  let mockWithProjectKey: jest.Mock;

  beforeEach(() => {
    // Create mock functions
    mockExecute = jest.fn();
    mockGet = jest.fn().mockReturnValue({execute: mockExecute});
    mockPost = jest.fn().mockReturnValue({execute: mockExecute});
    mockWithId = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
    mockWithKey = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
    mockZones = jest.fn().mockReturnValue({
      withId: mockWithId,
      withKey: mockWithKey,
      get: mockGet,
      post: mockPost,
    });
    mockWithProjectKey = jest.fn().mockReturnValue({
      zones: mockZones,
    });

    // Create mock ApiRoot
    mockApiRoot = {
      withProjectKey: mockWithProjectKey,
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('readZoneById', () => {
    it('should read a zone by ID successfully', async () => {
      const mockZone = {id: 'zone-123', name: 'Test Zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const result = await base.readZoneById(mockApiRoot, 'test-project', {
        id: 'zone-123',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'zone-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: undefined},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockZone);
    });

    it('should read a zone by ID with expand', async () => {
      const mockZone = {id: 'zone-123', name: 'Test Zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const result = await base.readZoneById(mockApiRoot, 'test-project', {
        id: 'zone-123',
        expand: ['locations'],
      });

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['locations']},
      });
      expect(result).toEqual(mockZone);
    });

    it('should throw SDKError when reading zone by ID fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readZoneById(mockApiRoot, 'test-project', {id: 'zone-123'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('readZoneByKey', () => {
    it('should read a zone by key successfully', async () => {
      const mockZone = {id: 'zone-123', key: 'test-zone', name: 'Test Zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const result = await base.readZoneByKey(mockApiRoot, 'test-project', {
        key: 'test-zone',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-zone'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: undefined},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockZone);
    });

    it('should throw SDKError when reading zone by key fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readZoneByKey(mockApiRoot, 'test-project', {key: 'test-zone'})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('queryZones', () => {
    it('should query zones successfully', async () => {
      const mockZonesResponse = {
        results: [{id: 'zone-1'}, {id: 'zone-2'}],
        count: 2,
      };
      mockExecute.mockResolvedValue({body: mockZonesResponse});

      const result = await base.queryZones(mockApiRoot, 'test-project', {
        limit: 10,
        offset: 0,
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
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
      expect(result).toEqual(mockZonesResponse);
    });

    it('should throw SDKError when querying zones fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.queryZones(mockApiRoot, 'test-project', {})
      ).rejects.toThrow(SDKError);
    });
  });

  describe('createZone', () => {
    it('should create a zone successfully', async () => {
      const mockZone = {id: 'new-zone', name: 'New Zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const params = {
        name: 'New Zone',
        key: 'new-zone',
        description: 'A new zone',
        locations: [{country: 'US'}],
      };

      const result = await base.createZone(mockApiRoot, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'new-zone',
          name: 'New Zone',
          description: 'A new zone',
          locations: [{country: 'US'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockZone);
    });

    it('should throw SDKError when creating zone fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        name: 'New Zone',
        key: 'new-zone',
      };

      await expect(
        base.createZone(mockApiRoot, 'test-project', params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateZoneById', () => {
    it('should update a zone by ID successfully', async () => {
      const mockZone = {id: 'zone-123', version: 2, name: 'Updated Zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const params = {
        id: 'zone-123',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Zone'}],
      };

      const result = await base.updateZoneById(
        mockApiRoot,
        'test-project',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'zone-123'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'changeName', name: 'Updated Zone'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockZone);
    });

    it('should throw SDKError when updating zone by ID fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        id: 'zone-123',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated Zone'}],
      };

      await expect(
        base.updateZoneById(mockApiRoot, 'test-project', params)
      ).rejects.toThrow(SDKError);
    });
  });

  describe('updateZoneByKey', () => {
    it('should update a zone by key successfully', async () => {
      const mockZone = {id: 'zone-123', version: 2, key: 'updated-zone'};
      mockExecute.mockResolvedValue({body: mockZone});

      const params = {
        key: 'test-zone',
        version: 1,
        actions: [{action: 'setKey', key: 'updated-zone'}],
      };

      const result = await base.updateZoneByKey(
        mockApiRoot,
        'test-project',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockZones).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-zone'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'setKey', key: 'updated-zone'}],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockZone);
    });

    it('should throw SDKError when updating zone by key fails', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const params = {
        key: 'test-zone',
        version: 1,
        actions: [{action: 'setKey', key: 'updated-zone'}],
      };

      await expect(
        base.updateZoneByKey(mockApiRoot, 'test-project', params)
      ).rejects.toThrow(SDKError);
    });
  });
});

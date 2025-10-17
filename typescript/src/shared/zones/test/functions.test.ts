import {ApiRoot} from '@commercetools/platform-sdk';
import {Context} from '../../../types/configuration';
import {
  contextToZoneFunctionMapping,
  readZone,
  createZone,
  updateZone,
} from '../functions';
import * as admin from '../admin.functions';

// Mock the function modules
jest.mock('../admin.functions');

const mockedAdmin = admin as jest.Mocked<typeof admin>;

describe('zone functions', () => {
  const mockApiRoot = {} as ApiRoot;
  const mockContext = {
    projectKey: 'test-project',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToZoneFunctionMapping', () => {
    it('should return customer functions when customerId is present', () => {
      const context: Context = {customerId: 'customer-123'};

      const result = contextToZoneFunctionMapping(context);

      expect(result).toEqual({
        read_zone: expect.any(Function),
        create_zone: expect.any(Function),
        update_zone: expect.any(Function),
      });
    });

    it('should return store functions when storeKey is present', () => {
      const context: Context = {storeKey: 'store-123'};

      const result = contextToZoneFunctionMapping(context);

      expect(result).toEqual({
        read_zone: expect.any(Function),
        create_zone: expect.any(Function),
        update_zone: expect.any(Function),
      });
    });

    it('should return admin functions when isAdmin is true', () => {
      const context: Context = {isAdmin: true};

      const result = contextToZoneFunctionMapping(context);

      expect(result).toEqual({
        read_zone: admin.readZone,
        create_zone: admin.createZone,
        update_zone: admin.updateZone,
      });
    });

    it('should return empty object when no context is provided', () => {
      const result = contextToZoneFunctionMapping();

      expect(result).toEqual({});
    });

    it('should return empty object when context has no relevant properties', () => {
      const context: Context = {};

      const result = contextToZoneFunctionMapping(context);

      expect(result).toEqual({});
    });
  });

  describe('readZone', () => {
    it('should delegate to admin function', async () => {
      const context = {...mockContext, isAdmin: true};
      const params = {id: 'zone-123'};
      const mockResult = {id: 'zone-123', name: 'Test Zone'};

      mockedAdmin.readZone.mockResolvedValue(mockResult);

      const result = await readZone(mockApiRoot, context, params);

      expect(mockedAdmin.readZone).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('createZone', () => {
    it('should delegate to admin function', async () => {
      const context = {...mockContext, isAdmin: true};
      const params = {name: 'Test Zone', locations: []};
      const mockResult = {id: 'zone-123', name: 'Test Zone'};

      mockedAdmin.createZone.mockResolvedValue(mockResult);

      const result = await createZone(mockApiRoot, context, params);

      expect(mockedAdmin.createZone).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateZone', () => {
    it('should delegate to admin function', async () => {
      const context = {...mockContext, isAdmin: true};
      const params = {id: 'zone-123', version: 1, actions: []};
      const mockResult = {id: 'zone-123', version: 2};

      mockedAdmin.updateZone.mockResolvedValue(mockResult);

      const result = await updateZone(mockApiRoot, context, params);

      expect(mockedAdmin.updateZone).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(result).toEqual(mockResult);
    });
  });
});

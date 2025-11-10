import {contextToExtensionFunctionMapping} from '../functions';
import {readExtension, createExtension, updateExtension} from '../functions';
import * as admin from '../admin.functions';

// Mock the admin functions
jest.mock('../admin.functions');

describe('Extension Functions', () => {
  const mockApiRoot = {} as any;
  const mockContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToExtensionFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {isAdmin: true};
      const mapping = contextToExtensionFunctionMapping(context);

      expect(mapping).toEqual({
        read_extension: admin.readExtension,
        create_extension: admin.createExtension,
        update_extension: admin.updateExtension,
      });
    });

    it('should return empty object when no context is provided', () => {
      const mapping = contextToExtensionFunctionMapping();

      expect(mapping).toEqual({});
    });

    it('should return empty object when context does not include isAdmin', () => {
      const context = {};
      const mapping = contextToExtensionFunctionMapping(context);

      expect(mapping).toEqual({});
    });
  });

  describe('readExtension', () => {
    it('should call admin readExtension', async () => {
      const mockResponse = {id: 'extension-123'};
      (admin.readExtension as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {id: 'extension-123'};
      const result = await readExtension(mockApiRoot, mockContext, params);

      expect(admin.readExtension).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createExtension', () => {
    it('should call admin createExtension', async () => {
      const mockResponse = {id: 'new-extension'};
      (admin.createExtension as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        destination: {
          type: 'HTTP' as const,
          url: 'https://api.example.com',
        },
        triggers: [
          {
            resourceTypeId: 'cart' as const,
            actions: ['Create' as const],
          },
        ],
      };

      const result = await createExtension(mockApiRoot, mockContext, params);

      expect(admin.createExtension).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateExtension', () => {
    it('should call admin updateExtension', async () => {
      const mockResponse = {id: 'extension-123', version: 2};
      (admin.updateExtension as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        id: 'extension-123',
        version: 1,
        actions: [
          {
            action: 'setTimeoutInMs' as const,
            timeoutInMs: 3000,
          },
        ],
      };

      const result = await updateExtension(mockApiRoot, mockContext, params);

      expect(admin.updateExtension).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext,
        params
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

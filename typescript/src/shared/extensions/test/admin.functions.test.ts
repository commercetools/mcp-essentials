import * as admin from '../admin.functions';
import * as base from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

jest.mock('../base.functions');

describe('Extension Admin Functions', () => {
  const mockApiRoot = {} as ApiRoot;
  const mockContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readExtension', () => {
    it('should read extension by ID', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
      };

      (base.readExtensionById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {id: 'extension-123'};
      const result = await admin.readExtension(mockApiRoot, mockContext, params);

      expect(base.readExtensionById).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, params);
      expect(result).toEqual(mockResponse);
    });

    it('should read extension by key', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
      };

      (base.readExtensionByKey as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {key: 'my-extension'};
      const result = await admin.readExtension(mockApiRoot, mockContext, params);

      expect(base.readExtensionByKey).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, params);
      expect(result).toEqual(mockResponse);
    });

    it('should query extensions when neither id nor key is provided', async () => {
      const mockResponse = {
        results: [{id: 'extension-1'}, {id: 'extension-2'}],
      };

      (base.queryExtensions as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {limit: 20, offset: 0};
      const result = await admin.readExtension(mockApiRoot, mockContext, params);

      expect(base.queryExtensions).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createExtension', () => {
    it('should create a new extension', async () => {
      const mockResponse = {
        id: 'new-extension',
        key: 'my-extension',
        destination: {type: 'HTTP', url: 'https://api.example.com'},
      };

      (base.createExtension as jest.Mock) = jest
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

      const result = await admin.createExtension(mockApiRoot, mockContext, params);

      expect(base.createExtension).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateExtension', () => {
    it('should update extension by ID', async () => {
      const mockResponse = {
        id: 'extension-123',
        version: 2,
      };

      (base.updateExtensionById as jest.Mock) = jest
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

      const result = await admin.updateExtension(mockApiRoot, mockContext, params);

      expect(base.updateExtensionById).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, {
        id: 'extension-123',
        version: 1,
        actions: params.actions,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should update extension by key', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
        version: 2,
      };

      (base.updateExtensionByKey as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const params = {
        key: 'my-extension',
        version: 1,
        actions: [
          {
            action: 'setKey' as const,
            key: 'updated-extension',
          },
        ],
      };

      const result = await admin.updateExtension(mockApiRoot, mockContext, params);

      expect(base.updateExtensionByKey).toHaveBeenCalledWith(mockApiRoot, mockContext.projectKey, {
        key: 'my-extension',
        version: 1,
        actions: params.actions,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'setTimeoutInMs' as const,
            timeoutInMs: 3000,
          },
        ],
      };

      try {
        await admin.updateExtension(mockApiRoot, mockContext, params as any);
        fail('Expected updateExtension to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Either id or key must be provided for updating an extension');
      }
    });
  });
});


import * as base from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

describe('Extension Base Functions', () => {
  const mockApiRoot = {} as ApiRoot;
  const projectKey = 'test-project';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readExtensionById', () => {
    it('should read an extension by ID', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
        destination: {type: 'HTTP', url: 'https://api.example.com'},
        triggers: [
          {
            resourceTypeId: 'cart',
            actions: ['Create', 'Update'],
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const result = await base.readExtensionById(mockApiRoot, projectKey, {
        id: 'extension-123',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when reading by ID', async () => {
      const mockError = new Error('Extension not found');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      await expect(
        base.readExtensionById(mockApiRoot, projectKey, {id: 'extension-123'})
      ).rejects.toThrow('Error reading extension by ID');
    });
  });

  describe('readExtensionByKey', () => {
    it('should read an extension by key', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
        destination: {type: 'HTTP', url: 'https://api.example.com'},
        triggers: [
          {
            resourceTypeId: 'cart',
            actions: ['Create', 'Update'],
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

      const result = await base.readExtensionByKey(mockApiRoot, projectKey, {
        key: 'my-extension',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when reading by key', async () => {
      const mockError = new Error('Extension not found');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

      await expect(
        base.readExtensionByKey(mockApiRoot, projectKey, {key: 'my-extension'})
      ).rejects.toThrow('Error reading extension by key');
    });
  });

  describe('queryExtensions', () => {
    it('should query extensions', async () => {
      const mockResponse = {
        results: [
          {
            id: 'extension-123',
            key: 'extension-1',
            destination: {type: 'HTTP', url: 'https://api.example.com'},
          },
        ],
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({body: mockResponse}),
          }),
        }),
      });

      const result = await base.queryExtensions(mockApiRoot, projectKey, {
        limit: 20,
        offset: 0,
        where: ['key="extension-1"'],
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when querying', async () => {
      const mockError = new Error('Query failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: jest.fn().mockRejectedValue(mockError),
          }),
        }),
      });

      await expect(
        base.queryExtensions(mockApiRoot, projectKey, {limit: 20})
      ).rejects.toThrow('Error querying extensions');
    });
  });

  describe('createExtension', () => {
    it('should create a new extension', async () => {
      const mockResponse = {
        id: 'new-extension-123',
        key: 'new-extension',
        destination: {type: 'HTTP', url: 'https://api.example.com'},
        triggers: [
          {
            resourceTypeId: 'cart',
            actions: ['Create'],
          },
        ],
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue({body: mockResponse}),
          }),
        }),
      });

      const params = {
        key: 'new-extension',
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
        timeoutInMs: 2000,
      };

      const result = await base.createExtension(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating', async () => {
      const mockError = new Error('Creation failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          post: jest.fn().mockReturnValue({
            execute: jest.fn().mockRejectedValue(mockError),
          }),
        }),
      });

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

      await expect(
        base.createExtension(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error creating extension');
    });
  });

  describe('updateExtensionById', () => {
    it('should update an extension by ID', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
        version: 2,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

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

      const result = await base.updateExtensionById(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating by ID', async () => {
      const mockError = new Error('Update failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withId: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

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

      await expect(
        base.updateExtensionById(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating extension by ID');
    });
  });

  describe('updateExtensionByKey', () => {
    it('should update an extension by key', async () => {
      const mockResponse = {
        id: 'extension-123',
        key: 'my-extension',
        version: 2,
      };

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockResolvedValue({body: mockResponse}),
            }),
          }),
        }),
      });

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

      const result = await base.updateExtensionByKey(
        mockApiRoot,
        projectKey,
        params
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when updating by key', async () => {
      const mockError = new Error('Update failed');

      (mockApiRoot.withProjectKey as jest.Mock) = jest.fn().mockReturnValue({
        extensions: jest.fn().mockReturnValue({
          withKey: jest.fn().mockReturnValue({
            post: jest.fn().mockReturnValue({
              execute: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        }),
      });

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

      await expect(
        base.updateExtensionByKey(mockApiRoot, projectKey, params)
      ).rejects.toThrow('Error updating extension by key');
    });
  });
});

import {
  readCustomObject,
  createCustomObject,
  updateCustomObject,
} from '../admin.functions';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithContainerAndKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithContainer = jest.fn().mockReturnValue({
  get: mockGet,
});
const mockCustomObjects = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withContainer: mockWithContainer,
  withContainerAndKey: mockWithContainerAndKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  customObjects: mockCustomObjects,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

// Mock context
const mockContext = {
  projectKey: 'test-project',
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Custom Objects Admin Functions', () => {
  describe('readCustomObject', () => {
    it('should read a custom object by container and key', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        expand: ['value.order'],
      };

      await readCustomObject(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomObjects).toHaveBeenCalled();
      expect(mockWithContainerAndKey).toHaveBeenCalledWith({
        container: 'test-container',
        key: 'test-key',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['value.order'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should query custom objects in a container when only container is provided', async () => {
      const params = {
        container: 'test-container',
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['key="test-key"'],
        expand: ['value.order'],
      };

      await readCustomObject(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomObjects).toHaveBeenCalled();
      expect(mockWithContainer).toHaveBeenCalledWith({
        container: 'test-container',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['key="test-key"'],
          expand: ['value.order'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error if container is not provided', async () => {
      const params = {
        limit: 10,
      };

      try {
        await readCustomObject(mockApiRoot as any, mockContext, params as any);
        // Should not get here if error is thrown correctly
        fail('Expected readCustomObject to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Container must be provided');
      }
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readCustomObject(mockApiRoot as any, mockContext, {
          container: 'test-container',
          key: 'test-key',
        })
      ).rejects.toThrow('Error reading custom object');
    });
  });

  describe('createCustomObject', () => {
    it('should create a custom object', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        value: {
          text: 'test value',
          number: 123,
        },
      };

      await createCustomObject(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomObjects).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          container: 'test-container',
          key: 'test-key',
          value: {
            text: 'test value',
            number: 123,
          },
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateCustomObject', () => {
    it('should update a custom object by container and key', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        version: 1,
        value: {
          updatedText: 'new value',
        },
      };

      await updateCustomObject(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomObjects).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          container: 'test-container',
          key: 'test-key',
          value: {
            updatedText: 'new value',
          },
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error if container is not provided', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        value: {},
      };

      try {
        await updateCustomObject(
          mockApiRoot as any,
          mockContext,
          params as any
        );
        // Should not get here if error is thrown correctly
        fail('Expected updateCustomObject to throw an error');
      } catch (error: any) {
        expect(error.message).toContain(
          'Both container and key must be provided'
        );
      }
    });

    it('should throw an error if key is not provided', async () => {
      const params = {
        container: 'test-container',
        version: 1,
        value: {},
      };

      try {
        await updateCustomObject(
          mockApiRoot as any,
          mockContext,
          params as any
        );
        // Should not get here if error is thrown correctly
        fail('Expected updateCustomObject to throw an error');
      } catch (error: any) {
        expect(error.message).toContain(
          'Both container and key must be provided'
        );
      }
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        updateCustomObject(mockApiRoot as any, mockContext, {
          container: 'test-container',
          key: 'test-key',
          version: 1,
          value: {},
        })
      ).rejects.toThrow('Error updating custom object');
    });
  });
});

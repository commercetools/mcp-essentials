import {
  readCustomObjectByContainerAndKey,
  queryCustomObjects,
  createCustomObject,
  updateCustomObjectByContainerAndKey,
  deleteCustomObjectByContainerAndKey,
} from '../base.functions';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockDelete = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithContainerAndKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  delete: mockDelete,
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

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Custom Objects Base Functions', () => {
  describe('readCustomObjectByContainerAndKey', () => {
    it('should read a custom object by container and key', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        expand: ['value.order'],
      };

      await readCustomObjectByContainerAndKey(
        mockApiRoot as any,
        'test-project',
        params
      );

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

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readCustomObjectByContainerAndKey(mockApiRoot as any, 'test-project', {
          container: 'test-container',
          key: 'test-key',
        })
      ).rejects.toThrow('Error reading custom object by container and key');
    });
  });

  describe('queryCustomObjects', () => {
    it('should query custom objects in a container', async () => {
      const params = {
        container: 'test-container',
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['key="test-key"'],
        expand: ['value.order'],
      };

      await queryCustomObjects(mockApiRoot as any, 'test-project', params);

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

    it('should handle errors properly', async () => {
      const errlog = console.error;
      console.error = () => {}; // temporarily override native log fn

      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        queryCustomObjects(mockApiRoot as any, 'test-project', {
          container: 'test-container',
        })
      ).rejects.toThrow('API error');
      console.error = errlog; // restore native log fn
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

      await createCustomObject(mockApiRoot as any, 'test-project', params);

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

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createCustomObject(mockApiRoot as any, 'test-project', {
          container: 'test-container',
          key: 'test-key',
          value: 'test value',
        })
      ).rejects.toThrow('Error creating custom object');
    });
  });

  describe('updateCustomObjectByContainerAndKey', () => {
    it('should update a custom object by container and key', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        version: 1,
        value: {
          updatedText: 'new value',
        },
      };

      await updateCustomObjectByContainerAndKey(
        mockApiRoot as any,
        'test-project',
        params
      );

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

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        updateCustomObjectByContainerAndKey(
          mockApiRoot as any,
          'test-project',
          {
            container: 'test-container',
            key: 'test-key',
            version: 1,
            value: {},
          }
        )
      ).rejects.toThrow('Error updating custom object by container and key');
    });
  });

  describe('deleteCustomObjectByContainerAndKey', () => {
    it('should delete a custom object by container and key', async () => {
      const params = {
        container: 'test-container',
        key: 'test-key',
        version: 1,
        dataErasure: true,
      };

      await deleteCustomObjectByContainerAndKey(
        mockApiRoot as any,
        'test-project',
        params
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomObjects).toHaveBeenCalled();
      expect(mockWithContainerAndKey).toHaveBeenCalledWith({
        container: 'test-container',
        key: 'test-key',
      });
      expect(mockDelete).toHaveBeenCalledWith({
        queryArgs: {
          version: 1,
          dataErasure: true,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        deleteCustomObjectByContainerAndKey(
          mockApiRoot as any,
          'test-project',
          {
            container: 'test-container',
            key: 'test-key',
            version: 1,
          }
        )
      ).rejects.toThrow('Error deleting custom object by container and key');
    });
  });
});

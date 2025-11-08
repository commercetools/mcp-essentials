import {
  readTypeById,
  readTypeByKey,
  queryTypes,
  createType,
  updateTypeById,
  updateTypeByKey,
} from '../base.functions';

// Mock the ApiRoot
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
const mockTypes = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  types: mockTypes,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Types Base Functions', () => {
  describe('readTypeById', () => {
    it('should read a type by ID', async () => {
      const params = {
        id: 'test-id',
        expand: ['fieldDefinitions[*].type'],
      };

      await readTypeById(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['fieldDefinitions[*].type'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readTypeById(mockApiRoot as any, 'test-project', {
          id: 'test-id',
        })
      ).rejects.toThrow('Error reading type by ID');
    });
  });

  describe('readTypeByKey', () => {
    it('should read a type by key', async () => {
      const params = {
        key: 'test-key',
        expand: ['fieldDefinitions[*].type'],
      };

      await readTypeByKey(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['fieldDefinitions[*].type'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readTypeByKey(mockApiRoot as any, 'test-project', {
          key: 'test-key',
        })
      ).rejects.toThrow('Error reading type by key');
    });
  });

  describe('queryTypes', () => {
    it('should query types', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['key="test-type"'],
        expand: ['fieldDefinitions[*].type'],
      };

      await queryTypes(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['key="test-type"'],
          expand: ['fieldDefinitions[*].type'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      const errlog = console.error;
      console.error = () => {}; // temporarily override native log fn

      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        queryTypes(mockApiRoot as any, 'test-project', {})
      ).rejects.toThrow('API error');
      console.error = errlog; // restore native log fn
    });
  });

  describe('createType', () => {
    it('should create a type', async () => {
      const params = {
        key: 'test-type-key',
        name: 'Test Type',
        description: 'Test Description',
        resourceTypeIds: ['product', 'category'],
        fieldDefinitions: [
          {
            name: 'customField',
            label: {
              en: 'Custom Field',
            },
            type: {
              name: 'String',
            },
          },
        ],
      };

      await createType(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'test-type-key',
          name: 'Test Type',
          description: 'Test Description',
          resourceTypeIds: ['product', 'category'],
          fieldDefinitions: [
            {
              name: 'customField',
              label: {
                en: 'Custom Field',
              },
              type: {
                name: 'String',
              },
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        createType(mockApiRoot as any, 'test-project', {
          key: 'test-type-key',
          name: 'Test Type',
          resourceTypeIds: ['product'],
        })
      ).rejects.toThrow('Error creating type');
    });
  });

  describe('updateTypeById', () => {
    it('should update a type by ID', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Type Name',
          },
        ],
      };

      await updateTypeById(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: 'Updated Type Name',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        updateTypeById(mockApiRoot as any, 'test-project', {
          id: 'test-id',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Error updating type by ID');
    });
  });

  describe('updateTypeByKey', () => {
    it('should update a type by key', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'addFieldDefinition',
            fieldDefinition: {
              name: 'newField',
              label: {
                en: 'New Field',
              },
              type: {
                name: 'String',
              },
            },
          },
        ],
      };

      await updateTypeByKey(mockApiRoot as any, 'test-project', params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'addFieldDefinition',
              fieldDefinition: {
                name: 'newField',
                label: {
                  en: 'New Field',
                },
                type: {
                  name: 'String',
                },
              },
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        updateTypeByKey(mockApiRoot as any, 'test-project', {
          key: 'test-key',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Error updating type by key');
    });
  });
});

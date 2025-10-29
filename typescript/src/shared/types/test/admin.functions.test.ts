import {readType, createType, updateType} from '../admin.functions';

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

// Mock context
const mockContext = {
  projectKey: 'test-project',
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Types Admin Functions', () => {
  describe('readType', () => {
    it('should read a type by ID', async () => {
      const params = {
        id: 'test-id',
        expand: ['fieldDefinitions[*].type'],
      };

      await readType(mockApiRoot as any, mockContext, params);

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

    it('should read a type by key', async () => {
      const params = {
        key: 'test-key',
        expand: ['fieldDefinitions[*].type'],
      };

      await readType(mockApiRoot as any, mockContext, params);

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

    it('should query types when neither id nor key is provided', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['key="test-type"'],
        expand: ['fieldDefinitions[*].type'],
      };

      await readType(mockApiRoot as any, mockContext, params);

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
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        readType(mockApiRoot as any, mockContext, {
          id: 'test-id',
        })
      ).rejects.toThrow('Error reading type');
    });
  });

  describe('createType', () => {
    it('should create a type', async () => {
      const params = {
        key: 'test-type-key',
        name: 'Test Type',
        resourceTypeIds: ['product'],
      };

      await createType(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockTypes).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'test-type-key',
          name: 'Test Type',
          description: undefined,
          resourceTypeIds: ['product'],
          fieldDefinitions: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateType', () => {
    it('should update a type by ID', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: 'Updated Type Name',
          },
        ],
      };

      await updateType(mockApiRoot as any, mockContext, params);

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

    it('should update a type by key', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'addFieldDefinition' as const,
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

      await updateType(mockApiRoot as any, mockContext, params);

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

    it('should throw an error if neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'changeName' as const,
            name: 'Updated Name',
          },
        ],
      };

      try {
        await updateType(mockApiRoot as any, mockContext, params as any);
        // Should not get here if error is thrown correctly
        fail('Expected updateType to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Either id or key must be provided');
      }
    });

    it('should handle errors properly', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API error'));

      await expect(
        updateType(mockApiRoot as any, mockContext, {
          id: 'test-id',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Error updating type');
    });
  });
});

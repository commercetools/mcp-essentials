import {
  readProject,
  updateProject,
  contextToProjectFunctionMapping,
} from '../functions';
import * as admin from '../admin.functions';
import {Context, CommercetoolsFuncContext} from '../../../types/configuration';
import {updateProjectParameters} from '../parameters';
import {z} from 'zod';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

describe('Project functions', () => {
  let mockApiRoot: any;
  let mockContext: CommercetoolsFuncContext;
  let mockExecute: jest.Mock;
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;
  let mockWithProjectKey: jest.Mock;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockGet = jest.fn().mockReturnValue({execute: mockExecute});
    mockPost = jest.fn().mockReturnValue({execute: mockExecute});
    mockWithProjectKey = jest.fn().mockReturnValue({
      get: mockGet,
      post: mockPost,
    });

    mockApiRoot = {
      withProjectKey: mockWithProjectKey,
    };

    mockContext = {
      projectKey: 'test-project',
    };

    mockExecute.mockResolvedValue({
      body: {
        key: 'test-project',
        name: 'Test Project',
        countries: ['US', 'DE'],
        currencies: ['USD', 'EUR'],
        languages: ['en', 'de'],
        version: 1,
      },
    });
  });

  describe('contextToProjectFunctionMapping', () => {
    it('should return admin functions when context has isAdmin flag', () => {
      const context: Context = {
        isAdmin: true,
      };
      const mapping = contextToProjectFunctionMapping(context);

      expect(mapping).toEqual({
        read_project: admin.readProject,
        update_project: admin.updateProject,
      });
    });

    it('should return read only when no context is provided', () => {
      const mapping = contextToProjectFunctionMapping();
      expect(mapping).toEqual({read_project: admin.readProject});
    });

    it('should return empty object when context does not have isAdmin set to true', () => {
      const context: Context = {};
      const mapping = contextToProjectFunctionMapping(context);
      expect(mapping).toEqual({read_project: admin.readProject});
    });
  });

  describe('readProject', () => {
    it('should read project information', async () => {
      const params = {};
      const result = await readProject(mockApiRoot, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();

      expect(result).toEqual({
        key: 'test-project',
        name: 'Test Project',
        countries: ['US', 'DE'],
        currencies: ['USD', 'EUR'],
        languages: ['en', 'de'],
        version: 1,
      });
    });

    it('should use provided projectKey if available', async () => {
      const params = {projectKey: 'custom-project'};
      await readProject(mockApiRoot, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'custom-project',
      });
    });

    it('should throw an error when API request fails', async () => {
      const error = new Error('API Error') as ErrorWithStatusCode;
      error.statusCode = 404;
      mockExecute.mockRejectedValue(error);

      const params = {};
      await expect(
        readProject(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to read project');
    });
  });

  describe('updateProject', () => {
    it('should update project settings', async () => {
      const params: z.infer<typeof updateProjectParameters> = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Project Name',
          },
        ],
      };

      mockExecute.mockResolvedValueOnce({
        body: {
          key: 'test-project',
          name: 'Updated Project Name',
          countries: ['US', 'DE'],
          currencies: ['USD', 'EUR'],
          languages: ['en', 'de'],
          version: 2,
        },
      });

      const result = await updateProject(mockApiRoot, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: 'Updated Project Name',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();

      expect(result).toEqual({
        key: 'test-project',
        name: 'Updated Project Name',
        countries: ['US', 'DE'],
        currencies: ['USD', 'EUR'],
        languages: ['en', 'de'],
        version: 2,
      });
    });

    it('should auto-fetch version when not provided', async () => {
      // First mock response for readProjectBase (to get version)
      mockExecute.mockResolvedValueOnce({
        body: {
          key: 'test-project',
          name: 'Test Project',
          countries: ['US', 'DE'],
          currencies: ['USD', 'EUR'],
          languages: ['en', 'de'],
          version: 3,
        },
      });

      // Then mock response for the update operation
      mockExecute.mockResolvedValueOnce({
        body: {
          key: 'test-project',
          name: 'Updated Project Name',
          countries: ['US', 'DE'],
          currencies: ['USD', 'EUR'],
          languages: ['en', 'de'],
          version: 4,
        },
      });

      const params: z.infer<typeof updateProjectParameters> = {
        actions: [
          {
            action: 'changeName',
            name: 'Updated Project Name',
          },
        ],
      };

      const result = await updateProject(mockApiRoot, mockContext, params);

      // Should first call get() to fetch version
      expect(mockGet).toHaveBeenCalled();

      // Then should call post() with the fetched version
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 3,
          actions: [
            {
              action: 'changeName',
              name: 'Updated Project Name',
            },
          ],
        },
      });

      expect(result).toEqual({
        key: 'test-project',
        name: 'Updated Project Name',
        countries: ['US', 'DE'],
        currencies: ['USD', 'EUR'],
        languages: ['en', 'de'],
        version: 4,
      });
    });

    it('should use provided projectKey if available', async () => {
      const params: z.infer<typeof updateProjectParameters> = {
        projectKey: 'custom-project',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Project Name',
          },
        ],
      };

      await updateProject(mockApiRoot, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'custom-project',
      });
    });

    it('should throw an error when actions are not provided', async () => {
      const params = {
        version: 1,
      } as any;

      // We expect exactly one assertion to be called
      expect.assertions(1);

      try {
        await updateProject(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should throw an error when actions array is empty', async () => {
      const params: z.infer<typeof updateProjectParameters> = {
        version: 1,
        actions: [],
      };

      // We expect exactly one assertion to be called
      expect.assertions(1);

      try {
        await updateProject(mockApiRoot, mockContext, params);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should throw an error when API request fails', async () => {
      const error = new Error('API Error') as ErrorWithStatusCode;
      error.statusCode = 400;
      mockExecute.mockRejectedValueOnce(error);

      const params: z.infer<typeof updateProjectParameters> = {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Project Name',
          },
        ],
      };

      await expect(
        updateProject(mockApiRoot, mockContext, params)
      ).rejects.toThrow('Failed to update project');
    });
  });
});

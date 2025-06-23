import {
  getCustomerGroupById,
  getCustomerGroupByKey,
  queryCustomerGroups,
  createCustomerGroup,
  updateCustomerGroupById,
  updateCustomerGroupByKey,
  CustomerGroupUpdateAction,
} from '../functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {customerGroupResourceIdentifierSchema} from '../parameters';
import {z} from 'zod';
import {contextToCustomerGroupTools} from '../tools';

// Mock ApiRoot for testing
const mockExecute = jest.fn();
const mockGet = jest.fn(() => ({execute: mockExecute}));
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockWithId = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockWithKey = jest.fn(() => ({get: mockGet, post: mockPost}));
const mockCustomerGroups = jest.fn(() => ({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
}));
const mockWithProjectKey = jest.fn(() => ({
  customerGroups: mockCustomerGroups,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

describe('CustomerGroup Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomerGroupById', () => {
    it('should fetch a customer group by ID', async () => {
      const mockResponse = {
        body: {id: 'group-id', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupById(mockApiRoot, mockContext, {
        id: 'group-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should fetch a customer group by ID with expansions', async () => {
      const mockResponse = {
        body: {id: 'group-id', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupById(mockApiRoot, mockContext, {
        id: 'group-id',
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('getCustomerGroupByKey', () => {
    it('should fetch a customer group by key', async () => {
      const mockResponse = {
        body: {id: 'group-id', key: 'group-key', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupByKey(mockApiRoot, mockContext, {
        key: 'group-key',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should fetch a customer group by key with expansions', async () => {
      const mockResponse = {
        body: {id: 'group-id', key: 'group-key', name: 'Test Group'},
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await getCustomerGroupByKey(mockApiRoot, mockContext, {
        key: 'group-key',
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('queryCustomerGroups', () => {
    it('should query customer groups', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'group-1', name: 'Group 1'},
            {id: 'group-2', name: 'Group 2'},
          ],
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await queryCustomerGroups(mockApiRoot, mockContext, {
        where: ['name="Group 1"'],
        sort: ['name asc'],
        limit: 10,
        offset: 0,
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['name="Group 1"'],
          sort: ['name asc'],
          limit: 10,
          offset: 0,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });

    it('should query customer groups with expand parameter', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'group-1', name: 'Group 1', custom: {type: {id: 'type-id'}}},
          ],
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const result = await queryCustomerGroups(mockApiRoot, mockContext, {
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('createCustomerGroup', () => {
    it('should create a customer group', async () => {
      const mockResponse = {
        body: {
          id: 'new-group-id',
          name: 'New Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const parameters = {
        groupName: 'New Group',
        key: 'new-group',
      };

      const result = await createCustomerGroup(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: parameters,
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateCustomerGroupById', () => {
    it('should update a customer group by ID', async () => {
      const mockResponse = {
        body: {
          id: 'group-id',
          version: 2,
          name: 'Updated Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const actions: CustomerGroupUpdateAction[] = [
        {
          action: 'changeName',
          name: 'Updated Group',
        },
      ];

      const parameters = {
        id: 'group-id',
        version: 1,
        actions,
      };

      const result = await updateCustomerGroupById(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('updateCustomerGroupByKey', () => {
    it('should update a customer group by key', async () => {
      const mockResponse = {
        body: {
          id: 'group-id',
          key: 'group-key',
          version: 2,
          name: 'Updated Group',
        },
      };
      mockExecute.mockResolvedValueOnce(mockResponse);

      const actions: CustomerGroupUpdateAction[] = [
        {
          action: 'changeName',
          name: 'Updated Group',
        },
      ];

      const parameters = {
        key: 'group-key',
        version: 1,
        actions,
      };

      const result = await updateCustomerGroupByKey(
        mockApiRoot,
        mockContext,
        parameters
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.body);
    });
  });

  describe('Error handling', () => {
    it('should throw an error when getCustomerGroupById fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        getCustomerGroupById(mockApiRoot, mockContext, {id: 'group-id'})
      ).rejects.toThrow('Error fetching customer group by ID');
    });

    it('should throw an error when getCustomerGroupByKey fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        getCustomerGroupByKey(mockApiRoot, mockContext, {key: 'group-key'})
      ).rejects.toThrow('Error fetching customer group by key');
    });

    it('should throw an error when queryCustomerGroups fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        queryCustomerGroups(mockApiRoot, mockContext, {})
      ).rejects.toThrow('Error querying customer groups');
    });

    it('should throw an error when createCustomerGroup fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        createCustomerGroup(mockApiRoot, mockContext, {groupName: 'New Group'})
      ).rejects.toThrow('Error creating customer group');
    });

    it('should throw an error when updateCustomerGroupById fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        updateCustomerGroupById(mockApiRoot, mockContext, {
          id: 'group-id',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Error updating customer group by ID');
    });

    it('should throw an error when updateCustomerGroupByKey fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        updateCustomerGroupByKey(mockApiRoot, mockContext, {
          key: 'group-key',
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Error updating customer group by key');
    });
  });

  describe('getCustomerGroup', () => {
    it('should call getCustomerGroupById if id is provided', async () => {
      const mockResponse = {body: {id: 'group-id'}};
      mockExecute.mockResolvedValueOnce(mockResponse);
      // Use the actual getCustomerGroup from functions.ts for this meta-test
      const {getCustomerGroup} = jest.requireActual('../functions');

      await getCustomerGroup(mockApiRoot, mockContext, {id: 'group-id'});
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should call getCustomerGroupByKey if key is provided', async () => {
      const mockResponse = {body: {key: 'group-key'}};
      mockExecute.mockResolvedValueOnce(mockResponse);
      const {getCustomerGroup} = jest.requireActual('../functions');

      await getCustomerGroup(mockApiRoot, mockContext, {key: 'group-key'});
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockGet).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should call queryCustomerGroups if neither id nor key is provided', async () => {
      const mockResponse = {body: {results: []}};
      mockExecute.mockResolvedValueOnce(mockResponse);
      const {getCustomerGroup} = jest.requireActual('../functions');

      await getCustomerGroup(mockApiRoot, mockContext, {limit: 5});
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      // queryCustomerGroups directly calls .get() on customerGroups()
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {limit: 5}});
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateCustomerGroup', () => {
    it('should call updateCustomerGroupById if id is provided', async () => {
      const mockResponse = {body: {id: 'group-id', version: 2}};
      mockExecute.mockResolvedValueOnce(mockResponse);
      const {updateCustomerGroup} = jest.requireActual('../functions');
      const params = {
        id: 'group-id',
        version: 1,
        actions: [{action: 'changeName', name: 'new name'}],
      };

      await updateCustomerGroup(mockApiRoot, mockContext, params);
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'group-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: 1, actions: params.actions},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should call updateCustomerGroupByKey if key is provided', async () => {
      const mockResponse = {body: {key: 'group-key', version: 2}};
      mockExecute.mockResolvedValueOnce(mockResponse);
      const {updateCustomerGroup} = jest.requireActual('../functions');
      const params = {
        key: 'group-key',
        version: 1,
        actions: [{action: 'changeName', name: 'new name'}],
      };

      await updateCustomerGroup(mockApiRoot, mockContext, params);
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomerGroups).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'group-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {version: 1, actions: params.actions},
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error if neither id nor key is provided', () => {
      const {updateCustomerGroup} = jest.requireActual('../functions');
      const params = {
        version: 1,
        actions: [{action: 'changeName', name: 'new name'}],
      };

      expect(() =>
        updateCustomerGroup(mockApiRoot, mockContext, params)
      ).toThrow('Either id or key must be provided to update a customer group');
    });
  });

  describe('Schema Validations: parameters.ts', () => {
    describe('customerGroupResourceIdentifierSchema', () => {
      it('should fail validation if neither id nor key is provided', () => {
        const result = customerGroupResourceIdentifierSchema.safeParse({
          typeId: 'customer-group',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          // Check for the specific refine error message
          const formErrors = result.error.formErrors.fieldErrors;
          // Zod nests refine errors under _errors array for the object itself
          expect(result.error.errors[0].message).toBe(
            'Either id or key must be provided'
          );
        }
      });

      it('should pass validation if id is provided', () => {
        const result = customerGroupResourceIdentifierSchema.safeParse({
          typeId: 'customer-group',
          id: 'test-id',
        });
        expect(result.success).toBe(true);
      });

      it('should pass validation if key is provided', () => {
        const result = customerGroupResourceIdentifierSchema.safeParse({
          typeId: 'customer-group',
          key: 'test-key',
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Schema Validations: tools.ts', () => {
    // Find the updateCustomerGroupParameters schema from the imported tools array
    const updateToolSchema = contextToCustomerGroupTools({isAdmin: true}).find(
      (tool) => tool.method === 'update_customer_group'
    )?.parameters;

    if (updateToolSchema) {
      describe('updateCustomerGroupParameters (from tools.ts)', () => {
        it('should fail validation if neither id nor key is provided', () => {
          const result = (updateToolSchema as z.ZodSchema<any>).safeParse({
            version: 1,
            actions: [{action: 'changeName', name: 'new name'}],
          });
          expect(result.success).toBe(false);
          if (!result.success) {
            const formErrors = result.error.formErrors.fieldErrors;
            expect(result.error.errors[0].message).toBe(
              'Either id or key must be provided'
            );
          }
        });

        it('should pass validation if id is provided', () => {
          const result = (updateToolSchema as z.ZodSchema<any>).safeParse({
            id: 'test-id',
            version: 1,
            actions: [{action: 'changeName', name: 'new name'}],
          });
          expect(result.success).toBe(true);
        });

        it('should pass validation if key is provided', () => {
          const result = (updateToolSchema as z.ZodSchema<any>).safeParse({
            key: 'test-key',
            version: 1,
            actions: [{action: 'changeName', name: 'new name'}],
          });
          expect(result.success).toBe(true);
        });
      });
    } else {
      it.skip('updateCustomerGroupParameters schema not found in tools.ts export', () => {
        // This test will be skipped if the schema isn't found, alerting to a potential issue.
      });
    }
  });
});

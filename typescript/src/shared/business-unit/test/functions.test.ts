import {
  readBusinessUnit as readBusinessUnitAdmin,
  createBusinessUnit as createBusinessUnitAdmin,
  updateBusinessUnit as updateBusinessUnitAdmin,
} from '../admin.functions';
import {
  readBusinessUnit as readBusinessUnitStore,
  createBusinessUnit as createBusinessUnitStore,
  updateBusinessUnit as updateBusinessUnitStore,
} from '../store.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock the API Root
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockExecute = jest.fn();
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
  post: mockPost.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
  post: mockPost.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockBusinessUnits = jest.fn().mockReturnValue({
  withId: mockWithId,
  withKey: mockWithKey,
  get: mockGet.mockReturnValue({
    execute: mockExecute,
  }),
  post: mockPost.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  businessUnits: mockBusinessUnits,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  businessUnits: mockBusinessUnits,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

describe('Business Unit Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin Functions', () => {
    describe('readBusinessUnit', () => {
      it('should read business unit by ID', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
          },
        });

        const result = await readBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          {id: 'bu-123'}
        );

        expect(mockWithProjectKey).toHaveBeenCalledWith({
          projectKey: 'test-project',
        });
        expect(mockBusinessUnits).toHaveBeenCalled();
        expect(mockWithId).toHaveBeenCalledWith({ID: 'bu-123'});
        expect(mockGet).toHaveBeenCalled();
        expect(result).toEqual({
          id: 'bu-123',
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company',
        });
      });

      it('should read business unit by key', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
          },
        });

        const result = await readBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          {key: 'test-bu'}
        );

        expect(mockWithKey).toHaveBeenCalledWith({key: 'test-bu'});
        expect(result).toEqual({
          id: 'bu-123',
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company',
        });
      });

      it('should query business units with where conditions', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            count: 1,
            results: [
              {
                id: 'bu-123',
                key: 'test-bu',
                name: 'Test BU',
                unitType: 'Company',
              },
            ],
          },
        });

        const result = await readBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          {where: ['status="Active"'], limit: 10}
        );

        expect(mockGet).toHaveBeenCalledWith({
          queryArgs: {
            where: ['status="Active"'],
            limit: 10,
          },
        });
        expect(result).toEqual({
          count: 1,
          results: [
            {
              id: 'bu-123',
              key: 'test-bu',
              name: 'Test BU',
              unitType: 'Company',
            },
          ],
        });
      });

      it('should handle errors when reading business unit', async () => {
        mockExecute.mockRejectedValueOnce(new Error('API Error'));

        await expect(
          readBusinessUnitAdmin(
            mockApiRoot,
            {projectKey: 'test-project'},
            {id: 'bu-123'}
          )
        ).rejects.toThrow('Failed to read business unit');
      });
    });

    describe('createBusinessUnit', () => {
      it('should create business unit successfully', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
            version: 1,
          },
        });

        const businessUnitData = {
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company' as const,
        };

        const result = await createBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          businessUnitData
        );

        expect(mockPost).toHaveBeenCalledWith({
          body: businessUnitData,
        });
        expect(result).toEqual({
          id: 'bu-123',
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company',
          version: 1,
        });
      });

      it('should create business unit with store key', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
            version: 1,
          },
        });

        const businessUnitData = {
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company' as const,
          storeKey: 'test-store',
        };

        await createBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          businessUnitData
        );

        expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
          storeKey: 'test-store',
        });
      });

      it('should handle errors when creating business unit', async () => {
        mockExecute.mockRejectedValueOnce(new Error('API Error'));

        await expect(
          createBusinessUnitAdmin(
            mockApiRoot,
            {projectKey: 'test-project'},
            {key: 'test-bu', name: 'Test BU', unitType: 'Company'}
          )
        ).rejects.toThrow('Failed to create business unit');
      });
    });

    describe('updateBusinessUnit', () => {
      it('should update business unit by ID', async () => {
        // Mock reading business unit for version
        mockExecute.mockResolvedValueOnce({
          body: {id: 'bu-123', version: 1},
        });
        // Mock update response
        mockExecute.mockResolvedValueOnce({
          body: {id: 'bu-123', version: 2, name: 'Updated BU'},
        });

        const result = await updateBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          {
            id: 'bu-123',
            actions: [{action: 'changeName', name: 'Updated BU'}],
          }
        );

        expect(result).toEqual({id: 'bu-123', version: 2, name: 'Updated BU'});
      });

      it('should update business unit by key', async () => {
        // Mock reading business unit for version
        mockExecute.mockResolvedValueOnce({
          body: {key: 'test-bu', version: 1},
        });
        // Mock update response
        mockExecute.mockResolvedValueOnce({
          body: {key: 'test-bu', version: 2, name: 'Updated BU'},
        });

        const result = await updateBusinessUnitAdmin(
          mockApiRoot,
          {projectKey: 'test-project'},
          {
            key: 'test-bu',
            actions: [{action: 'changeName', name: 'Updated BU'}],
          }
        );

        expect(result).toEqual({
          key: 'test-bu',
          version: 2,
          name: 'Updated BU',
        });
      });

      it('should throw error when neither id nor key is provided', async () => {
        await expect(
          updateBusinessUnitAdmin(
            mockApiRoot,
            {projectKey: 'test-project'},
            {
              actions: [{action: 'changeName', name: 'Updated BU'}],
            }
          )
        ).rejects.toThrow('Failed to update business unit');
      });
    });
  });

  describe('Store Functions', () => {
    describe('readBusinessUnit', () => {
      it('should read business unit by ID with store context', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
            storeMode: 'Explicit',
            stores: [{key: 'test-store', typeId: 'store'}],
          },
        });

        const result = await readBusinessUnitStore(
          mockApiRoot,
          {projectKey: 'test-project', storeKey: 'test-store'},
          {id: 'bu-123'}
        );

        expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
          storeKey: 'test-store',
        });
        expect(result).toEqual({
          id: 'bu-123',
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company',
          storeMode: 'Explicit',
          stores: [{key: 'test-store', typeId: 'store'}],
        });
      });

      it('should throw error when store key is not provided', async () => {
        await expect(
          readBusinessUnitStore(
            mockApiRoot,
            {projectKey: 'test-project'},
            {id: 'bu-123'}
          )
        ).rejects.toThrow('Failed to read business unit');
      });

      it('should query business units in store context', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            count: 1,
            results: [
              {
                id: 'bu-123',
                key: 'test-bu',
                name: 'Test BU',
                unitType: 'Company',
              },
            ],
          },
        });

        const result = await readBusinessUnitStore(
          mockApiRoot,
          {projectKey: 'test-project', storeKey: 'test-store'},
          {where: ['status="Active"']}
        );

        expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
          storeKey: 'test-store',
        });
        expect(result).toEqual({
          count: 1,
          results: [
            {
              id: 'bu-123',
              key: 'test-bu',
              name: 'Test BU',
              unitType: 'Company',
            },
          ],
        });
      });
    });

    describe('createBusinessUnit', () => {
      it('should create business unit with store association', async () => {
        mockExecute.mockResolvedValueOnce({
          body: {
            id: 'bu-123',
            key: 'test-bu',
            name: 'Test BU',
            unitType: 'Company',
            stores: [{key: 'test-store', typeId: 'store'}],
            storeMode: 'Explicit',
            version: 1,
          },
        });

        const businessUnitData = {
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company' as const,
        };

        const result = await createBusinessUnitStore(
          mockApiRoot,
          {projectKey: 'test-project', storeKey: 'test-store'},
          businessUnitData
        );

        expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
          storeKey: 'test-store',
        });
        expect(result).toEqual({
          id: 'bu-123',
          key: 'test-bu',
          name: 'Test BU',
          unitType: 'Company',
          stores: [{key: 'test-store', typeId: 'store'}],
          storeMode: 'Explicit',
          version: 1,
        });
      });

      it('should throw error when store key is not provided for creation', async () => {
        await expect(
          createBusinessUnitStore(
            mockApiRoot,
            {projectKey: 'test-project'},
            {key: 'test-bu', name: 'Test BU', unitType: 'Company'}
          )
        ).rejects.toThrow('Failed to create business unit');
      });
    });

    describe('updateBusinessUnit', () => {
      it('should update business unit with store context', async () => {
        // Mock reading business unit for version
        mockExecute.mockResolvedValueOnce({
          body: {id: 'bu-123', version: 1},
        });
        // Mock update response
        mockExecute.mockResolvedValueOnce({
          body: {id: 'bu-123', version: 2, name: 'Updated BU'},
        });

        const result = await updateBusinessUnitStore(
          mockApiRoot,
          {projectKey: 'test-project', storeKey: 'test-store'},
          {
            id: 'bu-123',
            actions: [{action: 'changeName', name: 'Updated BU'}],
          }
        );

        expect(result).toEqual({id: 'bu-123', version: 2, name: 'Updated BU'});
      });

      it('should throw error when store key is not provided for update', async () => {
        await expect(
          updateBusinessUnitStore(
            mockApiRoot,
            {projectKey: 'test-project'},
            {
              id: 'bu-123',
              actions: [{action: 'changeName', name: 'Updated BU'}],
            }
          )
        ).rejects.toThrow('Failed to update business unit');
      });
    });
  });
});

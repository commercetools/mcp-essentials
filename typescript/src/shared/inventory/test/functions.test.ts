import {readInventory, createInventory, updateInventory} from '../functions';

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
const mockInventory = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  inventory: mockInventory,
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

describe('Inventory Functions', () => {
  describe('readInventory', () => {
    it('should list inventory entries when no id or key is provided', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['sku="ABC123"'],
        expand: ['supplyChannel'],
      };

      await readInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['sku="ABC123"'],
          expand: ['supplyChannel'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should get a specific inventory entry by ID when id is provided', async () => {
      const params = {
        id: 'test-id',
        expand: ['supplyChannel'],
      };

      await readInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['supplyChannel'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should get a specific inventory entry by key when key is provided', async () => {
      const params = {
        key: 'test-key',
        expand: ['supplyChannel'],
      };

      await readInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['supplyChannel'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      const errlog = console.error;
      console.error = () => {}; // temporarily override native log fn

      mockExecute.mockRejectedValueOnce(new Error('API error'));
      const params = {limit: 10};

      await expect(
        readInventory(mockApiRoot as any, mockContext, params)
      ).rejects.toThrow('API error');
      console.error = errlog; // restore native log fn
    });
  });

  describe('createInventory', () => {
    it('should call the inventory endpoint with correct body', async () => {
      const params = {
        key: 'test-key',
        sku: 'test-sku',
        quantityOnStock: 100,
        restockableInDays: 7,
      };

      await createInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'test-key',
          sku: 'test-sku',
          quantityOnStock: 100,
          restockableInDays: 7,
          supplyChannel: undefined,
          expectedDelivery: undefined,
          custom: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateInventory', () => {
    it('should update an inventory entry by ID', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'addQuantity' as const,
            quantity: 10,
          },
        ],
      };

      await updateInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'addQuantity',
              quantity: 10,
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update an inventory entry by key', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'changeQuantity' as const,
            quantity: 50,
          },
        ],
      };

      await updateInventory(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInventory).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeQuantity',
              quantity: 50,
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
            action: 'addQuantity' as const,
            quantity: 10,
          },
        ],
      };

      try {
        await updateInventory(mockApiRoot as any, mockContext, params as any);
        // Should not get here if error is thrown correctly
        fail('Expected updateInventory to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Either id or key must be provided');
      }
    });
  });
});

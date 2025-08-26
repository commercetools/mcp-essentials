import {
  ApiRoot,
  CustomerDraft,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import {
  readCustomerById,
  queryCustomers,
  createCustomer,
  updateCustomer,
} from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the commercetools platform SDK
const mockExecute = jest.fn();
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockCustomers = jest.fn().mockReturnValue({
  withId: mockWithId,
  get: mockGet,
  post: mockPost,
});
const mockInStoreKeyWithStoreKeyValue = jest.fn().mockReturnValue({
  customers: mockCustomers,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  customers: mockCustomers,
  inStoreKeyWithStoreKeyValue: mockInStoreKeyWithStoreKeyValue,
});

const mockApiRoot: ApiRoot = {
  withProjectKey: mockWithProjectKey,
} as any;

describe('Customer Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readCustomerById', () => {
    it('should read customer by ID without storeKey', async () => {
      const mockCustomer = {
        id: 'customer-123',
        email: 'test@example.com',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockCustomer});

      const result = await readCustomerById(
        mockApiRoot,
        'test-project',
        'customer-123'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should read customer by ID with storeKey', async () => {
      const mockCustomer = {
        id: 'customer-123',
        email: 'test@example.com',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockCustomer});

      const result = await readCustomerById(
        mockApiRoot,
        'test-project',
        'customer-123',
        undefined,
        'test-store'
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'customer-123'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should read customer by ID with expand parameter', async () => {
      const mockCustomer = {
        id: 'customer-123',
        email: 'test@example.com',
        version: 1,
      };
      mockExecute.mockResolvedValue({body: mockCustomer});

      const result = await readCustomerById(
        mockApiRoot,
        'test-project',
        'customer-123',
        ['customerGroup']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customerGroup'],
        },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should handle errors when reading customer by ID', async () => {
      const mockError = new Error('Customer not found');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        readCustomerById(mockApiRoot, 'test-project', 'customer-123')
      ).rejects.toThrow(SDKError);

      try {
        await readCustomerById(mockApiRoot, 'test-project', 'customer-123');
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to read customer by ID: Customer not found'
        );
      }
    });
  });

  describe('queryCustomers', () => {
    it('should query customers with minimal parameters', async () => {
      const mockCustomersResponse = {
        results: [
          {
            id: 'customer-123',
            email: 'test@example.com',
            version: 1,
          },
        ],
        total: 1,
        count: 1,
        offset: 0,
        limit: 10,
      };
      mockExecute.mockResolvedValue({body: mockCustomersResponse});

      const result = await queryCustomers(mockApiRoot, 'test-project');

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
        },
      });
      expect(result).toEqual(mockCustomersResponse);
    });

    it('should query customers with all parameters', async () => {
      const mockCustomersResponse = {
        results: [],
        total: 0,
        count: 0,
        offset: 20,
        limit: 50,
      };
      mockExecute.mockResolvedValue({body: mockCustomersResponse});

      const result = await queryCustomers(
        mockApiRoot,
        'test-project',
        50,
        20,
        ['email asc', 'createdAt desc'],
        ['email="test@example.com"'],
        ['customerGroup'],
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 50,
          offset: 20,
          sort: ['email asc', 'createdAt desc'],
          where: ['email="test@example.com"'],
          expand: ['customerGroup'],
        },
      });
      expect(result).toEqual(mockCustomersResponse);
    });

    it('should query customers without storeKey', async () => {
      const mockCustomersResponse = {
        results: [],
        total: 0,
        count: 0,
        offset: 0,
        limit: 10,
      };
      mockExecute.mockResolvedValue({body: mockCustomersResponse});

      const result = await queryCustomers(
        mockApiRoot,
        'test-project',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockInStoreKeyWithStoreKeyValue).not.toHaveBeenCalled();
      expect(result).toEqual(mockCustomersResponse);
    });

    it('should handle errors when querying customers', async () => {
      const mockError = new Error('Query failed');
      mockExecute.mockRejectedValue(mockError);

      await expect(queryCustomers(mockApiRoot, 'test-project')).rejects.toThrow(
        SDKError
      );

      try {
        await queryCustomers(mockApiRoot, 'test-project');
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to query customers: Query failed'
        );
      }
    });
  });

  describe('createCustomer', () => {
    it('should create customer without storeKey', async () => {
      const customerDraft: CustomerDraft = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockCreatedCustomer = {
        customer: {
          id: 'customer-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          version: 1,
        },
      };
      mockExecute.mockResolvedValue({body: mockCreatedCustomer});

      const result = await createCustomer(
        mockApiRoot,
        'test-project',
        customerDraft
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: customerDraft,
      });
      expect(result).toEqual(mockCreatedCustomer);
    });

    it('should create customer with storeKey', async () => {
      const customerDraft: CustomerDraft = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockCreatedCustomer = {
        customer: {
          id: 'customer-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          version: 1,
        },
      };
      mockExecute.mockResolvedValue({body: mockCreatedCustomer});

      const result = await createCustomer(
        mockApiRoot,
        'test-project',
        customerDraft,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockCustomers).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: customerDraft,
      });
      expect(result).toEqual(mockCreatedCustomer);
    });

    it('should handle errors when creating customer', async () => {
      const customerDraft: CustomerDraft = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockError = new Error('Creation failed');
      mockExecute.mockRejectedValue(mockError);

      await expect(
        createCustomer(mockApiRoot, 'test-project', customerDraft)
      ).rejects.toThrow(SDKError);

      try {
        await createCustomer(mockApiRoot, 'test-project', customerDraft);
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to create customer: Creation failed'
        );
      }
    });
  });

  describe('updateCustomer', () => {
    beforeEach(() => {
      // Mock readCustomerById for updateCustomer function
      const mockCustomer = {
        id: 'customer-123',
        email: 'test@example.com',
        version: 2,
      };
      mockExecute.mockResolvedValueOnce({body: mockCustomer}); // First call for readCustomerById
    });

    it('should update customer without storeKey', async () => {
      const actions: CustomerUpdateAction[] = [
        {
          action: 'changeEmail',
          email: 'newemail@example.com',
        },
      ];
      const mockUpdatedCustomer = {
        id: 'customer-123',
        email: 'newemail@example.com',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedCustomer}); // Second call for update

      const result = await updateCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        1,
        actions
      );

      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readCustomerById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedCustomer);
    });

    it('should update customer with storeKey', async () => {
      const actions: CustomerUpdateAction[] = [
        {
          action: 'setFirstName',
          firstName: 'Jane',
        },
      ];
      const mockUpdatedCustomer = {
        id: 'customer-123',
        firstName: 'Jane',
        version: 3,
      };
      mockExecute.mockResolvedValueOnce({body: mockUpdatedCustomer}); // Second call for update

      const result = await updateCustomer(
        mockApiRoot,
        'test-project',
        'customer-123',
        1,
        actions,
        'test-store'
      );

      expect(mockInStoreKeyWithStoreKeyValue).toHaveBeenCalledWith({
        storeKey: 'test-store',
      });
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 2, // Uses current version from readCustomerById
          actions,
        },
      });
      expect(result).toEqual(mockUpdatedCustomer);
    });

    it('should handle errors when updating customer', async () => {
      const actions: CustomerUpdateAction[] = [
        {
          action: 'changeEmail',
          email: 'newemail@example.com',
        },
      ];
      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError); // Second call for update

      await expect(
        updateCustomer(mockApiRoot, 'test-project', 'customer-123', 1, actions)
      ).rejects.toThrow(SDKError);

      try {
        await updateCustomer(
          mockApiRoot,
          'test-project',
          'customer-123',
          1,
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update customer: Failed to read customer by ID: Creation failed'
        );
      }
    });

    it('should handle errors when reading customer for update', async () => {
      // Reset mocks to simulate error in readCustomerById
      jest.clearAllMocks();
      const actions: CustomerUpdateAction[] = [
        {
          action: 'changeEmail',
          email: 'newemail@example.com',
        },
      ];
      const mockError = new Error('Customer not found');
      mockExecute.mockRejectedValue(mockError); // First call for readCustomerById

      await expect(
        updateCustomer(mockApiRoot, 'test-project', 'customer-123', 1, actions)
      ).rejects.toThrow(SDKError);

      try {
        await updateCustomer(
          mockApiRoot,
          'test-project',
          'customer-123',
          1,
          actions
        );
      } catch (error) {
        expect(error).toBeInstanceOf(SDKError);
        expect((error as SDKError).message).toBe(
          'Failed to update customer: Failed to read customer by ID: Customer not found'
        );
      }
    });
  });
});

import {z} from 'zod';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import * as baseFunctions from '../base.functions';
import {createCustomer, getCustomerById, updateCustomer} from '../functions';
import {readCustomerParameters} from '../parameters';
// Mock base functions
jest.mock('../base.functions', () => ({
  readCustomerById: jest.fn(),
  queryCustomers: jest.fn(),
  createCustomer: jest.fn(),
  updateCustomer: jest.fn(),
}));

// Mock ApiRoot
const mockExecute = jest.fn();
const mockCustomersGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockCustomersPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockCustomersWithIdGet = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockCustomersWithIdPost = jest
  .fn()
  .mockReturnValue({execute: mockExecute});

const mockCustomersWithId = jest.fn().mockReturnValue({
  get: mockCustomersWithIdGet,
  post: mockCustomersWithIdPost,
});

const mockCustomersCollection = jest.fn().mockReturnValue({
  post: mockCustomersPost,
  get: mockCustomersGet,
  withId: mockCustomersWithId,
});

const mockInStoreCustomersWithIdGet = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockInStoreCustomersWithId = jest.fn().mockReturnValue({
  get: mockInStoreCustomersWithIdGet,
});
const mockInStoreCustomersPost = jest
  .fn()
  .mockReturnValue({execute: mockExecute});
const mockInStoreCustomersCollection = jest.fn().mockReturnValue({
  post: mockInStoreCustomersPost,
  withId: mockInStoreCustomersWithId,
});

const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnValue({
    customers: mockCustomersCollection,
    inStoreKeyWithStoreKeyValue: jest.fn().mockReturnValue({
      customers: mockInStoreCustomersCollection,
    }),
  }),
};

describe('Customer Functions', () => {
  const adminContext: CommercetoolsFuncContext = {
    projectKey: 'test-project',
    isAdmin: true,
  };

  // Use a more specific type to ensure storeKey is required
  const storeContext: {projectKey: string; storeKey: string} = {
    projectKey: 'test-project',
    storeKey: 'store-key',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecute.mockReset();
    (baseFunctions.readCustomerById as jest.Mock).mockReset();
    (baseFunctions.updateCustomer as jest.Mock).mockReset();
    (baseFunctions.createCustomer as jest.Mock).mockReset();
    (baseFunctions.queryCustomers as jest.Mock).mockReset();
  });

  describe('createCustomer', () => {
    const params = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a customer successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      (baseFunctions.createCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await createCustomer(
        mockApiRoot as any,
        adminContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.createCustomer).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      (baseFunctions.createCustomer as jest.Mock).mockRejectedValueOnce(
        new Error('API error')
      );

      await expect(
        createCustomer(mockApiRoot as any, adminContext, params)
      ).rejects.toThrow('Failed to create customer');
      expect(mockExecute).toHaveBeenCalledTimes(0);
    });
  });

  describe('createCustomerInStore', () => {
    const baseParams = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a customer in store successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      (baseFunctions.createCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await createCustomer(
        mockApiRoot as any,
        storeContext,
        baseParams
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.createCustomer).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      (baseFunctions.createCustomer as jest.Mock).mockRejectedValueOnce(
        new Error('API error')
      );

      await expect(
        createCustomer(mockApiRoot as any, storeContext, baseParams)
      ).rejects.toThrow('Failed to create customer');
      expect(mockExecute).toHaveBeenCalledTimes(0);
    });
  });

  describe('getCustomerById', () => {
    const baseParams: z.infer<typeof readCustomerParameters> = {
      id: 'customer-id',
    };

    it('should get a customer by id successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
      };

      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await getCustomerById(
        mockApiRoot as any,
        adminContext,
        baseParams
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.readCustomerById).toHaveBeenCalled();
    });
  });

  describe('getCustomerInStoreById', () => {
    const params = {
      id: 'customer-id',
    };

    it('should get a customer in store by id successfully', async () => {
      const mockResponse = {
        id: 'customer-id',
        email: 'test@example.com',
      };

      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await getCustomerById(
        mockApiRoot as any,
        storeContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.readCustomerById).toHaveBeenCalled();
    });
  });

  describe('updateCustomer', () => {
    const params = {
      id: 'customer-id',
      version: 1,
      actions: [
        {
          action: 'setFirstName' as const,
          firstName: 'Jane',
        },
      ],
    };

    it('should update a customer successfully', async () => {
      const mockCustomer = {
        id: 'customer-id',
        version: 1,
      };

      const mockResponse = {
        id: 'customer-id',
        version: 2,
        firstName: 'Jane',
      };

      // Mock the readCustomerById call inside updateCustomer
      (baseFunctions.readCustomerById as jest.Mock).mockResolvedValueOnce(
        mockCustomer
      );
      (baseFunctions.updateCustomer as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await updateCustomer(
        mockApiRoot as any,
        adminContext,
        params
      );

      expect(result).toEqual(mockResponse);
      expect(baseFunctions.updateCustomer).toHaveBeenCalled();
    });
  });
});

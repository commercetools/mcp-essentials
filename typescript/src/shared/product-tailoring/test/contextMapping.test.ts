import {contextToProductTailoringFunctionMapping} from '../functions';

// Mock the function modules
jest.mock('../admin.functions', () => ({
  readProductTailoring: jest.fn(),
  createProductTailoring: jest.fn(),
  updateProductTailoring: jest.fn(),
}));

jest.mock('../customer.functions', () => ({
  readProductTailoring: jest.fn(),
  createProductTailoringEntry: jest.fn(),
  updateProductTailoring: jest.fn(),
}));

jest.mock('../store.functions', () => ({
  readProductTailoring: jest.fn(),
  createProductTailoring: jest.fn(),
  updateProductTailoring: jest.fn(),
}));

import * as adminFunctions from '../admin.functions';
import * as customerFunctions from '../customer.functions';
import * as storeFunctions from '../store.functions';

describe('Product Tailoring Context Mapping', () => {
  const mockApiRoot = {} as any;
  const mockContext = {
    projectKey: 'test-project',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin Context', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {...mockContext, isAdmin: true};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');

      // Verify that the functions are the admin functions
      expect(functions.readProductTailoring).toBe(
        adminFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        adminFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        adminFunctions.updateProductTailoring
      );
    });

    it('should return admin functions when isAdmin is true even with other context properties', () => {
      const context = {
        ...mockContext,
        isAdmin: true,
        storeKey: 'test-store',
        customerId: 'test-customer',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions.readProductTailoring).toBe(
        adminFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        adminFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        adminFunctions.updateProductTailoring
      );
    });
  });

  describe('Store Context', () => {
    it('should return store functions when storeKey is provided and isAdmin is false', () => {
      const context = {...mockContext, storeKey: 'test-store'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');

      // Verify that the functions are the store functions
      expect(functions.readProductTailoring).toBe(
        storeFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        storeFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        storeFunctions.updateProductTailoring
      );
    });

    it('should return store functions when storeKey is provided even with customerId', () => {
      const context = {
        ...mockContext,
        storeKey: 'test-store',
        customerId: 'test-customer',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions.readProductTailoring).toBe(
        storeFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        storeFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        storeFunctions.updateProductTailoring
      );
    });
  });

  describe('Customer Context', () => {
    it('should return customer functions when customerId is provided and isAdmin is false and no storeKey', () => {
      const context = {...mockContext, customerId: 'test-customer'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).not.toHaveProperty('createProductTailoring');
      expect(functions).not.toHaveProperty('updateProductTailoring');

      // Verify that the functions are the customer functions
      expect(functions.readProductTailoring).toBe(
        customerFunctions.readProductTailoring
      );
    });
  });

  describe('Default Context', () => {
    it('should return empty object as default when no specific context is provided', () => {
      const functions = contextToProductTailoringFunctionMapping();

      expect(functions).toEqual({});
      expect(functions).not.toHaveProperty('readProductTailoring');
    });

    it('should return empty object as default when context is empty', () => {
      const context = {projectKey: 'test-project'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toEqual({});
      expect(functions.readProductTailoring).toBeUndefined();
    });
  });

  describe('Context Priority', () => {
    it('should prioritize admin over store and customer', () => {
      const context = {
        ...mockContext,
        isAdmin: true,
        storeKey: 'test-store',
        customerId: 'test-customer',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions.readProductTailoring).toBe(
        adminFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        adminFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        adminFunctions.updateProductTailoring
      );
    });

    it('should prioritize store over customer when isAdmin is false', () => {
      const context = {
        ...mockContext,
        isAdmin: false,
        storeKey: 'test-store',
        customerId: 'test-customer',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions.readProductTailoring).toBe(
        storeFunctions.readProductTailoring
      );
      expect(functions.createProductTailoring).toBe(
        storeFunctions.createProductTailoring
      );
      expect(functions.updateProductTailoring).toBe(
        storeFunctions.updateProductTailoring
      );
    });
  });
});

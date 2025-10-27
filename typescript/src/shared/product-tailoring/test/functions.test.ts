import {contextToProductTailoringFunctionMapping} from '../functions';

// Mock the individual function modules
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

describe('Product Tailoring Functions', () => {
  describe('contextToProductTailoringFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {isAdmin: true, projectKey: 'test-project'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should return store functions when storeKey is provided and isAdmin is false', () => {
      const context = {storeKey: 'test-store', projectKey: 'test-project'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should return customer functions when customerId is provided and isAdmin is false', () => {
      const context = {customerId: 'test-customer', projectKey: 'test-project'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should return admin functions by default when no specific context is provided', () => {
      const context = {projectKey: 'test-project'};
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should return admin functions when context is undefined', () => {
      const functions = contextToProductTailoringFunctionMapping(undefined);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should prioritize admin context over store context', () => {
      const context = {
        isAdmin: true,
        storeKey: 'test-store',
        projectKey: 'test-project',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });

    it('should prioritize admin context over customer context', () => {
      const context = {
        isAdmin: true,
        customerId: 'test-customer',
        projectKey: 'test-project',
      };
      const functions = contextToProductTailoringFunctionMapping(context);

      expect(functions).toHaveProperty('readProductTailoring');
      expect(functions).toHaveProperty('createProductTailoring');
      expect(functions).toHaveProperty('updateProductTailoring');
    });
  });
});

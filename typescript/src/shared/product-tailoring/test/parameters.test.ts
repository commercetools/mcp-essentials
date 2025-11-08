import {
  readProductTailoringParameters,
  createProductTailoringParameters,
  updateProductTailoringParameters,
  deleteProductTailoringByIdParameters,
  deleteProductTailoringByKeyParameters,
  deleteProductTailoringByProductIdParameters,
  deleteProductTailoringByProductKeyParameters,
} from '../parameters';

describe('Product Tailoring Parameters', () => {
  describe('readProductTailoringParameters', () => {
    it('should validate valid read parameters', () => {
      const validParams = {
        id: 'test-id',
        expand: ['product'],
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['name(en="Test")'],
      };

      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate parameters with only id', () => {
      const validParams = {id: 'test-id'};
      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate parameters with only key', () => {
      const validParams = {key: 'test-key'};
      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate parameters with productId and storeKey', () => {
      const validParams = {
        productId: 'test-product',
        storeKey: 'test-store',
      };
      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate parameters with productKey and storeKey', () => {
      const validParams = {
        productKey: 'test-product',
        storeKey: 'test-store',
      };
      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate parameters with only query parameters', () => {
      const validParams = {
        limit: 10,
        offset: 0,
        where: ['name(en="Test")'],
      };
      expect(() =>
        readProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid parameters', () => {
      const invalidParams = {
        id: 123, // should be string
        expand: 'product', // should be array
        limit: 'ten', // should be number
      };

      expect(() =>
        readProductTailoringParameters.parse(invalidParams)
      ).toThrow();
    });
  });

  describe('createProductTailoringParameters', () => {
    it('should validate valid create parameters', () => {
      const validParams = {
        productId: 'test-product',
        key: 'test-key',
        name: {en: 'Test Product'},
        published: true,
        custom: {
          type: {id: 'custom-type-id'},
          fields: {customField: 'value'},
        },
      };

      expect(() =>
        createProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate minimal create parameters', () => {
      const validParams = {
        key: 'test-key',
        productId: 'test-product',
        name: {en: 'Test Product'},
      };

      expect(() =>
        createProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid create parameters', () => {
      const invalidParams = {
        productId: 123, // should be string
        name: 'Test Product', // should be object
        published: 'yes', // should be boolean
      };

      expect(() =>
        createProductTailoringParameters.parse(invalidParams)
      ).toThrow();
    });

    it('should reject missing required fields', () => {
      const invalidParams = {
        key: 'test-key',
        // missing productId and name
      };

      expect(() =>
        createProductTailoringParameters.parse(invalidParams)
      ).toThrow();
    });
  });

  describe('updateProductTailoringParameters', () => {
    it('should validate valid update parameters with id', () => {
      const validParams = {
        id: 'test-id',
        version: 1,
        actions: [
          {action: 'setName', name: {en: 'Updated Product'}},
          {action: 'publish'},
        ],
      };

      expect(() =>
        updateProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate valid update parameters with key', () => {
      const validParams = {
        key: 'test-key',
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Product'}}],
      };

      expect(() =>
        updateProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate valid update parameters with productId and storeKey', () => {
      const validParams = {
        productId: 'test-product',
        storeKey: 'test-store',
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Product'}}],
      };

      expect(() =>
        updateProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should validate valid update parameters with productKey and storeKey', () => {
      const validParams = {
        productKey: 'test-product',
        storeKey: 'test-store',
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Product'}}],
      };

      expect(() =>
        updateProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid update parameters', () => {
      const invalidParams = {
        id: 123, // should be string
        version: 'one', // should be number
        actions: 'setName', // should be array
      };

      expect(() =>
        updateProductTailoringParameters.parse(invalidParams)
      ).toThrow();
    });

    it('should accept parameters without identifier (validation happens at runtime)', () => {
      const validParams = {
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated'}}],
        // missing identifier - this is allowed by schema but will fail at runtime
      };

      expect(() =>
        updateProductTailoringParameters.parse(validParams)
      ).not.toThrow();
    });
  });

  describe('deleteProductTailoringByIdParameters', () => {
    it('should validate valid delete by id parameters', () => {
      const validParams = {
        id: 'test-id',
        version: 1,
      };

      expect(() =>
        deleteProductTailoringByIdParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid delete by id parameters', () => {
      const invalidParams = {
        id: 123, // should be string
        version: 'one', // should be number
      };

      expect(() =>
        deleteProductTailoringByIdParameters.parse(invalidParams)
      ).toThrow();
    });
  });

  describe('deleteProductTailoringByKeyParameters', () => {
    it('should validate valid delete by key parameters', () => {
      const validParams = {
        key: 'test-key',
        version: 1,
      };

      expect(() =>
        deleteProductTailoringByKeyParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid delete by key parameters', () => {
      const invalidParams = {
        key: 123, // should be string
        version: 'one', // should be number
      };

      expect(() =>
        deleteProductTailoringByKeyParameters.parse(invalidParams)
      ).toThrow();
    });
  });

  describe('deleteProductTailoringByProductIdParameters', () => {
    it('should validate valid delete by product id parameters', () => {
      const validParams = {
        productId: 'test-product',
        storeKey: 'test-store',
        version: 1,
      };

      expect(() =>
        deleteProductTailoringByProductIdParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid delete by product id parameters', () => {
      const invalidParams = {
        productId: 123, // should be string
        storeKey: 456, // should be string
        version: 'one', // should be number
      };

      expect(() =>
        deleteProductTailoringByProductIdParameters.parse(invalidParams)
      ).toThrow();
    });
  });

  describe('deleteProductTailoringByProductKeyParameters', () => {
    it('should validate valid delete by product key parameters', () => {
      const validParams = {
        productKey: 'test-product',
        storeKey: 'test-store',
        version: 1,
      };

      expect(() =>
        deleteProductTailoringByProductKeyParameters.parse(validParams)
      ).not.toThrow();
    });

    it('should reject invalid delete by product key parameters', () => {
      const invalidParams = {
        productKey: 123, // should be string
        storeKey: 456, // should be string
        version: 'one', // should be number
      };

      expect(() =>
        deleteProductTailoringByProductKeyParameters.parse(invalidParams)
      ).toThrow();
    });
  });
});

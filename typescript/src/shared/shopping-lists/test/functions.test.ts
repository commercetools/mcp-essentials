import {contextToShoppingListFunctionMapping} from '../functions';
import {Context} from '../../../types/configuration';

describe('Shopping List Functions', () => {
  describe('contextToShoppingListFunctionMapping', () => {
    it('should return customer functions when only customerId is present', () => {
      const context: Context = {
        customerId: 'customer-123',
        isAdmin: false,
      };

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toHaveProperty('read_shopping_list');
      expect(mapping).toHaveProperty('create_shopping_list');
      expect(mapping).toHaveProperty('update_shopping_list');
      expect(Object.keys(mapping)).toHaveLength(3);
    });

    it('should return store functions when only storeKey is present', () => {
      const context: Context = {
        storeKey: 'store-123',
        isAdmin: false,
      };

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toHaveProperty('read_shopping_list');
      expect(mapping).toHaveProperty('create_shopping_list');
      expect(mapping).toHaveProperty('update_shopping_list');
      expect(Object.keys(mapping)).toHaveLength(3);
    });

    it('should return admin functions when isAdmin is true', () => {
      const context: Context = {
        isAdmin: true,
      };

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toHaveProperty('read_shopping_list');
      expect(mapping).toHaveProperty('create_shopping_list');
      expect(mapping).toHaveProperty('update_shopping_list');
      expect(Object.keys(mapping)).toHaveLength(3);
    });

    it('should return empty object when no context is provided', () => {
      const mapping = contextToShoppingListFunctionMapping();

      expect(mapping).toEqual({});
    });

    it('should return empty object when no relevant context properties are present', () => {
      const context: Context = {};

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toEqual({});
    });

    it('should prioritize customer over store when customerId is present', () => {
      const context: Context = {
        customerId: 'customer-123',
        storeKey: 'store-123',
        isAdmin: true,
      };

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toHaveProperty('read_shopping_list');
      expect(mapping).toHaveProperty('create_shopping_list');
      expect(mapping).toHaveProperty('update_shopping_list');
      expect(Object.keys(mapping)).toHaveLength(3);
    });

    it('should prioritize store over admin when storeKey is present but customerId is not', () => {
      const context: Context = {
        storeKey: 'store-123',
        isAdmin: true,
      };

      const mapping = contextToShoppingListFunctionMapping(context);

      expect(mapping).toHaveProperty('read_shopping_list');
      expect(mapping).toHaveProperty('create_shopping_list');
      expect(mapping).toHaveProperty('update_shopping_list');
      expect(Object.keys(mapping)).toHaveLength(3);
    });
  });
});

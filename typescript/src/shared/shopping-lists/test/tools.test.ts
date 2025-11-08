import {contextToShoppingListTools} from '../tools';
import {Context} from '../../../types/configuration';

describe('Shopping List Tools', () => {
  describe('contextToShoppingListTools', () => {
    it('should return customer tools when only customerId is present', () => {
      const context: Context = {
        customerId: 'customer-123',
        isAdmin: false,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_shopping_list');
      expect(tools[1]).toHaveProperty('method', 'create_shopping_list');
      expect(tools[2]).toHaveProperty('method', 'update_shopping_list');
    });

    it('should return store tools when only storeKey is present', () => {
      const context: Context = {
        storeKey: 'store-123',
        isAdmin: false,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_shopping_list');
      expect(tools[1]).toHaveProperty('method', 'create_shopping_list');
      expect(tools[2]).toHaveProperty('method', 'update_shopping_list');
    });

    it('should return admin tools when isAdmin is true', () => {
      const context: Context = {
        isAdmin: true,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_shopping_list');
      expect(tools[1]).toHaveProperty('method', 'create_shopping_list');
      expect(tools[2]).toHaveProperty('method', 'update_shopping_list');
    });

    it('should return empty array when no context is provided', () => {
      const tools = contextToShoppingListTools();

      expect(tools).toEqual([]);
    });

    it('should return empty array when no relevant context properties are present', () => {
      const context: Context = {};

      const tools = contextToShoppingListTools(context);

      expect(tools).toEqual([]);
    });

    it('should prioritize customer over store when customerId is present', () => {
      const context: Context = {
        customerId: 'customer-123',
        storeKey: 'store-123',
        isAdmin: true,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_shopping_list');
      expect(tools[1]).toHaveProperty('method', 'create_shopping_list');
      expect(tools[2]).toHaveProperty('method', 'update_shopping_list');
    });

    it('should prioritize store over admin when storeKey is present but customerId is not', () => {
      const context: Context = {
        storeKey: 'store-123',
        isAdmin: true,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_shopping_list');
      expect(tools[1]).toHaveProperty('method', 'create_shopping_list');
      expect(tools[2]).toHaveProperty('method', 'update_shopping_list');
    });

    it('should have correct tool properties', () => {
      const context: Context = {
        isAdmin: true,
      };

      const tools = contextToShoppingListTools(context);

      expect(tools).toHaveLength(3);

      // Check read tool
      const readTool = tools[0];
      expect(readTool).toHaveProperty('name', 'Read Shopping List');
      expect(readTool).toHaveProperty('method', 'read_shopping_list');
      expect(readTool).toHaveProperty('parameters');
      expect(readTool).toHaveProperty('description');
      expect(readTool).toHaveProperty('actions');
      expect(readTool.actions).toHaveProperty('shopping-lists');
      expect(readTool.actions['shopping-lists']).toHaveProperty('read', true);

      // Check create tool
      const createTool = tools[1];
      expect(createTool).toHaveProperty('name', 'Create Shopping List');
      expect(createTool).toHaveProperty('method', 'create_shopping_list');
      expect(createTool).toHaveProperty('parameters');
      expect(createTool).toHaveProperty('description');
      expect(createTool).toHaveProperty('actions');
      expect(createTool.actions).toHaveProperty('shopping-lists');
      expect(createTool.actions['shopping-lists']).toHaveProperty(
        'create',
        true
      );

      // Check update tool
      const updateTool = tools[2];
      expect(updateTool).toHaveProperty('name', 'Update Shopping List');
      expect(updateTool).toHaveProperty('method', 'update_shopping_list');
      expect(updateTool).toHaveProperty('parameters');
      expect(updateTool).toHaveProperty('description');
      expect(updateTool).toHaveProperty('actions');
      expect(updateTool.actions).toHaveProperty('shopping-lists');
      expect(updateTool.actions['shopping-lists']).toHaveProperty(
        'update',
        true
      );
    });
  });
});

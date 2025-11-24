import {contextToSubscriptionTools} from '../tools';
import {Context} from '../../../types/configuration';

describe('Subscription Tools', () => {
  describe('contextToSubscriptionTools', () => {
    it('should return subscription tools when isAdmin is true', () => {
      const context: Context = {isAdmin: true};
      const tools = contextToSubscriptionTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_subscription');
      expect(tools[1]).toHaveProperty('method', 'create_subscription');
      expect(tools[2]).toHaveProperty('method', 'update_subscription');
    });

    it('should return subscription tools when no context is provided', () => {
      const tools = contextToSubscriptionTools();

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_subscription');
      expect(tools[1]).toHaveProperty('method', 'create_subscription');
      expect(tools[2]).toHaveProperty('method', 'update_subscription');
    });

    it('should return subscription tools when context does not include isAdmin', () => {
      const context: Context = {};
      const tools = contextToSubscriptionTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_subscription');
      expect(tools[1]).toHaveProperty('method', 'create_subscription');
      expect(tools[2]).toHaveProperty('method', 'update_subscription');
    });

    it('should have correct tool properties', () => {
      const context: Context = {isAdmin: true};
      const tools = contextToSubscriptionTools(context);

      expect(tools).toHaveLength(3);

      // Check read tool
      const readTool = tools[0];
      expect(readTool).toHaveProperty('name', 'Read Subscription');
      expect(readTool).toHaveProperty('method', 'read_subscription');
      expect(readTool).toHaveProperty('parameters');
      expect(readTool).toHaveProperty('description');
      expect(readTool).toHaveProperty('actions');
      expect(readTool.actions).toHaveProperty('subscriptions');
      expect(readTool.actions.subscriptions).toHaveProperty('read', true);

      // Check create tool
      const createTool = tools[1];
      expect(createTool).toHaveProperty('name', 'Create Subscription');
      expect(createTool).toHaveProperty('method', 'create_subscription');
      expect(createTool).toHaveProperty('parameters');
      expect(createTool).toHaveProperty('description');
      expect(createTool).toHaveProperty('actions');
      expect(createTool.actions).toHaveProperty('subscriptions');
      expect(createTool.actions.subscriptions).toHaveProperty('create', true);

      // Check update tool
      const updateTool = tools[2];
      expect(updateTool).toHaveProperty('name', 'Update Subscription');
      expect(updateTool).toHaveProperty('method', 'update_subscription');
      expect(updateTool).toHaveProperty('parameters');
      expect(updateTool).toHaveProperty('description');
      expect(updateTool).toHaveProperty('actions');
      expect(updateTool.actions).toHaveProperty('subscriptions');
      expect(updateTool.actions.subscriptions).toHaveProperty('update', true);
    });
  });
});

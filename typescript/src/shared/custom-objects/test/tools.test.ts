import {contextToCustomObjectTools} from '../tools';

describe('Custom Objects Tools', () => {
  describe('contextToCustomObjectTools', () => {
    it('should return custom object tools when isAdmin is true', () => {
      const context = {isAdmin: true};
      const tools = contextToCustomObjectTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Custom Object');
      expect(tools[0]).toHaveProperty('method', 'read_custom_object');
      expect(tools[0]).toHaveProperty('actions', {
        'custom-objects': {
          read: true,
        },
      });

      expect(tools[1]).toHaveProperty('name', 'Create Custom Object');
      expect(tools[1]).toHaveProperty('method', 'create_custom_object');
      expect(tools[1]).toHaveProperty('actions', {
        'custom-objects': {
          create: true,
        },
      });

      expect(tools[2]).toHaveProperty('name', 'Update Custom Object');
      expect(tools[2]).toHaveProperty('method', 'update_custom_object');
      expect(tools[2]).toHaveProperty('actions', {
        'custom-objects': {
          update: true,
        },
      });
    });

    it('should return custom object tools when isAdmin is false', () => {
      const context = {isAdmin: false};
      const tools = contextToCustomObjectTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Custom Object');
      expect(tools[1]).toHaveProperty('name', 'Create Custom Object');
      expect(tools[2]).toHaveProperty('name', 'Update Custom Object');
    });

    it('should return custom object tools when context is undefined', () => {
      const tools = contextToCustomObjectTools();

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Custom Object');
      expect(tools[1]).toHaveProperty('name', 'Create Custom Object');
      expect(tools[2]).toHaveProperty('name', 'Update Custom Object');
    });

    it('should return custom object tools when context does not have isAdmin', () => {
      const context = {};
      const tools = contextToCustomObjectTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Custom Object');
      expect(tools[1]).toHaveProperty('name', 'Create Custom Object');
      expect(tools[2]).toHaveProperty('name', 'Update Custom Object');
    });
  });
});

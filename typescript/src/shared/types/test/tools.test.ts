import {contextToTypeTools} from '../tools';

describe('Types Tools', () => {
  describe('contextToTypeTools', () => {
    it('should return type tools when isAdmin is true', () => {
      const context = {isAdmin: true};
      const tools = contextToTypeTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Type');
      expect(tools[0]).toHaveProperty('method', 'read_type');
      expect(tools[0]).toHaveProperty('actions', {
        types: {
          read: true,
        },
      });

      expect(tools[1]).toHaveProperty('name', 'Create Type');
      expect(tools[1]).toHaveProperty('method', 'create_type');
      expect(tools[1]).toHaveProperty('actions', {
        types: {
          create: true,
        },
      });

      expect(tools[2]).toHaveProperty('name', 'Update Type');
      expect(tools[2]).toHaveProperty('method', 'update_type');
      expect(tools[2]).toHaveProperty('actions', {
        types: {
          update: true,
        },
      });
    });

    it('should return type tools when isAdmin is false', () => {
      const context = {isAdmin: false};
      const tools = contextToTypeTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Type');
      expect(tools[1]).toHaveProperty('name', 'Create Type');
      expect(tools[2]).toHaveProperty('name', 'Update Type');
    });

    it('should return type tools when context is undefined', () => {
      const tools = contextToTypeTools();

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Type');
      expect(tools[1]).toHaveProperty('name', 'Create Type');
      expect(tools[2]).toHaveProperty('name', 'Update Type');
    });

    it('should return type tools when context does not have isAdmin', () => {
      const context = {};
      const tools = contextToTypeTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('name', 'Read Type');
      expect(tools[1]).toHaveProperty('name', 'Create Type');
      expect(tools[2]).toHaveProperty('name', 'Update Type');
    });
  });
});

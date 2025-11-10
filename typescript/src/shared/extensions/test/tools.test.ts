import {contextToExtensionTools} from '../tools';
import {Context} from '../../../types/configuration';

describe('Extension Tools', () => {
  describe('contextToExtensionTools', () => {
    it('should return extension tools when isAdmin is true', () => {
      const context: Context = {isAdmin: true};
      const tools = contextToExtensionTools(context);

      expect(tools).toHaveLength(3);
      expect(tools[0]).toHaveProperty('method', 'read_extension');
      expect(tools[1]).toHaveProperty('method', 'create_extension');
      expect(tools[2]).toHaveProperty('method', 'update_extension');
    });

    it('should return empty array when no context is provided', () => {
      const tools = contextToExtensionTools();

      expect(tools).toEqual([]);
    });

    it('should return empty array when context does not include isAdmin', () => {
      const context: Context = {};
      const tools = contextToExtensionTools(context);

      expect(tools).toEqual([]);
    });

    it('should have correct tool properties', () => {
      const context: Context = {isAdmin: true};
      const tools = contextToExtensionTools(context);

      expect(tools).toHaveLength(3);

      // Check read tool
      const readTool = tools[0];
      expect(readTool).toHaveProperty('name', 'Read Extension');
      expect(readTool).toHaveProperty('method', 'read_extension');
      expect(readTool).toHaveProperty('parameters');
      expect(readTool).toHaveProperty('description');
      expect(readTool).toHaveProperty('actions');
      expect(readTool.actions).toHaveProperty('extensions');
      expect(readTool.actions.extensions).toHaveProperty('read', true);

      // Check create tool
      const createTool = tools[1];
      expect(createTool).toHaveProperty('name', 'Create Extension');
      expect(createTool).toHaveProperty('method', 'create_extension');
      expect(createTool).toHaveProperty('parameters');
      expect(createTool).toHaveProperty('description');
      expect(createTool).toHaveProperty('actions');
      expect(createTool.actions).toHaveProperty('extensions');
      expect(createTool.actions.extensions).toHaveProperty('create', true);

      // Check update tool
      const updateTool = tools[2];
      expect(updateTool).toHaveProperty('name', 'Update Extension');
      expect(updateTool).toHaveProperty('method', 'update_extension');
      expect(updateTool).toHaveProperty('parameters');
      expect(updateTool).toHaveProperty('description');
      expect(updateTool).toHaveProperty('actions');
      expect(updateTool.actions).toHaveProperty('extensions');
      expect(updateTool.actions.extensions).toHaveProperty('update', true);
    });
  });
});

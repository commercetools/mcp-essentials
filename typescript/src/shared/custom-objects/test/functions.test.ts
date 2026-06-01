import {contextToCustomObjectFunctionMapping} from '../functions';

describe('Custom Objects Functions', () => {
  describe('contextToCustomObjectFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {isAdmin: true};
      const mapping = contextToCustomObjectFunctionMapping(context);

      expect(mapping).toHaveProperty('read_custom_object');
      expect(mapping).toHaveProperty('create_custom_object');
      expect(mapping).toHaveProperty('update_custom_object');
    });

    it('should return admin functions as fallback when isAdmin is false', () => {
      const context = {isAdmin: false};
      const mapping = contextToCustomObjectFunctionMapping(context);

      expect(mapping).toHaveProperty('read_custom_object');
      expect(mapping).toHaveProperty('create_custom_object');
      expect(mapping).toHaveProperty('update_custom_object');
    });

    it('should return admin functions as fallback when context is undefined', () => {
      const mapping = contextToCustomObjectFunctionMapping();

      expect(mapping).toHaveProperty('read_custom_object');
      expect(mapping).toHaveProperty('create_custom_object');
      expect(mapping).toHaveProperty('update_custom_object');
    });

    it('should return admin functions as fallback when context does not have isAdmin', () => {
      const context = {};
      const mapping = contextToCustomObjectFunctionMapping(context);

      expect(mapping).toHaveProperty('read_custom_object');
      expect(mapping).toHaveProperty('create_custom_object');
      expect(mapping).toHaveProperty('update_custom_object');
    });
  });
});

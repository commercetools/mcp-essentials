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

    it('should return empty object when isAdmin is false', () => {
      const context = {isAdmin: false};
      const mapping = contextToCustomObjectFunctionMapping(context);

      expect(mapping).toEqual({});
    });

    it('should return empty object when context is undefined', () => {
      const mapping = contextToCustomObjectFunctionMapping();

      expect(mapping).toEqual({});
    });

    it('should return empty object when context does not have isAdmin', () => {
      const context = {};
      const mapping = contextToCustomObjectFunctionMapping(context);

      expect(mapping).toEqual({});
    });
  });
});

import {contextToTypeFunctionMapping} from '../functions';

describe('Types Functions', () => {
  describe('contextToTypeFunctionMapping', () => {
    it('should return admin functions when isAdmin is true', () => {
      const context = {isAdmin: true};
      const mapping = contextToTypeFunctionMapping(context);

      expect(mapping).toHaveProperty('read_type');
      expect(mapping).toHaveProperty('create_type');
      expect(mapping).toHaveProperty('update_type');
    });

    it('should return empty object when isAdmin is false', () => {
      const context = {isAdmin: false};
      const mapping = contextToTypeFunctionMapping(context);

      expect(mapping).toEqual({});
    });

    it('should return empty object when context is undefined', () => {
      const mapping = contextToTypeFunctionMapping();

      expect(mapping).toEqual({});
    });

    it('should return empty object when context does not have isAdmin', () => {
      const context = {};
      const mapping = contextToTypeFunctionMapping(context);

      expect(mapping).toEqual({});
    });
  });
});

import {contextToTransactionFunctionMapping} from '../functions';
import {Context} from '../../../types/configuration';

describe('contextToTransactionFunctionMapping', () => {
  it('should return empty object when no context is provided', () => {
    const result = contextToTransactionFunctionMapping();
    expect(result).toEqual({});
  });

  it('should return empty object when context is provided but isAdmin is false', () => {
    const context: Context = {
      isAdmin: false,
    };
    const result = contextToTransactionFunctionMapping(context);
    expect(result).toEqual({});
  });

  it('should return function mappings when isAdmin is true', () => {
    const context: Context = {
      isAdmin: true,
    };
    const result = contextToTransactionFunctionMapping(context);
    expect(result).toHaveProperty('read_transaction');
    expect(result).toHaveProperty('create_transaction');
    expect(typeof result.read_transaction).toBe('function');
    expect(typeof result.create_transaction).toBe('function');
  });
});

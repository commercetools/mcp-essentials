import {contextToCategoryFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import * as customer from '../customer.functions';
import {Context} from '../../../types/configuration';

describe('Category Context Mapping', () => {
  it('should return customer read function when no context is provided', () => {
    const mapping = contextToCategoryFunctionMapping();

    expect(mapping).toEqual({
      read_category: customer.readCategory,
    });
  });

  it('should return admin functions when context has isAdmin flag', () => {
    const context: Context = {
      isAdmin: true,
    };
    const mapping = contextToCategoryFunctionMapping(context);

    expect(mapping).toEqual({
      read_category: admin.readCategory,
      create_category: admin.createCategory,
      update_category: admin.updateCategory,
    });
  });

  it('should return only read function for customer when context has customerId', () => {
    const context: Context = {
      customerId: 'customer-123',
    };
    const mapping = contextToCategoryFunctionMapping(context);

    expect(mapping).toEqual({
      read_category: customer.readCategory,
    });

    // Ensure update and create are not included
    expect(mapping).not.toHaveProperty('create_category');
    expect(mapping).not.toHaveProperty('update_category');
  });

  it('should prioritize customer context even if isAdmin is true', () => {
    const context: Context = {
      customerId: 'customer-123',
      isAdmin: true,
    };
    const mapping = contextToCategoryFunctionMapping(context);

    expect(mapping).toEqual({
      read_category: customer.readCategory,
    });
  });
});

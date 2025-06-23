import {contextToProductSelectionFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('contextToProductSelectionFunctionMapping', () => {
  it('should return product-selection admin functions when context has isAdmin true', () => {
    const context = {
      projectKey: 'test-project',
      isAdmin: true,
    };

    const result = contextToProductSelectionFunctionMapping(context);

    expect(result).toEqual({
      read_product_selection: admin.readProductSelection,
      create_product_selection: admin.createProductSelection,
      update_product_selection: admin.updateProductSelection,
    });
  });

  it('should return empty object when no context is provided', () => {
    const result = contextToProductSelectionFunctionMapping();
    expect(result).toEqual({});
  });

  it('should return empty object when context does not have isAdmin set to true', () => {
    const context = {
      customerId: 'test-customer',
    };

    const result = contextToProductSelectionFunctionMapping(context);
    expect(result).toEqual({});
  });
});

import {contextToProductFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import {Context, CommercetoolsFuncContext} from '../../../types/configuration';

describe('contextToProductFunctionMapping', () => {
  it('should return admin functions when context has isAdmin set to true', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
      isAdmin: true,
    };
    const mapping = contextToProductFunctionMapping(context);

    expect(mapping).toEqual({
      list_products: admin.listProducts,
      create_product: admin.createProduct,
      update_product: admin.updateProduct,
    });
  });

  it('should return empty object when context is not provided', () => {
    const mapping = contextToProductFunctionMapping();
    expect(mapping).toEqual({
      list_products: admin.listProducts,
    });
  });

  it('should return empty object when context does not have isAdmin', () => {
    const context: CommercetoolsFuncContext = {projectKey: 'test-project'};
    const mapping = contextToProductFunctionMapping(context);
    expect(mapping).toEqual({
      list_products: admin.listProducts,
    });
  });
});

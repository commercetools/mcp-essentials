import {contextToProductTypeFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import {Context, CommercetoolsFuncContext} from '../../../types/configuration';

describe('contextToProductTypeFunctionMapping', () => {
  it('should return admin functions when context has isAdmin set to true', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
      isAdmin: true,
    };
    const mapping = contextToProductTypeFunctionMapping(context);

    expect(mapping).toEqual({
      read_product_type: admin.readProductType,
      create_product_type: admin.createProductType,
      update_product_type: admin.updateProductType,
    });
  });

  it('should return empty object when context is not provided', () => {
    const mapping = contextToProductTypeFunctionMapping();
    expect(mapping).toEqual({
      read_product_type: admin.readProductType,
    });
  });

  it('should return empty object when context does not have isAdmin', () => {
    const context: CommercetoolsFuncContext = {projectKey: 'test-project'};
    const mapping = contextToProductTypeFunctionMapping(context);
    expect(mapping).toEqual({
      read_product_type: admin.readProductType,
    });
  });
});

import {contextToProductDiscountFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Product Discount Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToProductDiscountFunctionMapping(context);

    expect(mapping).toEqual({
      read_product_discount: admin.readProductDiscount,
      create_product_discount: admin.createProductDiscount,
      update_product_discount: admin.updateProductDiscount,
    });
  });

  test('should return empty object when no context is provided', () => {
    const mapping = contextToProductDiscountFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToProductDiscountFunctionMapping(context);
    expect(mapping).toEqual({});
  });

  test('should return empty object when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToProductDiscountFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

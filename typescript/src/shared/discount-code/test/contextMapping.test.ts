import {contextToDiscountCodeFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Discount Code Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToDiscountCodeFunctionMapping(context);

    expect(mapping).toEqual({
      read_discount_code: admin.readDiscountCode,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    });
  });

  test('should return admin functions as fallback when no context is provided', () => {
    const mapping = contextToDiscountCodeFunctionMapping();
    expect(mapping).toEqual({
      read_discount_code: admin.readDiscountCode,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    });
  });

  test('should return admin functions as fallback when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToDiscountCodeFunctionMapping(context);
    expect(mapping).toEqual({
      read_discount_code: admin.readDiscountCode,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    });
  });

  test('should return admin functions as fallback when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToDiscountCodeFunctionMapping(context);
    expect(mapping).toEqual({
      read_discount_code: admin.readDiscountCode,
      create_discount_code: admin.createDiscountCode,
      update_discount_code: admin.updateDiscountCode,
    });
  });
});

import {contextToCartDiscountFunctionMapping} from '../functions';
import * as admin from '../admin.functions';
import * as store from '../store.functions';
import {Context} from '../../../types/configuration';

describe('Cart Discount Context Mapping', () => {
  it('should return an empty object when no context is provided', () => {
    const mapping = contextToCartDiscountFunctionMapping();

    expect(mapping).toEqual({});
  });

  it('should return admin functions when context has no storeKey', () => {
    const context: Context = {
      isAdmin: true,
    };
    const mapping = contextToCartDiscountFunctionMapping(context);

    expect(mapping).toEqual({
      read_cart_discount: admin.readCartDiscount,
      create_cart_discount: admin.createCartDiscount,
      update_cart_discount: admin.updateCartDiscount,
    });
  });

  it('should return store functions when context has storeKey', () => {
    const context: Context = {
      storeKey: 'test-store',
    };
    const mapping = contextToCartDiscountFunctionMapping(context);

    expect(mapping).toEqual({
      read_cart_discount: store.readCartDiscount,
      create_cart_discount: store.createCartDiscount,
      update_cart_discount: store.updateCartDiscount,
    });
  });

  it('should return store functions when context has both storeKey and isAdmin', () => {
    const context: Context = {
      storeKey: 'test-store',
      isAdmin: true,
    };
    const mapping = contextToCartDiscountFunctionMapping(context);

    expect(mapping).toEqual({
      read_cart_discount: store.readCartDiscount,
      create_cart_discount: store.createCartDiscount,
      update_cart_discount: store.updateCartDiscount,
    });
  });
});

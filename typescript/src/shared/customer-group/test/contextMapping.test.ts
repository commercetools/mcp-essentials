import {contextToCustomerGroupFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Customer Group Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToCustomerGroupFunctionMapping(context);

    expect(mapping).toEqual({
      read_customer_group: admin.readCustomerGroup,
      create_customer_group: admin.createCustomerGroup,
      update_customer_group: admin.updateCustomerGroup,
    });
  });

  test('should return admin functions as fallback when no context is provided', () => {
    const mapping = contextToCustomerGroupFunctionMapping();
    expect(mapping).toEqual({
      read_customer_group: admin.readCustomerGroup,
      create_customer_group: admin.createCustomerGroup,
      update_customer_group: admin.updateCustomerGroup,
    });
  });

  test('should return admin functions as fallback when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToCustomerGroupFunctionMapping(context);
    expect(mapping).toEqual({
      read_customer_group: admin.readCustomerGroup,
      create_customer_group: admin.createCustomerGroup,
      update_customer_group: admin.updateCustomerGroup,
    });
  });

  test('should return admin functions as fallback when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToCustomerGroupFunctionMapping(context);
    expect(mapping).toEqual({
      read_customer_group: admin.readCustomerGroup,
      create_customer_group: admin.createCustomerGroup,
      update_customer_group: admin.updateCustomerGroup,
    });
  });
});

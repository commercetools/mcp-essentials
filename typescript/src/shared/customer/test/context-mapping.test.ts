import {contextToCustomerFunctionMapping} from '../functions';
import * as customer from '../customer.functions';
import * as admin from '../admin.functions';
import * as store from '../store.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';

describe('contextToCustomerFunctionMapping', () => {
  it('should return customer context functions when customerId is provided', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
      customerId: 'customer-123',
    };

    const mapping = contextToCustomerFunctionMapping(context);

    expect(mapping).toEqual({
      read_customer: customer.readCustomerProfile,
    });
  });

  it('should return store context functions when storeKey is provided', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
      storeKey: 'store-123',
    };

    const mapping = contextToCustomerFunctionMapping(context);

    expect(mapping).toEqual({
      read_customer: store.readCustomerInStore,
      create_customer: store.createCustomerInStore,
      update_customer: store.updateCustomerInStore,
    });
  });

  it('should return admin context functions when isAdmin is provided', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
      isAdmin: true,
    };

    const mapping = contextToCustomerFunctionMapping(context);

    expect(mapping).toEqual({
      read_customer: admin.readCustomer,
      create_customer: admin.createCustomerAsAdmin,
      update_customer: admin.updateCustomerAsAdmin,
    });
  });

  it('should return empty object when no context is provided', () => {
    const mapping = contextToCustomerFunctionMapping();
    expect(mapping).toEqual({});
  });

  it('should return empty object when only projectKey is provided', () => {
    const context: CommercetoolsFuncContext = {
      projectKey: 'test-project',
    };

    const mapping = contextToCustomerFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

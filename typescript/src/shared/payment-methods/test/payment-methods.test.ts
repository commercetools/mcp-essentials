import {ApiRoot} from '@commercetools/platform-sdk';
import {Context} from '../../../types/configuration';
import {contextToPaymentMethodFunctionMapping} from '../functions';

// Mock ApiRoot
const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnThis(),
  paymentMethods: jest.fn().mockReturnThis(),
  withId: jest.fn().mockReturnThis(),
  withKey: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  execute: jest.fn(),
} as unknown as ApiRoot;

describe('Payment Methods Functions', () => {
  const projectKey = 'test-project';
  const mockPaymentMethod = {
    id: 'payment-method-123',
    key: 'credit-card',
    name: {en: 'Credit Card'},
    description: {en: 'Credit card payment method'},
    paymentInterface: 'stripe',
    method: 'credit_card',
    version: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToPaymentMethodFunctionMapping', () => {
    it('should return empty object when no context is provided', () => {
      const result = contextToPaymentMethodFunctionMapping();
      expect(result).toEqual({});
    });

    it('should return empty object when context is not admin', () => {
      const context: Context = {
        customerId: 'customer-123',
      };

      const result = contextToPaymentMethodFunctionMapping(context);
      expect(result).toEqual({});
    });

    it('should return admin functions when isAdmin is true', () => {
      const context: Context = {
        isAdmin: true,
      };

      const result = contextToPaymentMethodFunctionMapping(context);
      expect(result).toHaveProperty('read_payment_methods');
      expect(result).toHaveProperty('create_payment_methods');
      expect(result).toHaveProperty('update_payment_methods');
    });
  });

  describe('Admin Functions', () => {
    const context: Context = {
      isAdmin: true,
      projectKey: projectKey,
    };

    it('should return empty object when isAdmin is false', () => {
      const contextWithoutAdmin: Context = {isAdmin: false};

      const functions =
        contextToPaymentMethodFunctionMapping(contextWithoutAdmin);
      expect(Object.keys(functions)).toHaveLength(0);
    });

    it('should read payment method for admin', async () => {
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: mockPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.read_payment_methods!(
        mockApiRoot,
        context,
        {id: 'payment-method-123'}
      );

      expect(result).toEqual(mockPaymentMethod);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should read payment method by key for admin', async () => {
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: mockPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.read_payment_methods(
        mockApiRoot,
        context,
        {key: 'credit-card'}
      );

      expect(result).toEqual(mockPaymentMethod);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should query payment methods for admin', async () => {
      const mockPaymentMethods = {
        results: [mockPaymentMethod],
        count: 1,
        total: 1,
        offset: 0,
        limit: 20,
      };

      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: mockPaymentMethods,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.read_payment_methods!(
        mockApiRoot,
        context,
        {limit: 10, offset: 0}
      );

      expect(result).toEqual(mockPaymentMethods);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should create payment method for admin', async () => {
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: mockPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.create_payment_methods!(
        mockApiRoot,
        context,
        {
          name: {en: 'Credit Card'},
          description: {en: 'Credit card payment method'},
          paymentInterface: 'stripe',
          method: 'credit_card',
          interfaceAccount: 'stripe-account-123',
          default: true,
          paymentMethodStatus: 'Active',
          customer: {
            id: 'customer-123',
            typeId: 'customer',
          },
          businessUnit: {
            id: 'business-unit-456',
            typeId: 'business-unit',
          },
        }
      );

      expect(result).toEqual(mockPaymentMethod);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should update payment method by ID for admin', async () => {
      const updatedPaymentMethod = {...mockPaymentMethod, version: 2};
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: updatedPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.update_payment_methods!(
        mockApiRoot,
        context,
        {
          id: 'payment-method-123',
          version: 1,
          actions: [{action: 'changeName', name: {en: 'Updated Name'}}],
        }
      );

      expect(result.version).toBe(2);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should update payment method by key for admin', async () => {
      const updatedPaymentMethod = {...mockPaymentMethod, version: 2};
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: updatedPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.update_payment_methods!(
        mockApiRoot,
        context,
        {
          key: 'credit-card',
          version: 1,
          actions: [{action: 'changeName', name: {en: 'Updated Name'}}],
        }
      );

      expect(result.version).toBe(2);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });

    it('should throw error when neither ID nor key is provided for update', async () => {
      const functions = contextToPaymentMethodFunctionMapping(context);

      await expect(
        functions.update_payment_methods!(mockApiRoot, context, {
          version: 1,
          actions: [{action: 'changeName', name: {en: 'Updated Name'}}],
        })
      ).rejects.toThrow(
        'Either id or key must be provided for updating a payment method'
      );
    });

    it('should update payment method with setCustomer and setBusinessUnit actions', async () => {
      const updatedPaymentMethod = {...mockPaymentMethod, version: 2};
      (mockApiRoot.execute as jest.Mock).mockResolvedValue({
        body: updatedPaymentMethod,
      });

      const functions = contextToPaymentMethodFunctionMapping(context);
      const result = await functions.update_payment_methods!(
        mockApiRoot,
        context,
        {
          id: 'payment-method-123',
          version: 1,
          actions: [
            {
              action: 'setCustomer',
              customer: {id: 'customer-123', typeId: 'customer'},
            },
            {
              action: 'setBusinessUnit',
              businessUnit: {id: 'business-unit-456', typeId: 'business-unit'},
            },
          ],
        }
      );

      expect(result.version).toBe(2);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
    });
  });
});

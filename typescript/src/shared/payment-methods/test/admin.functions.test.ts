import {ApiRoot} from '@commercetools/platform-sdk';
import * as admin from '../admin.functions';
import * as base from '../base.functions';

// Mock the base functions
jest.mock('../base.functions');

const mockApiRoot = {} as ApiRoot;
const mockContext = {
  projectKey: 'test-project',
  isAdmin: true,
};

describe('Admin Payment Method Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readPaymentMethod', () => {
    it('should read payment method by ID for admin', async () => {
      const params = {id: 'payment-id-1'};
      const mockPaymentMethod = {
        id: 'payment-id-1',
        name: {en: 'Credit Card'},
      };
      (base.readPaymentMethodById as jest.Mock).mockResolvedValue(
        mockPaymentMethod
      );

      const result = await admin.readPaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.readPaymentMethodById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'payment-id-1',
          expand: undefined,
        }
      );
      expect(result).toEqual(mockPaymentMethod);
    });

    it('should read payment method by key for admin', async () => {
      const params = {key: 'credit-card'};
      const mockPaymentMethod = {
        id: 'payment-id-1',
        key: 'credit-card',
        name: {en: 'Credit Card'},
      };
      (base.readPaymentMethodByKey as jest.Mock).mockResolvedValue(
        mockPaymentMethod
      );

      const result = await admin.readPaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.readPaymentMethodByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'credit-card',
          expand: undefined,
        }
      );
      expect(result).toEqual(mockPaymentMethod);
    });

    it('should query payment methods for admin', async () => {
      const params = {limit: 10};
      const mockPaymentMethods = {
        results: [
          {id: 'payment-id-1', name: {en: 'Credit Card'}},
          {id: 'payment-id-2', name: {en: 'PayPal'}},
        ],
      };
      (base.queryPaymentMethods as jest.Mock).mockResolvedValue(
        mockPaymentMethods
      );

      const result = await admin.readPaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.queryPaymentMethods).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          limit: 10,
          offset: undefined,
          sort: undefined,
          where: undefined,
          expand: undefined,
        }
      );
      expect(result).toEqual(mockPaymentMethods);
    });
  });

  describe('createPaymentMethod', () => {
    it('should create a payment method for admin', async () => {
      const params = {
        key: 'new-card',
        name: {en: 'New Card'},
        paymentInterface: 'stripe',
        customer: {id: 'customer-123', typeId: 'customer'},
        businessUnit: {id: 'business-unit-456', typeId: 'business-unit'},
      };
      const mockNewPaymentMethod = {
        id: 'new-payment-id',
        name: {en: 'New Card'},
        customer: {id: 'customer-123', typeId: 'customer'},
        businessUnit: {id: 'business-unit-456', typeId: 'business-unit'},
      };
      (base.createPaymentMethod as jest.Mock).mockResolvedValue(
        mockNewPaymentMethod
      );

      const result = await admin.createPaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.createPaymentMethod).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        params
      );
      expect(result).toEqual(mockNewPaymentMethod);
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method by ID for admin', async () => {
      const params = {
        id: 'payment-id-1',
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Card'}}],
      };
      const mockUpdatedPaymentMethod = {
        id: 'payment-id-1',
        version: 2,
        name: {en: 'Updated Card'},
      };
      (base.updatePaymentMethodById as jest.Mock).mockResolvedValue(
        mockUpdatedPaymentMethod
      );

      const result = await admin.updatePaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updatePaymentMethodById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'payment-id-1',
          version: 1,
          actions: [{action: 'setName', name: {en: 'Updated Card'}}],
        }
      );
      expect(result).toEqual(mockUpdatedPaymentMethod);
    });

    it('should update payment method by key for admin', async () => {
      const params = {
        key: 'credit-card',
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Card'}}],
      };
      const mockUpdatedPaymentMethod = {
        id: 'payment-id-1',
        key: 'credit-card',
        version: 2,
        name: {en: 'Updated Card'},
      };
      (base.updatePaymentMethodByKey as jest.Mock).mockResolvedValue(
        mockUpdatedPaymentMethod
      );

      const result = await admin.updatePaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updatePaymentMethodByKey).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          key: 'credit-card',
          version: 1,
          actions: [{action: 'setName', name: {en: 'Updated Card'}}],
        }
      );
      expect(result).toEqual(mockUpdatedPaymentMethod);
    });

    it('should update payment method with setCustomer and setBusinessUnit actions', async () => {
      const params = {
        id: 'payment-id-1',
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
      };
      const mockUpdatedPaymentMethod = {
        id: 'payment-id-1',
        version: 2,
        customer: {id: 'customer-123', typeId: 'customer'},
        businessUnit: {id: 'business-unit-456', typeId: 'business-unit'},
      };
      (base.updatePaymentMethodById as jest.Mock).mockResolvedValue(
        mockUpdatedPaymentMethod
      );

      const result = await admin.updatePaymentMethod(
        mockApiRoot,
        mockContext,
        params
      );

      expect(base.updatePaymentMethodById).toHaveBeenCalledWith(
        mockApiRoot,
        mockContext.projectKey,
        {
          id: 'payment-id-1',
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
      expect(result).toEqual(mockUpdatedPaymentMethod);
    });

    it('should throw error when neither ID nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [{action: 'setName', name: {en: 'Updated Card'}}],
      };

      await expect(
        admin.updatePaymentMethod(mockApiRoot, mockContext, params)
      ).rejects.toThrow(
        'Either id or key must be provided for updating a payment method'
      );
    });
  });
});

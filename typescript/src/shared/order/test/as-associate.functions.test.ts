import {ApiRoot} from '@commercetools/platform-sdk';
import * as asAssociate from '../as-associate.functions';
import {CommercetoolsFuncContext} from '../../../types/configuration';
import {SDKError} from '../../errors/sdkError';

// Mock the base functions
jest.mock('../base.functions', () => ({
  readOrderByIdAsAssociate: jest.fn(),
  readOrderByOrderNumberAsAssociate: jest.fn(),
  queryOrdersAsAssociate: jest.fn(),
  createOrderFromCartAsAssociate: jest.fn(),
  createOrderFromQuoteAsAssociate: jest.fn(),
  updateOrderByIdAsAssociate: jest.fn(),
  updateOrderByOrderNumberAsAssociate: jest.fn(),
}));

import * as base from '../base.functions';

describe('As-Associate Order Functions', () => {
  let mockApiRoot: jest.Mocked<ApiRoot>;
  let context: CommercetoolsFuncContext;

  beforeEach(() => {
    mockApiRoot = {} as jest.Mocked<ApiRoot>;
    context = {
      projectKey: 'test-project',
      customerId: 'associate-123',
      businessUnitKey: 'business-unit-456',
    };
    jest.clearAllMocks();
  });

  describe('readAssociateOrder', () => {
    it('should read order by ID when id is provided', async () => {
      const mockOrder = {id: 'order-123', version: 1};
      (base.readOrderByIdAsAssociate as jest.Mock).mockResolvedValue(mockOrder);

      const params = {id: 'order-123', expand: ['customer']};
      const result = await asAssociate.readAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.readOrderByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'order-123',
        ['customer']
      );
      expect(result).toEqual(mockOrder);
    });

    it('should read order by orderNumber when orderNumber is provided', async () => {
      const mockOrder = {id: 'order-123', version: 1, orderNumber: 'ORD-001'};
      (base.readOrderByOrderNumberAsAssociate as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params = {orderNumber: 'ORD-001'};
      const result = await asAssociate.readAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.readOrderByOrderNumberAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'ORD-001',
        undefined
      );
      expect(result).toEqual(mockOrder);
    });

    it('should query orders when where conditions are provided', async () => {
      const mockOrders = {results: [{id: 'order-123', version: 1}], count: 1};
      (base.queryOrdersAsAssociate as jest.Mock).mockResolvedValue(mockOrders);

      const params = {
        where: ['orderState="Open"'],
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        expand: ['customer'],
      };
      const result = await asAssociate.readAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.queryOrdersAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        ['orderState="Open"'],
        10,
        0,
        ['createdAt desc'],
        ['customer']
      );
      expect(result).toEqual(mockOrders);
    });

    it('should throw error when customerId is missing', () => {
      const contextWithoutCustomerId = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-456',
      };

      const params = {id: 'order-123'};

      expect(() =>
        asAssociate.readAssociateOrder(
          mockApiRoot,
          contextWithoutCustomerId,
          params
        )
      ).toThrow(SDKError);
    });

    it('should throw error when businessUnitKey is missing', () => {
      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'associate-123',
      };

      const params = {id: 'order-123'};

      expect(() =>
        asAssociate.readAssociateOrder(
          mockApiRoot,
          contextWithoutBusinessUnit,
          params
        )
      ).toThrow(SDKError);
    });
  });

  describe('createAssociateOrder', () => {
    it('should create order from cart when cart parameters are provided', async () => {
      const mockOrder = {id: 'order-123', version: 1};
      (base.createOrderFromCartAsAssociate as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params = {
        id: 'cart-123',
        version: 2,
        orderNumber: 'ORD-001',
      } as any;
      const result = await asAssociate.createAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.createOrderFromCartAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'cart-123',
        2,
        'ORD-001'
      );
      expect(result).toEqual(mockOrder);
    });

    it('should create order from quote when quote parameters are provided', async () => {
      const mockOrder = {id: 'order-123', version: 1};
      (base.createOrderFromQuoteAsAssociate as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params = {
        quoteId: 'quote-123',
        version: 1,
        orderNumber: 'ORD-002',
      } as any;
      const result = await asAssociate.createAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.createOrderFromQuoteAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'quote-123',
        1,
        'ORD-002'
      );
      expect(result).toEqual(mockOrder);
    });

    it('should throw error when invalid parameters are provided', () => {
      const params = {
        version: 1,
        // Missing both cart id and quote id
      } as any;

      expect(() =>
        asAssociate.createAssociateOrder(mockApiRoot, context, params)
      ).toThrow(SDKError);
    });

    it('should throw error when customerId is missing', () => {
      const contextWithoutCustomerId = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-456',
      };

      const params = {id: 'cart-123', version: 1} as any;

      expect(() =>
        asAssociate.createAssociateOrder(
          mockApiRoot,
          contextWithoutCustomerId,
          params
        )
      ).toThrow(SDKError);
    });
  });

  describe('updateAssociateOrder', () => {
    it('should update order by ID when id is provided', async () => {
      const mockOrder = {id: 'order-123', version: 2};
      (base.updateOrderByIdAsAssociate as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params = {
        id: 'order-123',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      };
      const result = await asAssociate.updateAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.updateOrderByIdAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'order-123',
        [{action: 'changeOrderState', orderState: 'Complete'}]
      );
      expect(result).toEqual(mockOrder);
    });

    it('should update order by orderNumber when orderNumber is provided', async () => {
      const mockOrder = {id: 'order-123', version: 2, orderNumber: 'ORD-001'};
      (base.updateOrderByOrderNumberAsAssociate as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params = {
        orderNumber: 'ORD-001',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      };
      const result = await asAssociate.updateAssociateOrder(
        mockApiRoot,
        context,
        params
      );

      expect(base.updateOrderByOrderNumberAsAssociate).toHaveBeenCalledWith(
        mockApiRoot,
        'test-project',
        'associate-123',
        'business-unit-456',
        'ORD-001',
        [{action: 'changeOrderState', orderState: 'Complete'}]
      );
      expect(result).toEqual(mockOrder);
    });

    it('should throw error when neither id nor orderNumber is provided', () => {
      const params = {
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      };

      expect(() =>
        asAssociate.updateAssociateOrder(mockApiRoot, context, params)
      ).toThrow(SDKError);
    });

    it('should throw error when businessUnitKey is missing', () => {
      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'associate-123',
      };

      const params = {
        id: 'order-123',
        version: 1,
        actions: [{action: 'changeOrderState', orderState: 'Complete'}],
      };

      expect(() =>
        asAssociate.updateAssociateOrder(
          mockApiRoot,
          contextWithoutBusinessUnit,
          params
        )
      ).toThrow(SDKError);
    });
  });
});

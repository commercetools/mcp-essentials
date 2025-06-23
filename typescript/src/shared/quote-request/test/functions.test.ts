import {
  contextToQuoteRequestFunctionMapping,
  readQuoteRequest,
  createQuoteRequest,
  updateQuoteRequest,
} from '../functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';
import * as admin from '../admin.functions';
import * as associate from '../associate.functions';

// Mock all modules
jest.mock('../customer.functions');
jest.mock('../store.functions');
jest.mock('../admin.functions');
jest.mock('../associate.functions');

const mockApiRoot = {} as any;

describe('Quote Request Functions Context Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextToQuoteRequestFunctionMapping', () => {
    it('should return associate functions when both customerId and businessUnitKey are present', () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-456',
      };

      const functions = contextToQuoteRequestFunctionMapping(context);

      expect(functions.read_quote_request).toBe(associate.readQuoteRequest);
      expect(functions.create_quote_request).toBe(associate.createQuoteRequest);
      expect(functions.update_quote_request).toBe(associate.updateQuoteRequest);
    });

    it('should return customer functions when only customerId is present', () => {
      const context = {
        customerId: 'customer-123',
      };

      const functions = contextToQuoteRequestFunctionMapping(context);

      expect(functions.read_quote_request).toBe(customer.readQuoteRequest);
      expect(functions.update_quote_request).toBe(customer.updateQuoteRequest);
    });

    it('should return store functions when only storeKey is present', () => {
      const context = {
        storeKey: 'store-789',
      };

      const functions = contextToQuoteRequestFunctionMapping(context);

      expect(functions.read_quote_request).toBe(store.readQuoteRequest);
      expect(functions.create_quote_request).toBe(store.createQuoteRequest);
      expect(functions.update_quote_request).toBe(store.updateQuoteRequest);
    });

    it('should return admin functions when isAdmin is true', () => {
      const context = {
        isAdmin: true,
      };

      const functions = contextToQuoteRequestFunctionMapping(context);

      expect(functions.read_quote_request).toBe(admin.readQuoteRequest);
      expect(functions.create_quote_request).toBe(admin.createQuoteRequest);
      expect(functions.update_quote_request).toBe(admin.updateQuoteRequest);
    });

    it('should return empty object when no context is provided', () => {
      const functions = contextToQuoteRequestFunctionMapping();

      expect(functions).toEqual({});
    });

    it('should return empty object when context is empty', () => {
      const context = {};

      const functions = contextToQuoteRequestFunctionMapping(context);

      expect(functions).toEqual({});
    });

    it('should prioritize associate functions over customer functions when both customerId and businessUnitKey are present', () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-456',
        storeKey: 'store-789',
        isAdmin: true,
      };

      const functions = contextToQuoteRequestFunctionMapping(context);

      // Should use associate functions despite other contexts being present
      expect(functions.read_quote_request).toBe(associate.readQuoteRequest);
      expect(functions.create_quote_request).toBe(associate.createQuoteRequest);
      expect(functions.update_quote_request).toBe(associate.updateQuoteRequest);
    });
  });

  describe('readQuoteRequest routing', () => {
    it('should call associate.readQuoteRequest when both customerId and businessUnitKey are present', async () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-456',
      };
      const params = {id: 'quote-request-id'};

      await readQuoteRequest(mockApiRoot, context, params);

      expect(associate.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(customer.readQuoteRequest).not.toHaveBeenCalled();
    });

    it('should call customer.readQuoteRequest when only customerId is present', async () => {
      const context = {customerId: 'customer-123'};
      const params = {id: 'quote-request-id'};

      await readQuoteRequest(mockApiRoot, context, params);

      expect(customer.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(associate.readQuoteRequest).not.toHaveBeenCalled();
    });

    it('should call store.readQuoteRequest when only storeKey is present', async () => {
      const context = {storeKey: 'store-789'};
      const params = {id: 'quote-request-id'};

      await readQuoteRequest(mockApiRoot, context, params);

      expect(store.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should call admin.readQuoteRequest when isAdmin is true', async () => {
      const context = {isAdmin: true};
      const params = {id: 'quote-request-id'};

      await readQuoteRequest(mockApiRoot, context, params);

      expect(admin.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });

    it('should call admin.readQuoteRequest as fallback when no specific context is present', async () => {
      const context = {};
      const params = {id: 'quote-request-id'};

      await readQuoteRequest(mockApiRoot, context, params);

      expect(admin.readQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });
  });

  describe('createQuoteRequest routing', () => {
    it('should call associate.createQuoteRequest when both customerId and businessUnitKey are present', async () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-456',
      };
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
      };

      await createQuoteRequest(mockApiRoot, context, params);

      expect(associate.createQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });
  });

  describe('updateQuoteRequest routing', () => {
    it('should call associate.updateQuoteRequest when both customerId and businessUnitKey are present', async () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-456',
      };
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [{action: 'setComment', comment: 'test'}],
      };

      await updateQuoteRequest(mockApiRoot, context, params);

      expect(associate.updateQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
      expect(customer.updateQuoteRequest).not.toHaveBeenCalled();
    });

    it('should call customer.updateQuoteRequest when only customerId is present', async () => {
      const context = {customerId: 'customer-123'};
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [{action: 'setComment', comment: 'test'}],
      };

      await updateQuoteRequest(mockApiRoot, context, params);

      expect(customer.updateQuoteRequest).toHaveBeenCalledWith(
        mockApiRoot,
        context,
        params
      );
    });
  });
});

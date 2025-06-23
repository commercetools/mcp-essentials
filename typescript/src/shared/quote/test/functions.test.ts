import {contextToQuoteFunctionMapping} from '../functions';
import * as customer from '../customer.functions';
import * as store from '../store.functions';
import * as associate from '../associate.functions';
import * as admin from '../admin.functions';

describe('Quote Functions Context Routing', () => {
  describe('contextToQuoteFunctionMapping', () => {
    it('should return associate functions when both customerId and businessUnitKey are present', () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-123',
      };

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({
        read_quote: associate.readQuote,
        update_quote: associate.updateQuote,
      });
    });

    it('should return customer functions when only customerId is present', () => {
      const context = {
        customerId: 'customer-123',
      };

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({
        read_quote: customer.readQuote,
        update_quote: customer.updateQuote,
      });
    });

    it('should return store functions when only storeKey is present', () => {
      const context = {
        storeKey: 'store-123',
      };

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({
        read_quote: store.readQuote,
        create_quote: store.createQuote,
        update_quote: store.updateQuote,
      });
    });

    it('should return admin functions when isAdmin is true', () => {
      const context = {
        isAdmin: true,
      };

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({
        read_quote: admin.readQuote,
        create_quote: admin.createQuote,
        update_quote: admin.updateQuote,
      });
    });

    it('should return empty object when no context is provided', () => {
      const result = contextToQuoteFunctionMapping();

      expect(result).toEqual({});
    });

    it('should return empty object when context is empty', () => {
      const context = {};

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({});
    });

    it('should prioritize associate functions over customer functions when both customerId and businessUnitKey are present', () => {
      const context = {
        customerId: 'customer-123',
        businessUnitKey: 'business-unit-123',
        storeKey: 'store-123',
        isAdmin: true,
      };

      const result = contextToQuoteFunctionMapping(context);

      expect(result).toEqual({
        read_quote: associate.readQuote,
        update_quote: associate.updateQuote,
      });
    });
  });
});

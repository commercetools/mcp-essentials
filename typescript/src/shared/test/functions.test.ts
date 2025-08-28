import {contextToFunctionMapping} from '../functions';
import {Context} from '../../types/configuration';

// Mock all the function mappings
jest.mock('../bulk/functions', () => ({
  contextToBulkFunctionMapping: jest.fn(() => ({bulkFunction: jest.fn()})),
}));
jest.mock('../business-unit/functions', () => ({
  contextToBusinessUnitFunctionMapping: jest.fn(() => ({
    businessUnitFunction: jest.fn(),
  })),
}));
jest.mock('../cart-discount/functions', () => ({
  contextToCartDiscountFunctionMapping: jest.fn(() => ({
    cartDiscountFunction: jest.fn(),
  })),
}));
jest.mock('../cart/functions', () => ({
  contextToCartFunctionMapping: jest.fn(() => ({cartFunction: jest.fn()})),
}));
jest.mock('../category/functions', () => ({
  contextToCategoryFunctionMapping: jest.fn(() => ({
    categoryFunction: jest.fn(),
  })),
}));
jest.mock('../channel/functions', () => ({
  contextToChannelFunctionMapping: jest.fn(() => ({
    channelFunction: jest.fn(),
  })),
}));
jest.mock('../customer-group/functions', () => ({
  contextToCustomerGroupFunctionMapping: jest.fn(() => ({
    customerGroupFunction: jest.fn(),
  })),
}));
jest.mock('../customer/functions', () => ({
  contextToCustomerFunctionMapping: jest.fn(() => ({
    customerFunction: jest.fn(),
  })),
}));
jest.mock('../discount-code/functions', () => ({
  contextToDiscountCodeFunctionMapping: jest.fn(() => ({
    discountCodeFunction: jest.fn(),
  })),
}));
jest.mock('../inventory/functions', () => ({
  contextToInventoryFunctionMapping: jest.fn(() => ({
    inventoryFunction: jest.fn(),
  })),
}));
jest.mock('../order/functions', () => ({
  contextToOrderFunctionMapping: jest.fn(() => ({orderFunction: jest.fn()})),
}));
jest.mock('../product-discount/functions', () => ({
  contextToProductDiscountFunctionMapping: jest.fn(() => ({
    productDiscountFunction: jest.fn(),
  })),
}));
jest.mock('../product-search/functions', () => ({
  contextToProductSearchFunctionMapping: jest.fn(() => ({
    productSearchFunction: jest.fn(),
  })),
}));
jest.mock('../product-selection/functions', () => ({
  contextToProductSelectionFunctionMapping: jest.fn(() => ({
    productSelectionFunction: jest.fn(),
  })),
}));
jest.mock('../product-type/functions', () => ({
  contextToProductTypeFunctionMapping: jest.fn(() => ({
    productTypeFunction: jest.fn(),
  })),
}));
jest.mock('../products/functions', () => ({
  contextToProductFunctionMapping: jest.fn(() => ({
    productFunction: jest.fn(),
  })),
}));
jest.mock('../project/functions', () => ({
  contextToProjectFunctionMapping: jest.fn(() => ({
    projectFunction: jest.fn(),
  })),
}));
jest.mock('../quote/functions', () => ({
  contextToQuoteFunctionMapping: jest.fn(() => ({quoteFunction: jest.fn()})),
}));
jest.mock('../quote-request/functions', () => ({
  contextToQuoteRequestFunctionMapping: jest.fn(() => ({
    quoteRequestFunction: jest.fn(),
  })),
}));
jest.mock('../staged-quote/functions', () => ({
  contextToStagedQuoteFunctionMapping: jest.fn(() => ({
    stagedQuoteFunction: jest.fn(),
  })),
}));
jest.mock('../standalone-price/functions', () => ({
  contextToStandalonePriceFunctionMapping: jest.fn(() => ({
    standalonePriceFunction: jest.fn(),
  })),
}));
jest.mock('../store/functions', () => ({
  contextToStoreFunctionMapping: jest.fn(() => ({storeFunction: jest.fn()})),
}));
jest.mock('../resource-based-tools-system/functions', () => ({
  contextToResourceBasedToolSystemFunctionMapping: jest.fn(() => ({
    resourceBasedToolSystemFunction: jest.fn(),
  })),
}));

describe('contextToFunctionMapping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return function mapping without context', () => {
    const result = contextToFunctionMapping();

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');

    // Check that all expected functions are present
    expect(result.bulkFunction).toBeDefined();
    expect(result.businessUnitFunction).toBeDefined();
    expect(result.cartDiscountFunction).toBeDefined();
    expect(result.cartFunction).toBeDefined();
    expect(result.categoryFunction).toBeDefined();
    expect(result.channelFunction).toBeDefined();
    expect(result.customerGroupFunction).toBeDefined();
    expect(result.customerFunction).toBeDefined();
    expect(result.discountCodeFunction).toBeDefined();
    expect(result.inventoryFunction).toBeDefined();
    expect(result.orderFunction).toBeDefined();
    expect(result.productDiscountFunction).toBeDefined();
    expect(result.productSearchFunction).toBeDefined();
    expect(result.productSelectionFunction).toBeDefined();
    expect(result.productTypeFunction).toBeDefined();
    expect(result.productFunction).toBeDefined();
    expect(result.projectFunction).toBeDefined();
    expect(result.quoteFunction).toBeDefined();
    expect(result.quoteRequestFunction).toBeDefined();
    expect(result.stagedQuoteFunction).toBeDefined();
    expect(result.standalonePriceFunction).toBeDefined();
    expect(result.storeFunction).toBeDefined();
  });

  it('should return function mapping with admin context', () => {
    const context: Context = {isAdmin: true};
    const result = contextToFunctionMapping(context);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');

    // Verify all mapping functions were called with the context
    const {contextToBulkFunctionMapping} = require('../bulk/functions');
    const {
      contextToBusinessUnitFunctionMapping,
    } = require('../business-unit/functions');

    expect(contextToBulkFunctionMapping).toHaveBeenCalledWith(context);
    expect(contextToBusinessUnitFunctionMapping).toHaveBeenCalledWith(context);
  });

  it('should return function mapping with store context', () => {
    const context: Context = {storeKey: 'test-store'};
    const result = contextToFunctionMapping(context);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should return function mapping with customer context', () => {
    const context: Context = {customerId: 'customer-123'};
    const result = contextToFunctionMapping(context);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should return function mapping with business unit context', () => {
    const context: Context = {businessUnitKey: 'bu-key'};
    const result = contextToFunctionMapping(context);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should return function mapping with complex context', () => {
    const context: Context = {
      isAdmin: true,
      storeKey: 'test-store',
      customerId: 'customer-123',
      businessUnitKey: 'bu-key',
    };
    const result = contextToFunctionMapping(context);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should merge all function mappings correctly', () => {
    const result = contextToFunctionMapping();

    // Verify that the result contains functions from all modules
    const functionNames = Object.keys(result);
    expect(functionNames.length).toBeGreaterThan(0);

    // Each function should be callable
    functionNames.forEach((name) => {
      expect(typeof result[name]).toBe('function');
    });
  });

  it('should handle undefined context gracefully', () => {
    const result = contextToFunctionMapping(undefined);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});

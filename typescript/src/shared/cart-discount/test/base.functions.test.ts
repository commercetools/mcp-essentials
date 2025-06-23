import {
  readCartDiscountById,
  readCartDiscountByKey,
  queryCartDiscounts,
  createCartDiscount,
  updateCartDiscountById,
  updateCartDiscountByKey,
} from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock the CartDiscountUpdateAction[] type to avoid typing issues in tests
jest.mock('@commercetools/platform-sdk', () => {
  return {};
});

// Mock cart discount data
const mockCartDiscount = {
  id: 'test-cart-discount-id',
  version: 1,
  key: 'test-cart-discount',
  name: {
    en: 'Test Cart Discount',
  },
  description: {
    en: 'Test Cart Discount Description',
  },
  cartPredicate: 'totalPrice > "100 USD"',
  value: {
    type: 'relative',
    permyriad: 1000,
  },
  target: {
    type: 'lineItems',
    predicate: 'variant.sku = "TEST-SKU"',
  },
  sortOrder: '0.5',
  isActive: true,
  requiresDiscountCode: false,
  createdAt: '2023-01-01T00:00:00.000Z',
  lastModifiedAt: '2023-01-01T00:00:00.000Z',
};

// Mock cart discount list result
const mockCartDiscountList = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [mockCartDiscount],
};

// Mock ApiRoot with both regular and store-specific endpoints
const createMockApiRoot = () => {
  const mockWithId = {
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCartDiscount,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: {...mockCartDiscount, version: 2},
      }),
    }),
  };

  const mockWithKey = {
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCartDiscount,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: {...mockCartDiscount, version: 2},
      }),
    }),
  };

  const mockCartDiscounts = {
    withId: jest.fn().mockReturnValue(mockWithId),
    withKey: jest.fn().mockReturnValue(mockWithKey),
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCartDiscountList,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCartDiscount,
      }),
    }),
  };

  const mockInStoreWithStoreKeyValue = {
    cartDiscounts: jest.fn().mockReturnValue(mockCartDiscounts),
  };

  const mockWithProjectKey = {
    cartDiscounts: jest.fn().mockReturnValue(mockCartDiscounts),
    inStoreKeyWithStoreKeyValue: jest
      .fn()
      .mockReturnValue(mockInStoreWithStoreKeyValue),
  };

  return {
    withProjectKey: jest.fn().mockReturnValue(mockWithProjectKey),
  } as unknown as ApiRoot;
};

describe('Cart Discount Base Functions', () => {
  let mockApiRoot: ApiRoot;
  const projectKey = 'test-project';

  beforeEach(() => {
    mockApiRoot = createMockApiRoot();
    jest.clearAllMocks();
  });

  describe('readCartDiscountById', () => {
    it('should read a cart discount by ID', async () => {
      const result = await readCartDiscountById(
        mockApiRoot,
        projectKey,
        'test-cart-discount-id'
      );

      expect(result).toEqual(mockCartDiscount);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts
      ).toHaveBeenCalled();
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts().withId
      ).toHaveBeenCalledWith({ID: 'test-cart-discount-id'});
    });

    it('should read a cart discount by ID with expand', async () => {
      const expand = ['references[*]'];
      const result = await readCartDiscountById(
        mockApiRoot,
        projectKey,
        'test-cart-discount-id',
        expand
      );

      expect(result).toEqual(mockCartDiscount);
      const withIdMock = mockApiRoot
        .withProjectKey({projectKey})
        .cartDiscounts().withId;
      const getMock = withIdMock({ID: 'test-cart-discount-id'}).get;
      expect(getMock).toHaveBeenCalledWith({
        queryArgs: {expand},
      });
    });

    it('should read a cart discount by ID from a store', async () => {
      const storeKey = 'test-store';
      const result = await readCartDiscountById(
        mockApiRoot,
        projectKey,
        'test-cart-discount-id',
        undefined,
        storeKey
      );

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
      expect(
        mockApiRoot
          .withProjectKey({projectKey})
          .inStoreKeyWithStoreKeyValue({storeKey}).cartDiscounts
      ).toHaveBeenCalled();
    });
  });

  describe('readCartDiscountByKey', () => {
    it('should read a cart discount by key', async () => {
      const result = await readCartDiscountByKey(
        mockApiRoot,
        projectKey,
        'test-cart-discount'
      );

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts().withKey
      ).toHaveBeenCalledWith({key: 'test-cart-discount'});
    });

    it('should read a cart discount by key from a store', async () => {
      const storeKey = 'test-store';
      const result = await readCartDiscountByKey(
        mockApiRoot,
        projectKey,
        'test-cart-discount',
        undefined,
        storeKey
      );

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
    });
  });

  describe('queryCartDiscounts', () => {
    it('should query cart discounts with default parameters', async () => {
      const result = await queryCartDiscounts(mockApiRoot, projectKey);

      expect(result).toEqual(mockCartDiscountList);
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts().get
      ).toHaveBeenCalledWith({
        queryArgs: {limit: 10},
      });
    });

    it('should query cart discounts with all parameters', async () => {
      const limit = 5;
      const offset = 10;
      const sort = ['name.en asc'];
      const where = ['isActive = true'];
      const expand = ['references[*]'];

      const result = await queryCartDiscounts(
        mockApiRoot,
        projectKey,
        limit,
        offset,
        sort,
        where,
        expand
      );

      expect(result).toEqual(mockCartDiscountList);
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts().get
      ).toHaveBeenCalledWith({
        queryArgs: {
          limit,
          offset,
          sort,
          where,
          expand,
        },
      });
    });

    it('should query cart discounts from a store', async () => {
      const storeKey = 'test-store';
      const result = await queryCartDiscounts(
        mockApiRoot,
        projectKey,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        storeKey
      );

      expect(result).toEqual(mockCartDiscountList);
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
    });
  });

  describe('createCartDiscount', () => {
    it('should create a cart discount', async () => {
      const cartDiscountDraft = {
        name: {en: 'Test Cart Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "100 USD"',
        sortOrder: '0.5',
        isActive: true,
        requiresDiscountCode: false,
      };

      const result = await createCartDiscount(
        mockApiRoot,
        projectKey,
        cartDiscountDraft
      );

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey}).cartDiscounts().post
      ).toHaveBeenCalledWith({
        body: cartDiscountDraft,
      });
    });

    it('should create a cart discount in a store', async () => {
      const cartDiscountDraft = {
        name: {en: 'Test Cart Discount'},
        value: {
          type: 'relative' as const,
          permyriad: 1000,
        },
        cartPredicate: 'totalPrice > "100 USD"',
        sortOrder: '0.5',
      };
      const storeKey = 'test-store';

      const result = await createCartDiscount(
        mockApiRoot,
        projectKey,
        cartDiscountDraft,
        storeKey
      );

      expect(result).toEqual(mockCartDiscount);
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
    });
  });

  describe('updateCartDiscountById', () => {
    it('should update a cart discount by ID', async () => {
      const version = 1;
      const actions = [
        {action: 'changeName', name: {en: 'Updated Cart Discount'}},
      ];

      const result = await updateCartDiscountById(
        mockApiRoot,
        projectKey,
        'test-cart-discount-id',
        version,
        actions as any
      );

      expect(result).toEqual({...mockCartDiscount, version: 2});
      const withIdMock = mockApiRoot
        .withProjectKey({projectKey})
        .cartDiscounts().withId;
      const postMock = withIdMock({ID: 'test-cart-discount-id'}).post;
      expect(postMock).toHaveBeenCalledWith({
        body: {
          version,
          actions,
        },
      });
    });

    it('should update a cart discount by ID in a store', async () => {
      const version = 1;
      const actions = [
        {action: 'changeName', name: {en: 'Updated Cart Discount'}},
      ];
      const storeKey = 'test-store';

      const result = await updateCartDiscountById(
        mockApiRoot,
        projectKey,
        'test-cart-discount-id',
        version,
        actions as any,
        storeKey
      );

      expect(result).toEqual({...mockCartDiscount, version: 2});
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
    });
  });

  describe('updateCartDiscountByKey', () => {
    it('should update a cart discount by key', async () => {
      const version = 1;
      const actions = [
        {action: 'changeName', name: {en: 'Updated Cart Discount'}},
      ];

      const result = await updateCartDiscountByKey(
        mockApiRoot,
        projectKey,
        'test-cart-discount',
        version,
        actions as any
      );

      expect(result).toEqual({...mockCartDiscount, version: 2});
      const withKeyMock = mockApiRoot
        .withProjectKey({projectKey})
        .cartDiscounts().withKey;
      const postMock = withKeyMock({key: 'test-cart-discount'}).post;
      expect(postMock).toHaveBeenCalledWith({
        body: {
          version,
          actions,
        },
      });
    });

    it('should update a cart discount by key in a store', async () => {
      const version = 1;
      const actions = [
        {action: 'changeName', name: {en: 'Updated Cart Discount'}},
      ];
      const storeKey = 'test-store';

      const result = await updateCartDiscountByKey(
        mockApiRoot,
        projectKey,
        'test-cart-discount',
        version,
        actions as any,
        storeKey
      );

      expect(result).toEqual({...mockCartDiscount, version: 2});
      expect(
        mockApiRoot.withProjectKey({projectKey}).inStoreKeyWithStoreKeyValue
      ).toHaveBeenCalledWith({storeKey});
    });
  });
});

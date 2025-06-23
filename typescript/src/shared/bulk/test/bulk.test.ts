import {bulkCreate, bulkUpdate} from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';
import {bulkCreateParameters} from '../parameters';
import {z} from 'zod';
import {bulkUpdateParameters} from '../parameters';

// Mock the API Root
const mockExecute = jest.fn();
const mockPost = jest.fn(() => ({execute: mockExecute}));
const mockImportOrder = jest.fn(() => ({post: mockPost}));
const mockOrders = jest.fn(() => ({
  post: mockPost,
  importOrder: mockImportOrder,
}));
const mockWithProjectKey = jest.fn(() => ({
  products: jest.fn(() => ({post: mockPost})),
  customers: jest.fn(() => ({post: mockPost})),
  carts: jest.fn(() => ({post: mockPost})),
  categories: jest.fn(() => ({post: mockPost})),
  discountCodes: jest.fn(() => ({post: mockPost})),
  cartDiscounts: jest.fn(() => ({post: mockPost})),
  productDiscounts: jest.fn(() => ({post: mockPost})),
  customerGroups: jest.fn(() => ({post: mockPost})),
  standalonePrices: jest.fn(() => ({post: mockPost})),
  inventory: jest.fn(() => ({post: mockPost})),
  orders: mockOrders,
}));

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
} as unknown as ApiRoot;

const mockContext = {projectKey: 'test-project'};

// Mock the update functions only (not affecting the createProduct)
jest.mock('../../products/functions', () => {
  const originalModule = jest.requireActual('../../products/functions');
  return {
    ...originalModule,
    updateProduct: jest.fn().mockResolvedValue({id: 'mock-product-id'}),
  };
});

jest.mock('../../inventory/functions', () => {
  const originalModule = jest.requireActual('../../inventory/functions');
  return {
    ...originalModule,
    updateInventory: jest.fn().mockResolvedValue({id: 'mock-inventory-id'}),
  };
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {id: 'mock-id'}});
});

describe('bulkCreate', () => {
  it('should create multiple products in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'product' as const,
          data: {
            name: {en: 'Test Product 1'},
            productType: {id: 'type-id-1', typeId: 'product-type' as const},
            slug: {en: 'test-product-1'},
          },
        },
        {
          entityType: 'product' as const,
          data: {
            name: {en: 'Test Product 2'},
            productType: {id: 'type-id-2', typeId: 'product-type' as const},
            slug: {en: 'test-product-2'},
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(mockExecute).toHaveBeenCalledTimes(2);
  });

  it('should create an order from cart in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            id: 'cart-id-1',
            version: 1,
            orderNumber: 'ORD-001',
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should create an order from quote in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            quoteId: 'quote-id-1',
            version: 1,
            orderNumber: 'ORD-002',
          },
        },
      ],
    } as z.infer<typeof bulkCreateParameters>;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should create an order by import in bulk', async () => {
    const params = {
      items: [
        {
          entityType: 'order' as const,
          data: {
            orderNumber: 'ORD-003',
            customerId: 'customer-id-1',
            totalPrice: {
              currencyCode: 'USD',
              centAmount: 1000,
            },
            lineItems: [
              {
                id: 'line-item-1',
                productId: 'product-id-1',
                name: {en: 'Test Product'},
                variant: {
                  id: 1,
                  sku: 'SKU-001',
                },
                quantity: 1,
              },
            ],
          },
        },
      ],
    } as any;

    const result = await bulkCreate(mockApiRoot, mockContext, params);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(mockOrders).toHaveBeenCalled();
    expect(mockImportOrder).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should throw error for unsupported entity type', async () => {
    const params = {
      items: [
        {
          entityType: 'unsupported-entity',
          data: {},
        },
      ],
    } as any;

    await expect(bulkCreate(mockApiRoot, mockContext, params)).rejects.toThrow(
      'Bulk creation failed: Unsupported entity type: unsupported-entity'
    );
  });
});

describe('Bulk Functions', () => {
  describe('bulkUpdate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update multiple entities in parallel', async () => {
      // Create test parameters
      const params: z.infer<typeof bulkUpdateParameters> = {
        items: [
          {
            entityType: 'product',
            data: {
              id: 'product-id-1',
              version: 1,
              actions: [
                {
                  action: 'changeName',
                  name: {
                    en: 'Updated Product Name',
                  },
                },
              ],
            },
          },
          {
            entityType: 'inventory',
            data: {
              id: 'inventory-id-1',
              version: 1,
              actions: [
                {
                  action: 'changeQuantity',
                  quantity: 50,
                },
              ],
            },
          },
        ],
      };

      // Call the function
      const result = await bulkUpdate(
        mockApiRoot,
        {projectKey: 'test-project'},
        params
      );

      // Check the result format
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('results');
      expect(result.results).toHaveLength(2);

      // Each entity update should have been called with the correct parameters
      const {updateProduct} = require('../../products/functions');
      const {updateInventory} = require('../../inventory/functions');

      expect(updateProduct).toHaveBeenCalledWith(
        mockApiRoot,
        {projectKey: 'test-project'},
        params.items[0].data
      );

      expect(updateInventory).toHaveBeenCalledWith(
        mockApiRoot,
        {projectKey: 'test-project'},
        params.items[1].data
      );
    });

    it('should throw an error for unsupported entity types', async () => {
      // Create test parameters with an unsupported entity type
      const params: z.infer<typeof bulkUpdateParameters> = {
        items: [
          {
            entityType: 'unsupported-entity' as any,
            data: {
              id: 'unsupported-id',
              version: 1,
              actions: [],
            },
          },
        ],
      };

      // Expect the function to throw an error
      await expect(
        bulkUpdate(mockApiRoot, {projectKey: 'test-project'}, params)
      ).rejects.toThrow(
        'Bulk update failed: Unsupported entity type: unsupported-entity'
      );
    });

    it('should throw an error if any update operation fails', async () => {
      // Mock one of the update functions to throw an error
      const mockUpdateProduct =
        require('../../products/functions').updateProduct;
      mockUpdateProduct.mockImplementationOnce(() => {
        throw new Error('Failed to update product');
      });

      // Create test parameters
      const params: z.infer<typeof bulkUpdateParameters> = {
        items: [
          {
            entityType: 'product',
            data: {
              id: 'product-id-1',
              version: 1,
              actions: [
                {
                  action: 'changeName',
                  name: {
                    en: 'Updated Product Name',
                  },
                },
              ],
            },
          },
        ],
      };

      // Expect the function to throw an error
      await expect(
        bulkUpdate(mockApiRoot, {projectKey: 'test-project'}, params)
      ).rejects.toThrow('Bulk update failed: Failed to update product');
    });
  });
});

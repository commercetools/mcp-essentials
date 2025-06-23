import {AvailableNamespaces} from '../tools';

describe('types/tools.ts', () => {
  describe('AvailableNamespaces Enum', () => {
    it('should have the correct string value for Products', () => {
      expect(AvailableNamespaces.Products).toBe('products');
    });

    it('should have the correct string value for Project', () => {
      expect(AvailableNamespaces.Project).toBe('project');
    });

    it('should have the correct string value for ProductSearch', () => {
      expect(AvailableNamespaces.ProductSearch).toBe('product-search');
    });

    it('should have the correct string value for Category', () => {
      expect(AvailableNamespaces.Category).toBe('category');
    });

    it('should have the correct string value for ProductSelection', () => {
      expect(AvailableNamespaces.ProductSelection).toBe('product-selection');
    });

    it('should have the correct string value for Order', () => {
      expect(AvailableNamespaces.Order).toBe('order');
    });

    it('should have the correct string value for Cart', () => {
      expect(AvailableNamespaces.Cart).toBe('cart');
    });

    it('should have the correct string value for Customer', () => {
      expect(AvailableNamespaces.Customer).toBe('customer');
    });

    it('should have the correct string value for CustomerGroup', () => {
      expect(AvailableNamespaces.CustomerGroup).toBe('customer-group');
    });

    it('should have the correct string value for StandalonePrice', () => {
      expect(AvailableNamespaces.StandalonePrice).toBe('standalone-price');
    });

    it('should have the correct string value for ProductDiscount', () => {
      expect(AvailableNamespaces.ProductDiscount).toBe('product-discount');
    });

    it('should have the correct string value for CartDiscount', () => {
      expect(AvailableNamespaces.CartDiscount).toBe('cart-discount');
    });

    it('should have the correct string value for DiscountCode', () => {
      expect(AvailableNamespaces.DiscountCode).toBe('discount-code');
    });

    it('should have the correct string value for ProductType', () => {
      expect(AvailableNamespaces.ProductType).toBe('product-type');
    });

    it('should have the correct string value for Bulk', () => {
      expect(AvailableNamespaces.Bulk).toBe('bulk');
    });

    it('should have the correct string value for Inventory', () => {
      expect(AvailableNamespaces.Inventory).toBe('inventory');
    });

    it('should have the correct string value for Store', () => {
      expect(AvailableNamespaces.Store).toBe('store');
    });
  });

  // Note: The 'Tool' type alias defined in '../tools.ts' is a compile-time construct.
  // Its correctness is enforced by the TypeScript compiler and indirectly tested
  // by tests of functions and classes that utilize this type.
  // There are no runtime behaviors of the type alias itself to unit test directly.
});

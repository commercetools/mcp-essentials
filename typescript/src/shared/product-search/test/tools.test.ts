import {contextToTools} from '../../tools';
import {contextToProductSearchTools} from '../tools';

describe('tools', () => {
  it('should include product-search tools', () => {
    // Find search_products tool in the combined tools array
    const _configuration = {context: {isAdmin: true}};
    const tools = contextToTools(_configuration);
    const searchProductsTool = tools.find(
      (tool) => tool.method === 'search_products'
    );

    const productSearchTools = contextToProductSearchTools({isAdmin: true});

    expect(searchProductsTool).toBeDefined();
    expect(searchProductsTool).toEqual(productSearchTools[0]);
  });

  it('should have correct structure for search_products tool', () => {
    const _configuration = {context: {isAdmin: true}};
    const tools = contextToTools(_configuration);
    const searchProductsTool = tools.find(
      (tool) => tool.method === 'search_products'
    );

    expect(searchProductsTool).toMatchObject({
      method: 'search_products',
      name: 'Search Products',
      actions: {
        'product-search': {
          read: true,
        },
      },
    });

    // Verify that parameters and description exist
    expect(searchProductsTool?.parameters).toBeDefined();
    expect(searchProductsTool?.description).toBeDefined();
  });
});

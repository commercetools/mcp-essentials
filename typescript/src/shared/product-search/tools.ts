import {searchProductsPrompt} from './prompts';
import {searchProductsParameters} from './parameters';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  search_products: {
    method: 'search_products',
    name: 'Search Products',
    description: searchProductsPrompt,
    parameters: searchProductsParameters,
    actions: {
      'product-search': {
        read: true,
      },
    },
  },
};

export const contextToProductSearchTools = (context?: Context) => {
  return [tools.search_products];
};

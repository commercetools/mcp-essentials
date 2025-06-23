import {searchProductsParameters} from '../parameters';

describe('searchProductsParameters', () => {
  it('should validate valid parameters', () => {
    const validParams = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'asc',
          mode: 'min',
        },
      ],
      limit: 10,
      offset: 20,
      markMatchingVariants: true,
      productProjectionParameters: {},
      facets: [
        {
          distinct: {
            name: 'colors',
            field: 'variants.attributes.color',
            fieldType: 'text',
            limit: 10,
          },
        },
      ],
    };

    const result = searchProductsParameters.safeParse(validParams);
    expect(result.success).toBe(true);
  });

  it('should validate parameters with minimum requirements', () => {
    const minimalParams = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
    };

    const result = searchProductsParameters.safeParse(minimalParams);
    expect(result.success).toBe(true);
  });

  it('should reject parameters with invalid query object', () => {
    const invalidParams = {
      // Missing required query field
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'asc',
        },
      ],
    };

    const result = searchProductsParameters.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });

  it('should reject parameters with invalid limit', () => {
    const invalidParams = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
      limit: 101, // Over maximum of 100
    };

    const result = searchProductsParameters.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });

  it('should reject parameters with invalid offset', () => {
    const invalidParams = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
      offset: 10001, // Over maximum of 10000
    };

    const result = searchProductsParameters.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });

  it('should reject parameters with invalid sort order', () => {
    const invalidParams = {
      query: {
        fullText: {
          value: 'test product',
          locale: 'en',
        },
      },
      sort: [
        {
          field: 'variants.prices.centAmount',
          order: 'invalid', // Not 'asc' or 'desc'
        },
      ],
    };

    const result = searchProductsParameters.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });
});

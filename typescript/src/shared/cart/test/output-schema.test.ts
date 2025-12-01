import {
  cartSchema,
  cartPagedSchema,
  readCartOutputSchema,
} from '../output-schema';
import outputData from './output.data.json';

describe('Cart Output Schema', () => {
  describe('Paged Response Schema', () => {
    it('should validate real API paged response', () => {
      const result = cartPagedSchema.safeParse(outputData);
      
      if (!result.success) {
        console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
      }
      
      expect(result.success).toBe(true);
    });

    it('should have required paged fields', () => {
      expect(outputData).toHaveProperty('limit');
      expect(outputData).toHaveProperty('offset');
      expect(outputData).toHaveProperty('count');
      expect(outputData).toHaveProperty('results');
      expect(Array.isArray((outputData as any).results)).toBe(true);
    });
  });

  describe('Individual Entity Schema', () => {
    it('should validate individual entities from results', () => {
      const results = (outputData as any).results;
      
      if (results && results.length > 0) {
        const firstEntity = results[0];
        const result = cartSchema.passthrough().safeParse(firstEntity);
        
        if (!result.success) {
          console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
        }
        
        expect(result.success).toBe(true);
      } else {
        console.warn('No results in output data to validate individual entities');
      }
    });

    it('should validate all entities in results array', () => {
      const results = (outputData as any).results || [];
      
      results.forEach((entity: any, index: number) => {
        const result = cartSchema.passthrough().safeParse(entity);
        
        if (!result.success) {
          console.error(`Entity ${index} validation errors:`, JSON.stringify(result.error.format(), null, 2));
        }
        
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Read Output Schema (Union)', () => {
    it('should validate paged response', () => {
      const result = readCartOutputSchema.safeParse(outputData);
      
      if (!result.success) {
        console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
      }
      
      expect(result.success).toBe(true);
    });
  });

  describe('Schema Structure', () => {
    it('should be a valid Zod schema', () => {
      expect(cartSchema).toBeDefined();
      expect(readCartOutputSchema).toBeDefined();
      expect(cartPagedSchema).toBeDefined();
    });
  });
});

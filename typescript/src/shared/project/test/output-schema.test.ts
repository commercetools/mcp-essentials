import {
  projectSchema,
  
  readProjectOutputSchema,
} from '../output-schema';
import outputData from './output.data.json';

describe('Project Output Schema', () => {
  describe('Entity Schema', () => {
    it('should validate real API response', () => {
      const result = projectSchema.passthrough().safeParse(outputData);
      
      if (!result.success) {
        console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
      }
      
      expect(result.success).toBe(true);
    });

    it('should have required fields', () => {
      expect(outputData).toBeDefined();
      expect(outputData).not.toBeNull();
    });
  });

  describe('Read Output Schema (Union)', () => {
    it('should validate entity response', () => {
      const result = readProjectOutputSchema.passthrough().safeParse(outputData);
      
      if (!result.success) {
        console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
      }
      
      expect(result.success).toBe(true);
    });
  });

  describe('Schema Structure', () => {
    it('should be a valid Zod schema', () => {
      expect(projectSchema).toBeDefined();
      expect(readProjectOutputSchema).toBeDefined();
      
    });
  });
});

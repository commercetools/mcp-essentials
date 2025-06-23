import {
  readDiscountCode,
  createDiscountCode,
  updateDiscountCode,
} from '../functions';

// Mock for ApiRoot
const mockApiRoot = {
  withProjectKey: jest.fn().mockReturnThis(),
  discountCodes: jest.fn().mockReturnThis(),
  withId: jest.fn().mockReturnThis(),
  withKey: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  execute: jest.fn(),
};

describe('Discount Code Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readDiscountCode', () => {
    it('should read a discount code by ID', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {id: 'discount-code-id'}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({
        ID: 'discount-code-id',
      });
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should read a discount code by key', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        key: 'save10_code',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {key: 'save10_code'}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({
        key: 'save10_code',
      });
      expect(mockApiRoot.get).toHaveBeenCalled();
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should read a discount code by ID with expand', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        cartDiscounts: [
          {typeId: 'cart-discount', id: 'expanded-cart-discount'},
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {id: 'discount-code-id', expand: ['cartDiscounts[*]']}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({
        ID: 'discount-code-id',
      });
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['cartDiscounts[*]']},
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should read a discount code by key with expand', async () => {
      const mockDiscountCode = {
        id: 'discount-code-id',
        key: 'save10_code',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        cartDiscounts: [
          {typeId: 'cart-discount', id: 'expanded-cart-discount'},
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {key: 'save10_code', expand: ['cartDiscounts[*]']}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({
        key: 'save10_code',
      });
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {expand: ['cartDiscounts[*]']},
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should throw an error if SDK call fails when reading by ID', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK Read Error'));

      await expect(
        readDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {id: 'discount-code-id'}
        )
      ).rejects.toThrow('Failed to read discount code');
    });

    it('should throw an error if SDK call fails when reading by Key', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK Read Error'));

      await expect(
        readDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {key: 'some-key'}
        )
      ).rejects.toThrow('Failed to read discount code');
    });

    it('should throw an error if neither id nor key is provided', async () => {
      try {
        await readDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {}
        );
        // Should not get here if error is thrown correctly
        fail('Expected readDiscountCode to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to list discount codes');
      }
    });
  });

  describe('listDiscountCodes', () => {
    it('should list discount codes', async () => {
      const mockDiscountCodes = {
        results: [
          {
            id: 'discount-code-id-1',
            code: 'SAVE10',
            name: {en: 'Save 10%'},
          },
          {
            id: 'discount-code-id-2',
            code: 'SAVE20',
            name: {en: 'Save 20%'},
          },
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCodes,
      });

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {limit: 20}
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {limit: 20},
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCodes);
    });

    it('should list discount codes with all query parameters', async () => {
      const mockDiscountCodes = {
        results: [
          {
            id: 'discount-code-id-1',
            code: 'SAVE10',
            name: {en: 'Save 10%'},
          },
        ],
        limit: 1,
        offset: 1,
        count: 1,
        total: 1,
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCodes,
      });

      const queryArgs = {
        limit: 1,
        offset: 1,
        sort: ['name.en asc'],
        where: ['code = "SAVE10"'],
        expand: ['cartDiscounts[*]'],
      };

      const result = await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        queryArgs
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs,
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCodes);
    });

    it('should throw an error if SDK call fails during list', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK List Error'));

      await expect(
        readDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {limit: 5}
        )
      ).rejects.toThrow('Failed to list discount codes');
    });

    it('should list discount codes with default limit when no limit is provided', async () => {
      const mockDiscountCodes = {
        results: [],
        limit: 10, // Default limit
        offset: 0,
        count: 0,
        total: 0,
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCodes,
      });

      await readDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        {} // No parameters
      );

      expect(mockApiRoot.get).toHaveBeenCalledWith({
        queryArgs: {limit: 10}, // Expect default limit
      });
    });
  });

  describe('createDiscountCode', () => {
    it('should create a discount code', async () => {
      const mockDiscountCode = {
        id: 'new-discount-code-id',
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: 'cart-discount-id',
          },
        ],
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockDiscountCode,
      });

      const params = {
        code: 'SAVE10',
        name: {en: 'Save 10%'},
        isActive: true,
        cartDiscounts: [
          {
            typeId: 'cart-discount' as const,
            id: 'cart-discount-id',
          },
        ],
      };

      const result = await createDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: params,
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockDiscountCode);
    });

    it('should throw an error if SDK call fails during creation', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK Create Error'));

      const params = {
        code: 'FAIL10',
        name: {en: 'Fail 10%'},
        isActive: true,
        cartDiscounts: [
          {
            typeId: 'cart-discount' as const,
            id: 'cart-discount-id',
          },
        ],
      };

      await expect(
        createDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          params
        )
      ).rejects.toThrow('Failed to create discount code');
    });
  });

  describe('updateDiscountCode', () => {
    it('should update a discount code by ID', async () => {
      const mockUpdatedDiscountCode = {
        id: 'discount-code-id',
        version: 2,
        code: 'SAVE10',
        name: {en: 'Save 10% Updated'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockUpdatedDiscountCode,
      });

      const params = {
        id: 'discount-code-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated'},
          },
        ],
      };

      const result = await updateDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withId).toHaveBeenCalledWith({
        ID: 'discount-code-id',
      });
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Save 10% Updated'},
            },
          ],
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedDiscountCode);
    });

    it('should update a discount code by key', async () => {
      const mockUpdatedDiscountCode = {
        id: 'discount-code-id',
        key: 'save10_code',
        version: 2,
        code: 'SAVE10',
        name: {en: 'Save 10% Updated'},
      };

      mockApiRoot.execute.mockResolvedValueOnce({
        body: mockUpdatedDiscountCode,
      });

      const params = {
        key: 'save10_code',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated'},
          },
        ],
      };

      const result = await updateDiscountCode(
        mockApiRoot as any,
        {projectKey: 'test-project'},
        params
      );

      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockApiRoot.discountCodes).toHaveBeenCalled();
      expect(mockApiRoot.withKey).toHaveBeenCalledWith({
        key: 'save10_code',
      });
      expect(mockApiRoot.post).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'changeName',
              name: {en: 'Save 10% Updated'},
            },
          ],
        },
      });
      expect(mockApiRoot.execute).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedDiscountCode);
    });

    it('should throw an error if SDK call fails during update by ID', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK Update Error'));

      const params = {
        id: 'discount-code-id',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated Fail'},
          },
        ],
      };

      await expect(
        updateDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          params
        )
      ).rejects.toThrow('Failed to update discount code');
    });

    it('should throw an error if SDK call fails during update by Key', async () => {
      mockApiRoot.execute.mockRejectedValueOnce(new Error('SDK Update Error'));

      const params = {
        key: 'save10_code',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Save 10% Updated Fail'},
          },
        ],
      };

      await expect(
        updateDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          params
        )
      ).rejects.toThrow('Failed to update discount code');
    });

    it('should throw an error if neither id nor key is provided', async () => {
      try {
        await updateDiscountCode(
          mockApiRoot as any,
          {projectKey: 'test-project'},
          {version: 1, actions: []}
        );
        // Should not get here if error is thrown correctly
        fail('Expected updateDiscountCode to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Failed to update discount code');
      }
    });
  });
});

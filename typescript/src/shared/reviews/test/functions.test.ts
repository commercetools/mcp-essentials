import {readReview, createReview, updateReview} from '../functions';

// Mock the ApiRoot
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockReviews = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  reviews: mockReviews,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

// Mock context
const mockContext = {
  projectKey: 'test-project',
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockExecute.mockResolvedValue({body: {success: true}});
});

describe('Review Functions', () => {
  describe('readReview', () => {
    it('should list reviews when no id or key is provided', async () => {
      const params = {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['rating > 50'],
        expand: ['customer', 'target'],
      };

      await readReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['rating > 50'],
          expand: ['customer', 'target'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should get a specific review by ID when id is provided', async () => {
      const params = {
        id: 'test-id',
        expand: ['customer', 'target'],
      };

      await readReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer', 'target'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should get a specific review by key when key is provided', async () => {
      const params = {
        key: 'test-key',
        expand: ['customer', 'target'],
      };

      await readReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['customer', 'target'],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      const errlog = console.error;
      console.error = () => {}; // temporarily override native log fn

      mockExecute.mockRejectedValueOnce(new Error('API error'));
      const params = {limit: 10};

      await expect(
        readReview(mockApiRoot as any, mockContext, params)
      ).rejects.toThrow('API error');
      console.error = errlog; // restore native log fn
    });
  });

  describe('createReview', () => {
    it('should call the review endpoint with correct body', async () => {
      const params = {
        key: 'test-key',
        title: 'Great product!',
        text: 'This is a great product.',
        rating: 85,
        authorName: 'John Doe',
        target: {
          id: 'product-id',
          typeId: 'product' as const,
        },
      };

      await createReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          key: 'test-key',
          uniquenessValue: undefined,
          locale: undefined,
          authorName: 'John Doe',
          title: 'Great product!',
          text: 'This is a great product.',
          target: {
            id: 'product-id',
            typeId: 'product',
          },
          state: undefined,
          rating: 85,
          customer: undefined,
          custom: undefined,
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe('updateReview', () => {
    it('should update a review by ID', async () => {
      const params = {
        id: 'test-id',
        version: 1,
        actions: [
          {
            action: 'setRating' as const,
            rating: 90,
          },
        ],
      };

      await updateReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setRating',
              rating: 90,
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should update a review by key', async () => {
      const params = {
        key: 'test-key',
        version: 1,
        actions: [
          {
            action: 'setText' as const,
            text: 'Updated text',
          },
        ],
      };

      await updateReview(mockApiRoot as any, mockContext, params);

      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockReviews).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {
              action: 'setText',
              text: 'Updated text',
            },
          ],
        },
      });
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should throw an error if neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {
            action: 'setRating' as const,
            rating: 90,
          },
        ],
      };

      try {
        await updateReview(mockApiRoot as any, mockContext, params as any);
        // Should not get here if error is thrown correctly
        fail('Expected updateReview to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('Either id or key must be provided');
      }
    });
  });
});


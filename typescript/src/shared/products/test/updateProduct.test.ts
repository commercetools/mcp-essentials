import {updateProduct} from '../functions';

const mockPost = jest.fn();
const mockExecute = jest.fn();
const mockWithId = jest.fn().mockReturnValue({
  post: mockPost.mockReturnValue({
    execute: mockExecute,
  }),
});
const mockProducts = jest.fn().mockReturnValue({
  withId: mockWithId,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  products: mockProducts,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

describe('updateProduct', () => {
  beforeEach(() => {
    // Reset all mocks
    mockPost.mockClear();
    mockExecute.mockClear();
    mockWithId.mockClear();
    mockProducts.mockClear();
    mockWithProjectKey.mockClear();
  });

  it('should update a product successfully', async () => {
    const mockProductResponse = {
      id: '123',
      version: 2,
      name: {en: 'Updated Product'},
    };
    mockExecute.mockResolvedValueOnce({body: mockProductResponse});

    const params = {
      id: '123',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Product'},
        },
      ],
    };

    const result = await updateProduct(
      mockApiRoot as any,
      {projectKey: 'test'},
      params
    );

    expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey: 'test'});
    expect(mockProducts).toHaveBeenCalled();
    expect(mockWithId).toHaveBeenCalledWith({ID: '123'});
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: {en: 'Updated Product'},
          },
        ],
      },
    });
    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual(mockProductResponse);
  });

  it('should throw an error when update fails', async () => {
    mockExecute.mockRejectedValueOnce(new Error('Update failed'));

    const params = {
      id: '123',
      version: 1,
      actions: [
        {
          action: 'changeName',
          name: {en: 'Updated Product'},
        },
      ],
    };

    await expect(
      updateProduct(mockApiRoot as any, {projectKey: 'test'}, params)
    ).rejects.toThrow('Failed to update product');
  });
});

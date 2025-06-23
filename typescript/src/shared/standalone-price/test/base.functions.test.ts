import {
  readStandalonePriceById,
  readStandalonePriceByKey,
  queryStandalonePrices,
  createStandalonePrice,
  updateStandalonePriceById,
  updateStandalonePriceByKey,
} from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

describe('StandalonePrice Base Functions', () => {
  // Create more sophisticated mock implementation
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;
  let mockWithId: jest.Mock;
  let mockWithKey: jest.Mock;
  let mockStandalonePrices: jest.Mock;
  let mockApiRoot: {withProjectKey: jest.Mock};

  beforeEach(() => {
    // Initialize get and post mocks
    mockGet = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({body: {results: []}}),
    });

    mockPost = jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({body: {id: 'mock-id'}}),
    });

    // Initialize withId and withKey mocks
    mockWithId = jest.fn().mockReturnValue({
      get: mockGet,
      post: mockPost,
    });

    mockWithKey = jest.fn().mockReturnValue({
      get: mockGet,
      post: mockPost,
    });

    // Initialize standalonePrices mock
    mockStandalonePrices = jest.fn().mockReturnValue({
      get: mockGet,
      post: mockPost,
      withId: mockWithId,
      withKey: mockWithKey,
    });

    // Initialize apiRoot mock
    mockApiRoot = {
      withProjectKey: jest.fn().mockReturnValue({
        standalonePrices: mockStandalonePrices,
      }),
    };
  });

  const projectKey = 'test-project';

  describe('readStandalonePriceById', () => {
    it('should fetch standalone price by ID', async () => {
      mockGet.mockReturnValue({
        execute: jest.fn().mockResolvedValue({body: {id: 'mock-id'}}),
      });

      const result = await readStandalonePriceById(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-id'
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
    });

    it('should include expand parameter when provided', async () => {
      await readStandalonePriceById(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-id',
        ['references[*].value']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['references[*].value'],
        },
      });
    });
  });

  describe('readStandalonePriceByKey', () => {
    it('should fetch standalone price by key', async () => {
      mockGet.mockReturnValue({
        execute: jest.fn().mockResolvedValue({body: {id: 'mock-id'}}),
      });

      const result = await readStandalonePriceByKey(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-key'
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {},
      });
    });

    it('should include expand parameter when provided', async () => {
      await readStandalonePriceByKey(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-key',
        ['references[*].value']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          expand: ['references[*].value'],
        },
      });
    });
  });

  describe('queryStandalonePrices', () => {
    it('should query standalone prices with default parameters', async () => {
      mockGet.mockReturnValue({
        execute: jest.fn().mockResolvedValue({body: {results: []}}),
      });

      const result = await queryStandalonePrices(
        mockApiRoot as unknown as ApiRoot,
        projectKey
      );

      expect(result).toEqual({results: []});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
        },
      });
    });

    it('should query standalone prices with all parameters', async () => {
      await queryStandalonePrices(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        ['sku="test-sku"'],
        20,
        10,
        ['name.en asc'],
        ['references[*].value']
      );

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 20,
          offset: 10,
          sort: ['name.en asc'],
          where: ['sku="test-sku"'],
          expand: ['references[*].value'],
        },
      });
    });
  });

  describe('createStandalonePrice', () => {
    it('should create a standalone price', async () => {
      const priceDraft = {
        sku: 'test-sku',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1000,
        },
      };

      const result = await createStandalonePrice(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        priceDraft as any
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: priceDraft,
      });
    });
  });

  describe('updateStandalonePriceById', () => {
    it('should update a standalone price by ID', async () => {
      const actions = [
        {
          action: 'changeValue',
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 2000,
          },
        },
      ];

      const result = await updateStandalonePriceById(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-id',
        1,
        actions as any
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
    });
  });

  describe('updateStandalonePriceByKey', () => {
    it('should update a standalone price by key', async () => {
      const actions = [
        {
          action: 'changeValue',
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 2000,
          },
        },
      ];

      const result = await updateStandalonePriceByKey(
        mockApiRoot as unknown as ApiRoot,
        projectKey,
        'test-key',
        1,
        actions as any
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
    });
  });
});

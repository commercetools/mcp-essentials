import {
  readStandalonePrice,
  createStandalonePrice,
  updateStandalonePrice,
} from '../functions';
import {contextToStandalonePriceFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('StandalonePrice Functions', () => {
  const mockApiRoot = {
    withProjectKey: jest.fn(() => ({
      standalonePrices: jest.fn(() => ({
        get: jest.fn(() => ({
          execute: jest.fn(() => Promise.resolve({body: {results: []}})),
        })),
        post: jest.fn(() => ({
          execute: jest.fn(() => Promise.resolve({body: {id: 'mock-id'}})),
        })),
        withId: jest.fn(() => ({
          get: jest.fn(() => ({
            execute: jest.fn(() => Promise.resolve({body: {id: 'mock-id'}})),
          })),
          post: jest.fn(() => ({
            execute: jest.fn(() => Promise.resolve({body: {id: 'mock-id'}})),
          })),
        })),
        withKey: jest.fn(() => ({
          get: jest.fn(() => ({
            execute: jest.fn(() => Promise.resolve({body: {id: 'mock-id'}})),
          })),
          post: jest.fn(() => ({
            execute: jest.fn(() => Promise.resolve({body: {id: 'mock-id'}})),
          })),
        })),
      })),
    })),
  };

  const mockContext = {
    projectKey: 'test-project',
  };

  describe('readStandalonePrice', () => {
    it('should fetch standalone price by ID', async () => {
      const result = await readStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {id: 'test-id'}
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should fetch standalone price by key', async () => {
      const result = await readStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {key: 'test-key'}
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should query standalone prices with filters', async () => {
      const result = await readStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {
          limit: 5,
          where: ['sku="test-sku"'],
        }
      );

      expect(result).toEqual({results: []});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });
  });

  describe('createStandalonePrice', () => {
    it('should create a standalone price', async () => {
      const result = await createStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {
          sku: 'test-sku',
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1000,
          },
        }
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });
  });

  describe('updateStandalonePrice', () => {
    it('should update a standalone price by ID', async () => {
      const result = await updateStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {
          id: 'test-id',
          version: 1,
          actions: [
            {
              action: 'changeValue',
              value: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 2000,
              },
            },
          ],
        }
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should update a standalone price by key', async () => {
      const result = await updateStandalonePrice(
        mockApiRoot as any,
        mockContext,
        {
          key: 'test-key',
          version: 1,
          actions: [
            {
              action: 'changeValue',
              value: {
                type: 'centPrecision',
                currencyCode: 'USD',
                centAmount: 2000,
              },
            },
          ],
        }
      );

      expect(result).toEqual({id: 'mock-id'});
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
    });

    it('should throw an error if neither id nor key is provided', async () => {
      await expect(
        updateStandalonePrice(mockApiRoot as any, mockContext, {
          version: 1,
          actions: [],
        })
      ).rejects.toThrow('Failed to update standalone price');
    });
  });
});

describe('contextToStandalonePriceFunctionMapping', () => {
  it('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const functionMapping = contextToStandalonePriceFunctionMapping(context);

    expect(functionMapping.read_standalone_price).toBe(
      admin.readStandalonePrice
    );
    expect(functionMapping.create_standalone_price).toBe(
      admin.createStandalonePrice
    );
    expect(functionMapping.update_standalone_price).toBe(
      admin.updateStandalonePrice
    );
  });

  it('should return an empty object if no context is provided', () => {
    const functionMapping = contextToStandalonePriceFunctionMapping();

    expect(functionMapping).toEqual({});
  });

  it('should return an empty object if isAdmin is not true', () => {
    const context = {customerId: 'someCustomerId'};
    const functionMapping = contextToStandalonePriceFunctionMapping(context);

    expect(functionMapping).toEqual({});
  });
});

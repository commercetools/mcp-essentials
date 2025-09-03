import CommercetoolsAPI from '../api';
import {ClientBuilder} from '@commercetools/ts-client';
import {createApiBuilderFromCtpClient} from '@commercetools/platform-sdk';
import {contextToFunctionMapping} from '../functions';
import pkg from '../../../package.json';

// Mock the dependencies
jest.mock('@commercetools/ts-client');
jest.mock('@commercetools/platform-sdk');
jest.mock('../functions');

describe('CommercetoolsAPI', () => {
  const mockClient = {
    build: jest.fn(),
  };
  const mockApiRoot = {
    withProjectKey: jest.fn(),
  };
  const mockClientBuilder = {
    withHttpMiddleware: jest.fn().mockReturnThis(),
    withConcurrentModificationMiddleware: jest.fn().mockReturnThis(),
    withClientCredentialsFlow: jest.fn().mockReturnThis(),
    withUserAgentMiddleware: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue(mockClient),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ClientBuilder as jest.Mock).mockImplementation(() => mockClientBuilder);
    (createApiBuilderFromCtpClient as jest.Mock).mockReturnValue(mockApiRoot);
  });

  describe('constructor', () => {
    it('should initialize with required parameters', () => {
      const api = new CommercetoolsAPI({
        type: 'client_credentials',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        authUrl: 'https://auth.commercetools.com',
        projectKey: 'test-project',
        apiUrl: 'https://api.commercetools.com',
      });

      expect(ClientBuilder).toHaveBeenCalled();
      expect(mockClientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
        host: 'https://api.commercetools.com',
      });
      expect(
        mockClientBuilder.withConcurrentModificationMiddleware
      ).toHaveBeenCalled();
      expect(mockClientBuilder.withClientCredentialsFlow).toHaveBeenCalledWith({
        credentials: {
          clientId: 'client-id',
          clientSecret: 'client-secret',
        },
        host: 'https://auth.commercetools.com',
        projectKey: 'test-project',
      });
      expect(mockClientBuilder.build).toHaveBeenCalled();
      expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith(mockClient);
    });

    it('should initialize with context', () => {
      const context = {isAdmin: true, storeKey: 'test-store'};
      const api = new CommercetoolsAPI(
        {
          type: 'client_credentials',
          clientId: 'client-id',
          clientSecret: 'client-secret',
          authUrl: 'https://auth.commercetools.com',
          projectKey: 'test-project',
          apiUrl: 'https://api.commercetools.com',
        },
        context
      );

      expect(api).toBeDefined();
    });
  });

  describe('run', () => {
    let api: CommercetoolsAPI;
    const mockFunction = jest.fn();

    beforeEach(() => {
      api = new CommercetoolsAPI({
        type: 'client_credentials',
        clientId: 'client-id',
        clientSecret: 'client-secret',
        authUrl: 'https://auth.commercetools.com',
        projectKey: 'test-project',
        apiUrl: 'https://api.commercetools.com',
      });

      (contextToFunctionMapping as jest.Mock).mockReturnValue({
        testMethod: mockFunction,
      });
    });

    it('should call `withUserAgentMiddleware`', async () => {
      const {withUserAgentMiddleware} = mockClientBuilder;
      const mockResult = {id: 'test-id', name: 'test-name'};

      mockFunction.mockResolvedValue(mockResult);

      await api.run('testMethod', {param: 'value'});
      expect(withUserAgentMiddleware).toHaveBeenCalled();
      expect(withUserAgentMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
          libraryVersion: pkg.version,
        })
      );
    });

    it('should execute a valid method successfully', async () => {
      const mockResult = {id: 'test-id', name: 'test-name'};
      mockFunction.mockResolvedValue(mockResult);

      const result = await api.run('testMethod', {param: 'value'});

      expect(contextToFunctionMapping).toHaveBeenCalledWith(undefined);
      expect(mockFunction).toHaveBeenCalledWith(
        mockApiRoot,
        {projectKey: 'test-project'},
        {param: 'value'}
      );
      expect(result).toBe(JSON.stringify(mockResult));
    });

    it('should execute a method with context', async () => {
      const context = {isAdmin: true, storeKey: 'test-store'};
      const apiWithContext = new CommercetoolsAPI(
        {
          type: 'client_credentials',
          clientId: 'client-id',
          clientSecret: 'client-secret',
          authUrl: 'https://auth.commercetools.com',
          projectKey: 'test-project',
          apiUrl: 'https://api.commercetools.com',
        },
        context
      );

      const mockResult = {id: 'test-id'};
      mockFunction.mockResolvedValue(mockResult);

      const result = await apiWithContext.run('testMethod', {param: 'value'});

      expect(contextToFunctionMapping).toHaveBeenCalledWith(context);
      expect(mockFunction).toHaveBeenCalledWith(
        mockApiRoot,
        {
          projectKey: 'test-project',
          isAdmin: true,
          storeKey: 'test-store',
        },
        {param: 'value'}
      );
      expect(result).toBe(JSON.stringify(mockResult));
    });

    it('should throw error for invalid method', async () => {
      (contextToFunctionMapping as jest.Mock).mockReturnValue({});

      await expect(api.run('invalidMethod', {})).rejects.toThrow(
        'Invalid method invalidMethod'
      );
    });

    it('should handle function execution errors', async () => {
      const error = new Error('Function execution failed');
      mockFunction.mockRejectedValue(error);

      await expect(api.run('testMethod', {})).rejects.toThrow(
        'Function execution failed'
      );
    });

    it('should handle complex return values', async () => {
      const complexResult = {
        results: [
          {id: '1', name: 'item1'},
          {id: '2', name: 'item2'},
        ],
        total: 2,
        limit: 10,
        offset: 0,
      };
      mockFunction.mockResolvedValue(complexResult);

      const result = await api.run('testMethod', {});

      expect(result).toBe(JSON.stringify(complexResult));
    });
  });
});

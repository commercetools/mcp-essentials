/* eslint-disable no-new */
import {randomUUID} from 'node:crypto';
import express, {Express, Request, Response} from 'express';
import CommercetoolsAgentEssentialsStreamable from '../streamable';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {isInitializeRequest} from '@modelcontextprotocol/sdk/types.js';
import {CommercetoolsAgentEssentials} from '../../modelcontextprotocol';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
}));

jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    listen: jest.fn(),
  };

  const expressFunction = jest.fn(() => mockApp);
  (expressFunction as any).json = jest.fn(() => jest.fn());
  return expressFunction;
});

jest.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
  StreamableHTTPServerTransport: jest.fn(),
}));

jest.mock('@modelcontextprotocol/sdk/types.js', () => ({
  isInitializeRequest: jest.fn(),
}));

jest.mock('../../modelcontextprotocol', () => ({
  CommercetoolsAgentEssentials: {
    create: jest.fn(),
  },
}));

describe('CommercetoolsAgentEssentialsStreamable', () => {
  let mockApp: any;
  let mockServer: jest.MockedFunction<() => Promise<any>>;
  let mockCommercetoolsServer: any;
  let mockTransport: any;

  const mockAuthConfig = {
    accessToken: 'test-token',
    projectKey: 'test-project',
  } as any;

  const mockConfiguration = {
    host: 'test-host',
    apiUrl: 'test-api-url',
  } as any;

  const mockStreamableHttpOptions = {
    sessionIdGenerator: jest.fn().mockReturnValue('custom-session-id'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    console.error = jest.fn();
    mockApp = {
      use: jest.fn(),
      post: jest.fn(),
      get: jest.fn(),
      listen: jest.fn(),
    };
    (express as jest.MockedFunction<typeof express>).mockReturnValue(mockApp);

    mockCommercetoolsServer = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };
    mockServer = jest.fn().mockResolvedValue(mockCommercetoolsServer);

    mockTransport = {
      handleRequest: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      sessionId: 'test-session-id',
      onclose: undefined,
    };
    (StreamableHTTPServerTransport as jest.Mock).mockImplementation(
      () => mockTransport
    );

    (CommercetoolsAgentEssentials.create as jest.Mock).mockResolvedValue(
      mockCommercetoolsServer
    );

    (randomUUID as jest.Mock).mockReturnValue('mock-uuid-123');
  });

  describe('Constructor', () => {
    test('should initialize with default express app when none provided', () => {
      new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      expect(express).toHaveBeenCalled();
      expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
      expect(mockApp.post).toHaveBeenCalledWith('/mcp', expect.any(Function));
      expect(mockApp.get).toHaveBeenCalledWith('/mcp', expect.any(Function));
    });

    test('should use provided express app', () => {
      const customApp = {...mockApp};
      new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
        app: customApp,
      } as any);

      expect(express).not.toHaveBeenCalled();
      expect(customApp.use).toHaveBeenCalledWith(expect.any(Function));
    });

    test('should setup middleware and routes', () => {
      new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      expect(mockApp.use).toHaveBeenCalled();
      expect(mockApp.post).toHaveBeenCalledWith('/mcp', expect.any(Function));
      expect(mockApp.get).toHaveBeenCalledWith('/mcp', expect.any(Function));
    });
  });

  describe('POST /mcp endpoint - Stateless mode (default)', () => {
    let instance: CommercetoolsAgentEssentialsStreamable;
    let postHandler: (req: any, res: any) => void;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
      instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
        streamableHttpOptions: mockStreamableHttpOptions,
      });

      const postCall = mockApp.post.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );
      postHandler = postCall[1];

      mockReq = {
        headers: {},
        body: {method: 'test'},
      };

      mockRes = {
        on: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        headersSent: false,
      };
    });

    test('should handle request with authorization token', async () => {
      mockReq.headers = {authorization: 'Bearer new-auth-token'};

      await postHandler(mockReq, mockRes);

      expect(StreamableHTTPServerTransport).toHaveBeenCalledWith({
        ...mockStreamableHttpOptions,
        sessionIdGenerator: undefined,
      });
      expect(mockServer).toHaveBeenCalled();
      expect(mockCommercetoolsServer.connect).toHaveBeenCalledWith(
        mockTransport
      );
      expect(mockTransport.handleRequest).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockReq.body
      );
    });

    test('should handle request without authorization token', async () => {
      await postHandler(mockReq, mockRes);

      expect(mockTransport.handleRequest).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockReq.body
      );
    });

    test('should setup cleanup on response close', async () => {
      await postHandler(mockReq, mockRes);

      expect(mockRes.on).toHaveBeenCalledWith('close', expect.any(Function));

      const closeHandler = (mockRes.on as jest.Mock).mock.calls[0][1];
      await closeHandler();

      expect(mockTransport.close).toHaveBeenCalled();
      expect(mockCommercetoolsServer.close).toHaveBeenCalled();
    });

    test('should handle transport errors gracefully', async () => {
      const error = new Error('Transport error');
      mockTransport.handleRequest.mockRejectedValue(error);

      await postHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    });

    test('should not send error response if headers already sent', async () => {
      mockRes.headersSent = true;
      mockTransport.handleRequest.mockRejectedValue(new Error('Test error'));

      await postHandler(mockReq, mockRes);

      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('POST /mcp endpoint - Stateful mode', () => {
    let instance: CommercetoolsAgentEssentialsStreamable;
    let postHandler: (req: any, res: any) => void;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
      instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
        stateless: false,
        streamableHttpOptions: mockStreamableHttpOptions,
      });

      const postCall = mockApp.post.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );
      postHandler = postCall[1];

      mockReq = {
        headers: {},
        body: {method: 'initialize', params: {}},
      };

      mockRes = {
        on: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        headersSent: false,
      };
    });

    test('should create new transport for initialize request', async () => {
      (isInitializeRequest as unknown as jest.Mock).mockReturnValue(true);

      await postHandler(mockReq, mockRes);
      const transportCall = (StreamableHTTPServerTransport as jest.Mock).mock
        .calls[0][0];

      transportCall.onsessioninitialized('existing-session-id');
      await new Promise(setImmediate);

      expect(StreamableHTTPServerTransport).toHaveBeenCalledWith({
        sessionIdGenerator: mockStreamableHttpOptions.sessionIdGenerator,
        onsessioninitialized: expect.any(Function),
      });
      expect(mockCommercetoolsServer.connect).toHaveBeenCalledWith(
        mockTransport
      );
    });

    test('should use randomUUID when sessionIdGenerator not provided', async () => {
      instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
        stateless: false,
        streamableHttpOptions: {
          sessionIdGenerator: undefined,
        },
      });
      const postCall = mockApp.post.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );
      postHandler = postCall[1];
      (isInitializeRequest as unknown as jest.Mock).mockReturnValue(true);
      await postHandler(mockReq, mockRes);
      expect(StreamableHTTPServerTransport).toHaveBeenCalled();
    });

    test('should return 400 for invalid session request', async () => {
      (isInitializeRequest as unknown as jest.Mock).mockReturnValue(false);
      mockReq.headers = {}; // No session ID

      await postHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
    });

    test('should handle existing session ID', async () => {
      (isInitializeRequest as unknown as jest.Mock).mockReturnValue(true);
      await postHandler(mockReq, mockRes);

      const transportCall = (StreamableHTTPServerTransport as jest.Mock).mock
        .calls[0][0];
      transportCall.onsessioninitialized('existing-session-id');

      jest.clearAllMocks();
      mockReq.headers = {'mcp-session-id': 'existing-session-id'};

      await postHandler(mockReq, mockRes);

      expect(StreamableHTTPServerTransport).not.toHaveBeenCalled();
      expect(mockTransport.handleRequest).toHaveBeenCalledWith(
        mockReq,
        mockRes,
        mockReq.body
      );
    });

    test('should setup transport cleanup on close', async () => {
      (isInitializeRequest as unknown as jest.Mock).mockReturnValue(true);

      await postHandler(mockReq, mockRes);

      expect(typeof mockTransport.onclose).toBe('function');

      // Simulate transport close
      mockTransport.onclose();
      expect(mockTransport.onclose).toBeDefined();
    });
  });

  describe('getServer method (private)', () => {
    test('should return provided server', async () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      const result = await (instance as any).getServer();

      expect(mockServer).toHaveBeenCalled();
      expect(result).toBe(mockCommercetoolsServer);
    });

    test('should call provided server with the sessionId', async () => {
      const _mockServer = jest
        .fn()
        .mockImplementation((sessionId: string) => mockServer);
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: _mockServer,
      } as any);

      const sessionId = 'test-session-id';
      await (instance as any).getServer(sessionId);

      expect(_mockServer).toHaveBeenCalled();
      expect(_mockServer).toHaveBeenCalledWith(sessionId);
    });

    test('should return provided server with session ID', async () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      const result = await (instance as any).getServer('test-session-id');

      expect(mockServer).toHaveBeenCalled();
      expect(result).toBe(mockCommercetoolsServer);
    });

    test('should create server when not provided', async () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        stateless: false,
      } as any);

      const result = await (instance as any).getServer('session-123');

      expect(CommercetoolsAgentEssentials.create).toHaveBeenCalledWith({
        authConfig: mockAuthConfig,
        configuration: {
          ...mockConfiguration,
          context: {
            ...mockConfiguration.context,
            mode: 'stateful',
            sessionId: 'session-123',
          },
        },
      });
      expect(result).toBe(mockCommercetoolsServer);
    });

    test('should create server with stateless mode', async () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        stateless: true,
      } as any);

      const result = await (instance as any).getServer();

      expect(CommercetoolsAgentEssentials.create).toHaveBeenCalledWith({
        authConfig: mockAuthConfig,
        configuration: {
          ...mockConfiguration,
          context: {
            ...mockConfiguration.context,
            mode: 'stateless',
            sessionId: undefined,
          },
        },
      });
      expect(result).toBe(mockCommercetoolsServer);
    });
  });

  describe('listen method', () => {
    test('should call app.listen with port and callback', () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);
      const callback = jest.fn();

      instance.listen(3000, callback);

      expect(mockApp.listen).toHaveBeenCalledWith(3000, callback);
    });

    test('should call app.listen with port only', () => {
      const instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      instance.listen(8080);

      expect(mockApp.listen).toHaveBeenCalledWith(8080, undefined);
    });
  });

  describe('GET /mcp endpoint', () => {
    test('should register GET endpoint', () => {
      new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      const getCall = mockApp.get.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );
      expect(getCall).toBeDefined();
      expect(getCall[1]).toBeInstanceOf(Function);
    });

    test('should handle GET requests (noop)', async () => {
      new CommercetoolsAgentEssentialsStreamable({
        authConfig: mockAuthConfig,
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      const getCall = mockApp.get.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );

      const getHandler = getCall[1];
      await expect(getHandler({}, {})).resolves.toBeUndefined();
    });
  });

  describe('Authorization token handling', () => {
    let instance: CommercetoolsAgentEssentialsStreamable;
    let postHandler: (req: any, res: any) => void;

    beforeEach(() => {
      instance = new CommercetoolsAgentEssentialsStreamable({
        authConfig: {...mockAuthConfig, accessToken: 'original-token'},
        configuration: mockConfiguration,
        server: mockServer,
      } as any);

      const postCall = mockApp.post.mock.calls.find(
        (call: any) => call[0] === '/mcp'
      );
      postHandler = postCall[1];
    });

    test('should prioritize authorization header token', async () => {
      const mockReq = {
        headers: {authorization: 'Bearer header-token'},
        body: {},
      };
      const mockRes = {
        on: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        headersSent: false,
      };

      await postHandler(mockReq, mockRes);
      expect(mockServer).toHaveBeenCalled();
    });

    test('should fallback to config token when no header', async () => {
      const mockReq = {
        headers: {},
        body: {},
      };
      const mockRes = {
        on: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        headersSent: false,
      };

      await postHandler(mockReq, mockRes);
      expect(mockServer).toHaveBeenCalled();
    });
  });
});

import CommercetoolsAgentEssentials from '../essentials';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../../shared/api';
import { isToolAllowed } from '../../shared/configuration';
import { Configuration, Context } from '../../types/configuration';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('../../shared/api');
jest.mock('../../shared/configuration', () => ({
  isToolAllowed: jest.fn(),
  processConfigurationDefaults: jest.fn((config) => config), // Pass through the configuration unchanged
}));

jest.mock('../../shared/tools', () => {
  const { z: localZ } = require('zod'); // Require z inside the factory
  return {
    contextToTools: (context: Context) => [
      {
        method: 'mcpTool1',
        description: 'Description for MCP tool 1',
        parameters: localZ.object({
          paramA: localZ.string().describe('Param A'),
        }),
        namespace: 'cart',
        actions: {
          cart: {
            read: true,
          },
        },
        name: 'mcpTool1',
      },
      {
        method: 'mcpTool2',
        description: 'Description for MCP tool 2',
        parameters: localZ.object({
          paramB: localZ.number().describe('Param B'),
        }),
        namespace: 'product',
        actions: {
          products: {
            read: true,
          },
        },
        name: 'mcpTool2',
      },
    ],
  };
});

let mockSharedToolsData: any[]; // To hold the data for assertions

describe('CommercetoolsAgentEssentials (ModelContextProtocol)', () => {
  const mockConfiguration: Configuration = {
    actions: {
      products: {
        read: true,
      },
      cart: {
        read: true,
      },
    },
    context: {
      isAdmin: true,
    },
  };
  let mockCommercetoolsAPIInstance: jest.Mocked<CommercetoolsAPI>;
  let mockToolMethod: jest.Mock;

  beforeAll(() => {
    // Load the mocked definitions for use in tests
    const { contextToTools } = require('../../shared/tools');
    mockSharedToolsData = contextToTools({ isAdmin: true });
  });

  beforeEach(() => {
    // Reset mocks
    (McpServer as jest.Mock).mockClear();
    (CommercetoolsAPI as jest.Mock).mockClear();
    (isToolAllowed as jest.Mock).mockClear();

    // Setup mockToolMethod for the McpServer's tool method
    mockToolMethod = jest.fn();

    // Set up McpServer mock to handle the fact that CommercetoolsAgentEssentials extends it
    (McpServer as jest.Mock).mockImplementation(function (this: any) {
      this.tool = mockToolMethod;
    });

    mockCommercetoolsAPIInstance = new CommercetoolsAPI(
      {
        type: 'client_credentials',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        authUrl: 'authUrl',
        projectKey: 'projectKey',
        apiUrl: 'apiUrl',
      },
      mockConfiguration.context
    ) as jest.Mocked<CommercetoolsAPI>;
    mockCommercetoolsAPIInstance.run = jest.fn();
    (CommercetoolsAPI as jest.Mock).mockImplementation(
      () => mockCommercetoolsAPIInstance
    );

    (isToolAllowed as jest.Mock).mockImplementation(
      (tool, config: Configuration) => {
        if (tool.method === 'mcpTool1' && config?.actions?.cart?.read)
          return true;
        if (tool.method === 'mcpTool2' && config?.actions?.products?.read)
          return true;
        return false;
      }
    );
  });

  it('should call McpServer constructor with correct parameters', () => {
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: mockConfiguration,
    });
    expect(McpServer).toHaveBeenCalledWith(
      {
        name: 'Commercetools',
        version: '0.4.0',
      },
      {
        capabilities: {
          tools: {
            listChanged: true,
          },
        },
      }
    );
  });

  it('should initialize CommercetoolsAPI', () => {
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: mockConfiguration,
    });
    expect(CommercetoolsAPI).toHaveBeenCalledWith(
      {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      mockConfiguration.context
    );
  });

  it('should filter tools and register allowed tools with McpServer when registerAdminTools is called', () => {
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: mockConfiguration,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockSharedToolsData.length);
    expect(mockToolMethod).toHaveBeenCalledTimes(2); // mcpTool1 and mcpTool2

    // Check if registerTool was called with the correct parameters
    expect(mockToolMethod).toHaveBeenCalledWith(
      mockSharedToolsData[0].method,
      mockSharedToolsData[0].description,
      expect.any(Object),
      expect.any(Function) // Handler function
    );
    expect(mockToolMethod).toHaveBeenCalledWith(
      mockSharedToolsData[1].method,
      mockSharedToolsData[1].description,
      expect.any(Object),
      expect.any(Function) // Handler function
    );
  });

  it('handler function should call commercetoolsAPI.run and format result', async () => {
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: mockConfiguration,
    });

    // Get the handler from the mock call
    const toolCallArgs = mockToolMethod.mock.calls[0];
    const handler = toolCallArgs[3]; // The async handler function
    const toolMethod = toolCallArgs[0];

    const handlerArg = { paramA: 'testValue' };
    const apiResult = { data: 'api success' };
    mockCommercetoolsAPIInstance.run.mockResolvedValue(apiResult as any); // Cast to any here

    const result = await handler(handlerArg, {}); // {} for _extra

    expect(mockCommercetoolsAPIInstance.run).toHaveBeenCalledWith(
      toolMethod,
      handlerArg
    );
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: String(apiResult),
        },
      ],
    });
  });

  it('should correctly handle no tools being allowed', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(false); // Disallow all tools
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: { enabledTools: [] } as any,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockSharedToolsData.length);
    expect(mockToolMethod).not.toHaveBeenCalled();
  });
});

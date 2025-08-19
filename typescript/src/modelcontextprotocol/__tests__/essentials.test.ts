import CommercetoolsAgentEssentials from '../essentials';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../../shared/api';
import {isToolAllowed} from '../../shared/configuration';
import {Configuration, Context} from '../../types/configuration';
import {scopesToActions} from '../../utils/scopes';

// Mock dependencies
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('../../shared/api');
jest.mock('../../shared/configuration', () => ({
  isToolAllowed: jest.fn(),
  processConfigurationDefaults: jest.fn((config) => config), // Pass through the configuration unchanged
}));

jest.mock('../../shared/tools', () => {
  const {z: localZ} = require('zod'); // Require z inside the factory
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
  jest.mock('../../utils/scopes', () => {
    return {
      scopesToActions: jest.fn(),
    };
  });

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
    const {contextToTools} = require('../../shared/tools');
    mockSharedToolsData = contextToTools({isAdmin: true});
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
    mockCommercetoolsAPIInstance.introspect = jest
      .fn()
      .mockImplementation(function () {
        return ['manage_project'];
      });

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
    expect(McpServer).toHaveBeenCalledWith({
      name: 'Commercetools',
      version: '0.4.0',
    });
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

  it('should filter tools and register allowed tools with McpServer when registerAdminTools is called', async () => {
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

    await new Promise(setImmediate); // since init is async, wait for async operations to complete
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
    await new Promise(setImmediate);
    const toolCallArgs = mockToolMethod.mock.calls[0];
    const handler = toolCallArgs[3]; // The async handler function
    const toolMethod = toolCallArgs[0];

    const handlerArg = {paramA: 'testValue'};
    const apiResult = {data: 'api success'};
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

  it('should correctly handle no tools being allowed', async () => {
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
      configuration: {enabledTools: []} as any,
    });

    await new Promise(setImmediate);
    expect(isToolAllowed).toHaveBeenCalledTimes(mockSharedToolsData.length);
    expect(mockToolMethod).not.toHaveBeenCalled();
  });

  describe('::scopeToActions [filter configured actions based on token scopes]', () => {
    it('should introspect a token on initialization', () => {
      // eslint-disable-next-line no-new
      new CommercetoolsAgentEssentials({
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

      expect(mockCommercetoolsAPIInstance.introspect).toHaveBeenCalled();
      expect(mockCommercetoolsAPIInstance.introspect()).toEqual([
        'manage_project',
      ]);
    });

    it('should only be able to view a project', () => {
      const scope: Array<string> = ['view_project'];
      const config: Configuration = {
        actions: {
          project: {
            read: true,
            create: true,
            update: false,
          },
          products: {
            read: true,
            create: true,
          },
          cart: {
            read: true,
          },
        },
      };

      const actions = scopesToActions(scope, config);

      expect(actions).toEqual({project: {read: true}});
      expect(true).toEqual(true);
    });

    it('should only be able manage [read, create, update] a products', () => {
      const actions = scopesToActions(['manage_products'], {
        actions: {
          project: {
            read: true,
            create: true,
            update: false,
          },
          products: {
            read: true,
            create: true,
          },
        },
      });

      expect(actions).toEqual({
        products: {read: true, create: true},
      });
    });

    it('should filter out actions that are not permitted by token scope', () => {
      const actions = scopesToActions(['manage_business_unit', 'view_cart'], {
        actions: {
          inventory: {
            read: true,
            create: false,
            update: false,
          },
          'business-unit': {
            read: true,
            create: true,
            update: false,
          },
          cart: {
            read: true,
            create: true,
            update: true,
          },
        },
      });

      expect(actions).toEqual({
        'business-unit': {read: true, create: true, update: false},
        cart: {read: true},
      });
    });

    it('should respect admin scopes [support for all coco endpoints]', () => {
      const configuredActions: Configuration = {
        actions: {
          inventory: {
            read: true,
            create: false,
            update: false,
          },
          'business-unit': {
            read: true,
            create: true,
            update: false,
          },
          cart: {
            read: true,
            create: true,
            update: true,
          },
        },
      };

      const actions = scopesToActions(
        ['manage_project', 'manage_api_client'],
        configuredActions
      );

      expect(actions).toEqual(configuredActions.actions);
    });
  });

  describe('::CommercetoolsAgentEssentials []', () => {
    let _mockToolMethod: jest.Mock;
    let _mockCommercetoolsAPIInstance: jest.Mocked<CommercetoolsAPI>;

    jest.mock('../../shared/api.ts', () => ({
      introspect: jest.fn(),
    }));

    const _mockConfiguration: Configuration = {
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

    beforeEach(() => {
      // Reset mocks
      (McpServer as jest.Mock).mockClear();
      (CommercetoolsAPI as jest.Mock).mockClear();
      (isToolAllowed as jest.Mock).mockClear();

      // Setup mockToolMethod for the McpServer's tool method
      _mockToolMethod = jest.fn();

      // Set up McpServer mock to handle the fact that CommercetoolsAgentEssentials extends it
      (McpServer as jest.Mock).mockImplementation(function (this: any) {
        this.tool = _mockToolMethod;
      });

      _mockCommercetoolsAPIInstance = new CommercetoolsAPI(
        {
          type: 'client_credentials',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          authUrl: 'authUrl',
          projectKey: 'projectKey',
          apiUrl: 'apiUrl',
        },
        _mockConfiguration.context
      ) as jest.Mocked<CommercetoolsAPI>;

      _mockCommercetoolsAPIInstance.run = jest.fn();
      _mockCommercetoolsAPIInstance.introspect = jest
        .fn()
        .mockImplementation(function () {
          return ['view_cart'];
        });

      (CommercetoolsAPI as jest.Mock).mockImplementation(
        () => _mockCommercetoolsAPIInstance
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

    afterAll(() => {
      _mockCommercetoolsAPIInstance.introspect = jest
        .fn()
        .mockImplementation(function () {
          return ['view_cart'];
        });
    });

    it('init commercetoolsAgentEssentials', async () => {
      const agentEssentials = new CommercetoolsAgentEssentials({
        authConfig: {
          clientId: 'id',
          clientSecret: 'secret',
          authUrl: 'auth',
          projectKey: 'key',
          apiUrl: 'api',
          type: 'client_credentials',
        },
        configuration: _mockConfiguration,
      });

      await new Promise(setImmediate);
      expect(_mockCommercetoolsAPIInstance.introspect()).toEqual(['view_cart']);
      expect(agentEssentials.getConfig()).toEqual({
        actions: {cart: {read: true}},
        context: {isAdmin: true},
      });
    });

    it('should properly handle error', async () => {
      (_mockCommercetoolsAPIInstance.introspect as jest.Mock).mockRejectedValue(
        new Error('Simulated error in the instropsect method')
      );

      const instance = Object.create(CommercetoolsAgentEssentials.prototype);
      instance.configuration = {context: {isAdmin: true}};

      await new Promise(setImmediate);
      await expect(instance.init()).rejects.toThrow(
        /Simulated error in the instropsect method/
      );
    });
  });
});

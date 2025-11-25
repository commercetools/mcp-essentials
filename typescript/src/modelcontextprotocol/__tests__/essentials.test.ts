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
    contextToTools: (configuration: Configuration) => [
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
      toolOutputFormat: 'json',
    },
  };
  let mockCommercetoolsAPIInstance: jest.Mocked<CommercetoolsAPI>;
  let mockToolMethod: jest.Mock;

  beforeAll(() => {
    // Load the mocked definitions for use in tests
    const {contextToTools} = require('../../shared/tools');
    const _configuration = {context: {isAdmin: true}};
    mockSharedToolsData = contextToTools(_configuration);
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
      this.registerTool = mockToolMethod;
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
    CommercetoolsAgentEssentials.create({
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
    CommercetoolsAgentEssentials.create({
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
    CommercetoolsAgentEssentials.create({
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
      expect.objectContaining({
        description: mockSharedToolsData[0].description,
        inputSchema: expect.any(Object),
      }),

      expect.any(Function) // Handler function
    );
    expect(mockToolMethod).toHaveBeenCalledWith(
      mockSharedToolsData[1].method,
      expect.objectContaining({
        description: mockSharedToolsData[1].description,
        inputSchema: expect.any(Object),
      }),
      expect.any(Function) // Handler function
    );
  });

  it('handler function should call commercetoolsAPI.run and format result', async () => {
    CommercetoolsAgentEssentials.create({
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
    const handler = toolCallArgs[2]; // The async handler function
    const toolMethod = toolCallArgs[0];

    const handlerArg = {paramA: 'testValue'};
    const apiResult = {data: 'api success'};
    mockCommercetoolsAPIInstance.run.mockResolvedValue(apiResult as any); // Cast to any here

    const result = await handler(handlerArg, {}); // {} for _extra

    expect(mockCommercetoolsAPIInstance.run).toHaveBeenCalledWith(
      toolMethod,
      handlerArg,
      undefined
    );
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: `{"MCP TOOL1 RESULT":${JSON.stringify(apiResult)}}`,
        },
      ],
    });
  });

  it('should correctly handle no tools being allowed', async () => {
    (isToolAllowed as jest.Mock).mockReturnValue(false); // Disallow all tools
    CommercetoolsAgentEssentials.create({
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
      CommercetoolsAgentEssentials.create({
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

    it('should not call introspect if `clientId` and `clientSecret` are not provided', () => {
      CommercetoolsAgentEssentials.create({
        authConfig: {
          type: 'auth_token',
          accessToken: 'access-token',
          authUrl: 'auth',
          projectKey: 'key',
          apiUrl: 'api',
        },
        configuration: mockConfiguration,
      });

      expect(mockCommercetoolsAPIInstance.introspect).toHaveBeenCalledTimes(0);
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

    const getConfig = (opt: object) => ({..._mockConfiguration, ...opt});

    beforeEach(() => {
      // Reset mocks
      (McpServer as jest.Mock).mockClear();
      (CommercetoolsAPI as jest.Mock).mockClear();
      (isToolAllowed as jest.Mock).mockClear();

      // Setup mockToolMethod for the McpServer's tool method
      _mockToolMethod = jest.fn();

      // Set up McpServer mock to handle the fact that CommercetoolsAgentEssentials extends it
      (McpServer as jest.Mock).mockImplementation(function (this: any) {
        this.registerTool = _mockToolMethod;
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

    afterEach(() => {
      (McpServer as jest.Mock).mockClear();
      (CommercetoolsAgentEssentials as unknown as jest.Mock).mockClear();
      _mockCommercetoolsAPIInstance.introspect = jest
        .fn()
        .mockImplementation(function () {
          return ['view_cart'];
        });
    });

    it('init commercetoolsAgentEssentials', () => {
      const agentEssentials = CommercetoolsAgentEssentials.create({
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

      expect(_mockCommercetoolsAPIInstance.introspect()).toEqual(['view_cart']);
    });

    it('should properly handle error', () => {
      (_mockCommercetoolsAPIInstance.introspect as jest.Mock).mockRejectedValue(
        new Error('Simulated error in the instropsect method')
      );

      jest.spyOn(CommercetoolsAgentEssentials, 'create');
      expect(
        CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration: _mockConfiguration,
        })
      ).rejects.toThrow(/Simulated error in the instropsect method/);
      expect(CommercetoolsAgentEssentials.create).toHaveBeenCalled();
    });

    describe('::CustomTools', () => {
      it(`should not register custom tools if 'customTools' is not provided`, async () => {
        const config = getConfig({});
        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration: config,
        });

        expect(_mockToolMethod).toHaveBeenCalled();
        expect(_mockToolMethod).toHaveBeenCalledTimes(1);

        expect(_mockToolMethod).toHaveBeenCalledWith(
          'mcpTool1',
          expect.any(Object),
          expect.any(Function)
        );
      });

      it('should register custom tools if provided', async () => {
        const customTools = [
          {
            name: 'custom-tool',
            method: 'custom-test-tool',
            description: 'custom tool description',
            parameters: {shape: {key: 'unique-key'}},
            execute: jest.fn(),
          },
        ];

        const config = getConfig({customTools});

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration: config,
        });

        expect(_mockToolMethod).toHaveBeenCalled();
        expect(_mockToolMethod).toHaveBeenCalledTimes(2);
        expect(_mockToolMethod).toHaveBeenCalledWith(
          'custom-test-tool',
          expect.any(Object),
          expect.any(Function)
        );
      });

      it('should throw an error if the `customTools` provided is not an array', () => {
        const customTools = {};
        const config = getConfig({customTools});

        jest.spyOn(CommercetoolsAgentEssentials, 'create');

        expect(CommercetoolsAgentEssentials.create).toHaveBeenCalled();
        expect(
          CommercetoolsAgentEssentials.create({
            authConfig: {
              clientId: 'id',
              clientSecret: 'secret',
              authUrl: 'auth',
              projectKey: 'key',
              apiUrl: 'api',
              type: 'client_credentials',
            },
            configuration: config,
          })
        ).rejects.toThrow(
          `Tool Error: 'customTools' must be an array of tools`
        );
      });

      it(`should throw an error if a tool's 'execute' function is not provided`, () => {
        const customTools = [
          {
            name: 'custom-tool-no-exec-fn',
            method: 'custom-test-tool-exec-fn',
            description: 'custom tool description',
            parameters: {shape: {key: 'unique-key'}},
          },
        ];

        const getConfig = (opt: object) => ({..._mockConfiguration, ...opt});
        const config = getConfig({customTools});

        jest.spyOn(CommercetoolsAgentEssentials, 'create');

        expect(CommercetoolsAgentEssentials.create).toHaveBeenCalled();
        expect(
          CommercetoolsAgentEssentials.create({
            authConfig: {
              clientId: 'id',
              clientSecret: 'secret',
              authUrl: 'auth',
              projectKey: 'key',
              apiUrl: 'api',
              type: 'client_credentials',
            },
            configuration: config,
          })
        ).rejects.toThrow(
          `Tool Error: Please provide an 'execute' function for '${customTools[0].name}' tool.`
        );
      });

      it(`should throw an error if a tool's 'execute' property is not a function`, () => {
        const customTools = [
          {
            name: 'custom-tool-no-exec-fn',
            method: 'custom-test-tool-exec-fn',
            description: 'custom tool description',
            parameters: {shape: {key: 'unique-key'}},
            execute: 'not-a-function',
          },
        ];

        const getConfig = (opt: object) => ({..._mockConfiguration, ...opt});
        const config = getConfig({customTools});

        jest.spyOn(CommercetoolsAgentEssentials, 'create');

        expect(CommercetoolsAgentEssentials.create).toHaveBeenCalled();
        expect(
          CommercetoolsAgentEssentials.create({
            authConfig: {
              clientId: 'id',
              clientSecret: 'secret',
              authUrl: 'auth',
              projectKey: 'key',
              apiUrl: 'api',
              type: 'client_credentials',
            },
            configuration: config,
          })
        ).rejects.toThrow(
          `Tool Error: Please provide an 'execute' function for '${customTools[0].name}' tool.`
        );
      });
    });
  });

  describe('::registerTools with dynamicToolLoadingThreshold', () => {
    let mockToolMethod: jest.Mock;
    let mockCommercetoolsAPIInstance: jest.Mocked<CommercetoolsAPI>;
    let mockConsoleError: jest.SpyInstance;

    beforeEach(() => {
      // Reset mocks
      (McpServer as jest.Mock).mockClear();
      (CommercetoolsAPI as jest.Mock).mockClear();
      (isToolAllowed as jest.Mock).mockClear();

      // Setup mockToolMethod for the McpServer's tool method
      mockToolMethod = jest.fn();

      // Set up McpServer mock to handle the fact that CommercetoolsAgentEssentials extends it
      (McpServer as jest.Mock).mockImplementation(function (this: any) {
        this.registerTool = mockToolMethod;
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
        {}
      ) as jest.Mocked<CommercetoolsAPI>;

      mockCommercetoolsAPIInstance.run = jest.fn();
      mockCommercetoolsAPIInstance.introspect = jest
        .fn()
        .mockResolvedValue(['manage_project']);

      (CommercetoolsAPI as jest.Mock).mockImplementation(
        () => mockCommercetoolsAPIInstance
      );

      // Mock console.error to capture the log message
      mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      mockConsoleError.mockRestore();
    });

    describe('when filtered tools <= dynamicToolLoadingThreshold', () => {
      it('should register all filtered tools directly when tools count is below default threshold', async () => {
        let numberToolsToAllow = 2;
        // Mock only 2 tools to be allowed (below default threshold of 30)
        (isToolAllowed as jest.Mock).mockImplementation(() => {
          if (numberToolsToAllow > 0) {
            numberToolsToAllow -= 1;
            return true;
          }
          return false;
        });

        const configuration: Configuration = {
          actions: {},
          context: {},
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // Should register the 2 filtered tools directly
        expect(mockToolMethod).toHaveBeenCalledTimes(2);
        expect(mockToolMethod).toHaveBeenCalledWith(
          'mcpTool1',
          expect.any(Object),
          expect.any(Function)
        );
        expect(mockToolMethod).toHaveBeenCalledWith(
          'mcpTool2',
          expect.any(Object),
          expect.any(Function)
        );
      });

      it('should register all filtered tools when tools count equals default threshold', async () => {
        // This test demonstrates the threshold behavior
        // With the existing mock setup, we have 2 tools available
        // Since 2 <= 30 (default threshold), all tools should be registered directly

        (isToolAllowed as jest.Mock).mockReturnValue(true); // Allow all tools

        const configuration: Configuration = {
          actions: {products: {read: true}},
          context: {},
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        // With existing mock setup, should register 2 tools directly
        expect(mockToolMethod).toHaveBeenCalledTimes(2);
      });

      it('should register all filtered tools when tools count is below custom threshold', async () => {
        // This test demonstrates custom threshold behavior
        // With the existing mock setup, we have 2 tools available
        // Since 2 <= 16 (custom threshold), all tools should be registered directly

        (isToolAllowed as jest.Mock).mockReturnValue(true); // Allow all tools

        const configuration: Configuration = {
          actions: {products: {read: true}},
          context: {
            dynamicToolLoadingThreshold: 12, // Custom threshold
          },
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // With existing mock setup, should register 2 tools directly (below custom threshold of 16)
        expect(mockToolMethod).toHaveBeenCalledTimes(2);
      });
    });

    describe('when filtered tools > dynamicToolLoadingThreshold', () => {
      it('should register resource-based tool system when tools count exceeds custom threshold', async () => {
        (isToolAllowed as jest.Mock).mockReturnValue(true); // Allow all tools

        const dynamicToolLoadingThreshold = 1;
        const configuration: Configuration = {
          actions: {products: {read: true}},
          context: {
            dynamicToolLoadingThreshold, // Custom threshold
          },
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // Should register resource-based tool system (3 tools) + bulk tools (2 tools) = 5 total
        expect(mockToolMethod).toHaveBeenCalledTimes(5);
        expect(mockToolMethod).toHaveBeenCalledWith(
          'list_available_tools',
          expect.any(Object),
          expect.any(Function)
        );
        expect(mockToolMethod).toHaveBeenCalledWith(
          'inject_tools',
          expect.any(Object),
          expect.any(Function)
        );
        expect(mockToolMethod).toHaveBeenCalledWith(
          'execute_tool',
          expect.any(Object),
          expect.any(Function)
        );

        // Check that console.error was called with the expected message
        expect(mockConsoleError).toHaveBeenCalledWith(
          `Filtered tools (2) > ${dynamicToolLoadingThreshold} - Using resource based tool system`
        );
      });
    });

    describe('edge cases', () => {
      it('should handle zero filtered tools', async () => {
        // Mock no tools to be allowed
        (isToolAllowed as jest.Mock).mockReturnValue(false);

        const configuration: Configuration = {
          actions: {products: {read: true}},
          context: {},
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // Should not register any tools
        expect(mockToolMethod).not.toHaveBeenCalled();
      });

      it('should handle undefined dynamicToolLoadingThreshold in context', async () => {
        // Mock 2 tools to be allowed (below default threshold)
        (isToolAllowed as jest.Mock).mockImplementation(
          (tool, config: Configuration) => {
            if (tool.method === 'mcpTool1' && config?.actions?.cart?.read)
              return true;
            if (tool.method === 'mcpTool2' && config?.actions?.products?.read)
              return true;
            return false;
          }
        );

        const configuration: Configuration = {
          actions: {
            products: {read: true},
            cart: {read: true},
          },
          context: {
            // dynamicToolLoadingThreshold is undefined, should use default
          },
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // Should register all tools directly (using default threshold)
        expect(mockToolMethod).toHaveBeenCalledTimes(2);
      });

      it('should handle null dynamicToolLoadingThreshold in context', async () => {
        // Mock 2 tools to be allowed (below default threshold)
        (isToolAllowed as jest.Mock).mockImplementation(
          (tool, config: Configuration) => {
            if (tool.method === 'mcpTool1' && config?.actions?.cart?.read)
              return true;
            if (tool.method === 'mcpTool2' && config?.actions?.products?.read)
              return true;
            return false;
          }
        );

        const configuration: Configuration = {
          actions: {
            products: {read: true},
            cart: {read: true},
          },
          context: {
            dynamicToolLoadingThreshold: null as any, // Explicitly set to null
          },
        };

        await CommercetoolsAgentEssentials.create({
          authConfig: {
            clientId: 'id',
            clientSecret: 'secret',
            authUrl: 'auth',
            projectKey: 'key',
            apiUrl: 'api',
            type: 'client_credentials',
          },
          configuration,
        });

        await new Promise(setImmediate);

        // Should register all tools directly (using default threshold)
        expect(mockToolMethod).toHaveBeenCalledTimes(2);
      });
    });
  });
});

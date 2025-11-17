import CommercetoolsAgentEssentials from '../essentials';
import CommercetoolsAPI from '../../shared/api';
import CommercetoolsTool from '../tool';
import {isToolAllowed} from '../../shared/configuration';
import {contextToTools} from '../../shared/tools';
import {z} from 'zod';
import {Configuration, Context} from '../../types/configuration';

// Mock dependencies
jest.mock('@mastra/core/tools');
jest.mock('../../shared/api');
jest.mock('../tool');
jest.mock('../../shared/configuration', () => ({
  isToolAllowed: jest.fn(),
  processConfigurationDefaults: jest.fn((config) => config),
}));

// Mock the actual tools array if it's imported and used directly
jest.mock('../../shared/tools', () => {
  const {z: localZ} = require('zod');
  return {
    contextToTools: (context: Context) => [
      {
        method: 'tool1',
        description: 'Description for tool 1',
        parameters: localZ.object({paramA: localZ.string()}),
        namespace: 'cart',
      },
      {
        method: 'tool2',
        description: 'Description for tool 2',
        parameters: localZ.object({paramB: localZ.number()}),
        namespace: 'product',
      },
      {
        method: 'tool3',
        description: 'Description for tool 3',
        parameters: localZ.object({paramC: localZ.boolean()}),
        namespace: 'order',
      },
    ],
  };
});

const tools = contextToTools({});

describe('CommercetoolsAgentEssentials with Mastra', () => {
  const toolFormat = 'json';
  const mockConfiguration = {
    context: {isAdmin: true, toolOutputFormat: toolFormat},
    actions: {cart: {read: true}, products: {read: true}},
  } as any;
  const mockCommercetoolsAPIInstance = {} as CommercetoolsAPI;

  beforeEach(() => {
    (CommercetoolsAPI as jest.Mock).mockClear();
    (CommercetoolsTool as jest.Mock).mockClear();
    (isToolAllowed as jest.Mock).mockClear();

    // Setup default mock implementations
    (CommercetoolsAPI as jest.Mock).mockImplementation(
      () => mockCommercetoolsAPIInstance
    );
    (CommercetoolsTool as jest.Mock).mockImplementation((api, method) => ({
      api,
      method,
      description: `mocked tool ${method}`,
      parameters: z.object({}),
      execute: jest.fn(),
    }));
  });

  it('should initialize CommercetoolsAPI with constructor arguments', () => {
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

  it('should filter tools based on configuration', () => {
    (isToolAllowed as jest.Mock).mockImplementation(
      (tool, config: Configuration) => {
        if (tool.method === 'tool1' && config.actions?.cart?.read) return true;
        if (tool.method === 'tool2' && config.actions?.products?.read)
          return true;
        return false;
      }
    );

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

    expect(isToolAllowed).toHaveBeenCalledTimes(tools.length);
    expect(CommercetoolsTool).toHaveBeenCalledTimes(2); // tool1 and tool2 should be allowed

    // Detailed check for tool1
    expect(CommercetoolsTool).toHaveBeenCalledWith(
      mockCommercetoolsAPIInstance,
      tools[0].method,
      tools[0].description,
      expect.any(Object),
      toolFormat
    );
    // Detailed check for tool2
    expect(CommercetoolsTool).toHaveBeenCalledWith(
      mockCommercetoolsAPIInstance,
      tools[1].method,
      tools[1].description,
      expect.any(Object),
      toolFormat
    );
    // Ensure tool3 was filtered out
    expect(CommercetoolsTool).not.toHaveBeenCalledWith(
      expect.anything(),
      tools[2].method,
      expect.anything(),
      expect.anything(),
      toolFormat
    );

    expect(Object.keys(agentEssentials.getTools())).toContain('tool1');
    expect(Object.keys(agentEssentials.getTools())).toContain('tool2');
    expect(Object.keys(agentEssentials.getTools())).not.toContain('tool3');
  });

  it('should return all created tools via getTools method', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(true);
    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: {
        context: {isAdmin: true},
        actions: {cart: {read: true}, products: {read: true}},
      } as any,
    });

    const returnedTools = agentEssentials.getTools();
    expect(Object.keys(returnedTools).length).toBe(tools.length);
    expect(returnedTools.tool1).toBeDefined();
    expect(returnedTools.tool2).toBeDefined();
    expect(returnedTools.tool3).toBeDefined();
  });

  it('should handle empty configuration correctly (no tools enabled)', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(false);

    const agentEssentials = new CommercetoolsAgentEssentials({
      authConfig: {
        clientId: 'id',
        clientSecret: 'secret',
        authUrl: 'auth',
        projectKey: 'key',
        apiUrl: 'api',
        type: 'client_credentials',
      },
      configuration: {
        context: {isAdmin: true},
        actions: {cart: {read: false}, products: {read: false}},
      } as any,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(tools.length);
    expect(CommercetoolsTool).not.toHaveBeenCalled();
    expect(Object.keys(agentEssentials.getTools()).length).toBe(0);
  });

  it('should store tools as an object with method names as keys', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(true);
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

    const toolsObject = agentEssentials.getTools();
    expect(typeof toolsObject).toBe('object');
    expect(!Array.isArray(toolsObject)).toBe(true);
  });
});

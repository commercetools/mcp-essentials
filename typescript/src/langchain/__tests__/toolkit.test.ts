import CommercetoolsAgentToolkit from '../toolkit';
import CommercetoolsAPI from '../../shared/api';
import CommercetoolsTool from '../tool';
import {isToolAllowed} from '../../shared/configuration';
import {z} from 'zod';
import {DynamicStructuredTool} from '@langchain/core/tools';
import {Context} from '../../types/configuration';

// Mock dependencies
jest.mock('../../shared/api');
jest.mock('../tool');
jest.mock('../../shared/configuration', () => ({
  isToolAllowed: jest.fn(),
  processConfigurationDefaults: jest.fn((config) => config), // Pass through the configuration unchanged
}));

// Mock the actual tools array
jest.mock('../../shared/tools', () => {
  // Define mockToolDefinitions inside the factory or ensure it's accessible without hoisting issues
  // For this specific case, we can define it directly here.
  const {z: localZ} = require('zod'); // Require z inside the factory
  return {
    contextToTools: (context: Context) => [
      {
        method: 'lcTool1',
        name: 'lcTool1',
        description: 'Description for LC tool 1',
        parameters: localZ.object({paramA: localZ.string()}),
        namespace: 'cart',
        actions: [] as any[],
      },
      {
        method: 'lcTool2',
        name: 'lcTool2',
        description: 'Description for LC tool 2',
        parameters: localZ.object({paramB: localZ.number()}),
        namespace: 'product',
        actions: [] as any[],
      },
      {
        method: 'lcTool3',
        name: 'lcTool3',
        description: 'Description for LC tool 3',
        parameters: localZ.object({paramC: localZ.boolean()}),
        namespace: 'order',
        actions: [] as any[],
      },
    ],
  };
});

// Now, if you need to reference the mocked data structure in your tests,
// you might need to re-require it or use a helper if the structure is complex.
// For this test, direct usage of the mocked module is fine,
// or we can get the mocked tools via `require('../../shared/tools')` within the test cases if needed.
let mockToolDefinitions: any[]; // To hold the data for assertions

describe('CommercetoolsAgentToolkit (Langchain)', () => {
  const mockConfiguration = {
    enabledTools: ['cart', 'product.lcTool2'],
    context: {isAdmin: true},
  } as any;
  const mockCommercetoolsAPIInstance = {} as CommercetoolsAPI;
  const mockLangchainTool = new DynamicStructuredTool({
    name: 'mockTool',
    description: 'mock description',
    schema: z.object({}),
    func: () => Promise.resolve('mock result'),
  });

  beforeAll(() => {
    // Load the mocked definitions for use in tests
    const {contextToTools} = require('../../shared/tools');
    mockToolDefinitions = contextToTools({isAdmin: true});
  });

  beforeEach(() => {
    (CommercetoolsAPI as jest.Mock).mockClear();
    (CommercetoolsTool as jest.Mock).mockClear();
    (isToolAllowed as jest.Mock).mockClear();

    (CommercetoolsAPI as jest.Mock).mockImplementation(
      () => mockCommercetoolsAPIInstance
    );
    (CommercetoolsTool as jest.Mock).mockReturnValue(mockLangchainTool);
  });

  it('should initialize CommercetoolsAPI with constructor arguments', () => {
    const toolkit = new CommercetoolsAgentToolkit({
      clientId: 'id',
      clientSecret: 'secret',
      authUrl: 'auth',
      projectKey: 'key',
      apiUrl: 'api',
      configuration: mockConfiguration,
    });
    expect(CommercetoolsAPI).toHaveBeenCalledWith(
      'id',
      'secret',
      'auth',
      'key',
      'api',
      mockConfiguration.context
    );
  });

  it('should filter tools based on configuration and map to Langchain tools', () => {
    (isToolAllowed as jest.Mock).mockImplementation((tool, config) => {
      if (tool.method === 'lcTool1' && config.enabledTools.includes('cart'))
        return true;
      if (
        tool.method === 'lcTool2' &&
        config.enabledTools.includes('product.lcTool2')
      )
        return true;
      return false;
    });

    const toolkit = new CommercetoolsAgentToolkit({
      clientId: 'id',
      clientSecret: 'secret',
      authUrl: 'auth',
      projectKey: 'key',
      apiUrl: 'api',
      configuration: mockConfiguration,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockToolDefinitions.length);
    expect(CommercetoolsTool).toHaveBeenCalledTimes(2); // lcTool1 and lcTool2

    expect(CommercetoolsTool).toHaveBeenCalledWith(
      mockCommercetoolsAPIInstance,
      mockToolDefinitions[0].method,
      mockToolDefinitions[0].description,
      expect.any(Object)
    );
    expect(CommercetoolsTool).toHaveBeenCalledWith(
      mockCommercetoolsAPIInstance,
      mockToolDefinitions[1].method,
      mockToolDefinitions[1].description,
      expect.any(Object)
    );
    expect(CommercetoolsTool).not.toHaveBeenCalledWith(
      expect.anything(),
      mockToolDefinitions[2].method,
      expect.anything(),
      expect.anything()
    );

    expect(toolkit.tools.length).toBe(2);
    // Check if the tools in the toolkit are the mocked Langchain tools
    toolkit.tools.forEach((tool) => {
      expect(tool).toBe(mockLangchainTool);
    });
  });

  it('should return all created Langchain tools via getTools method', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(true); // Allow all
    const toolkit = new CommercetoolsAgentToolkit({
      clientId: 'id',
      clientSecret: 'secret',
      authUrl: 'auth',
      projectKey: 'key',
      apiUrl: 'api',
      configuration: {enabledTools: ['*']} as any,
    });

    const returnedTools = toolkit.getTools();
    expect(returnedTools.length).toBe(mockToolDefinitions.length);
    returnedTools.forEach((tool) => {
      expect(tool).toBe(mockLangchainTool);
    });
  });

  it('should handle empty configuration (no tools enabled)', () => {
    (isToolAllowed as jest.Mock).mockReturnValue(false); // No tools allowed
    const toolkit = new CommercetoolsAgentToolkit({
      clientId: 'id',
      clientSecret: 'secret',
      authUrl: 'auth',
      projectKey: 'key',
      apiUrl: 'api',
      configuration: {enabledTools: []} as any,
    });

    expect(isToolAllowed).toHaveBeenCalledTimes(mockToolDefinitions.length);
    expect(CommercetoolsTool).not.toHaveBeenCalled();
    expect(toolkit.tools.length).toBe(0);
  });
});

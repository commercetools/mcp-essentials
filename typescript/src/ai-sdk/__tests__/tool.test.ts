import CommercetoolsTool from '../tool';
import CommercetoolsAPI from '../../shared/api';
import {tool} from 'ai';
import {z} from 'zod';

// Mock dependencies
jest.mock('ai', () => ({
  ...jest.requireActual('ai'), // Import and retain default behavior
  tool: jest.fn((args) => args), // Mock the 'tool' function and return its args for inspection
}));

jest.mock('../../shared/api');

describe('CommercetoolsTool', () => {
  const mockCommercetoolsAPI = new CommercetoolsAPI(
    'clientId',
    'clientSecret',
    'authUrl',
    'projectKey',
    'apiUrl'
  ) as jest.Mocked<CommercetoolsAPI>;

  const testMethod = 'testMethod';
  const testDescription = 'Test Description';
  const testSchema = z.object({
    param1: z.string().describe('Parameter 1'),
    param2: z.number().optional().describe('Parameter 2'),
  });

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (tool as jest.Mock).mockClear();
    mockCommercetoolsAPI.run.mockClear();
  });

  it('should create a CoreTool with correct description and parameters', () => {
    CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    );

    expect(tool).toHaveBeenCalledTimes(1);
    const toolArgs = (tool as jest.Mock).mock.calls[0][0];
    expect(toolArgs.description).toBe(testDescription);
    expect(toolArgs.parameters).toBe(testSchema);
  });

  it('should call commercetoolsAPI.run with correct arguments when execute is called', async () => {
    const coreToolConfig = CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    ) as any; // Cast to any to access execute for testing

    const executeArgs = {param1: 'testValue'};
    mockCommercetoolsAPI.run.mockResolvedValue('API Result');

    const result = await coreToolConfig.execute(executeArgs);

    expect(mockCommercetoolsAPI.run).toHaveBeenCalledTimes(1);
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(
      testMethod,
      executeArgs
    );
    expect(result).toBe('API Result');
  });

  it('should correctly handle execute with optional parameters', async () => {
    const coreToolConfig = CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    ) as any;

    const executeArgs = {param1: 'testValue', param2: 123};
    mockCommercetoolsAPI.run.mockResolvedValue('API Result with optional');

    const result = await coreToolConfig.execute(executeArgs);
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(
      testMethod,
      executeArgs
    );
    expect(result).toBe('API Result with optional');
  });
});

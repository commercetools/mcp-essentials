import CommercetoolsTool from '../tool';
import CommercetoolsAPI from '../../shared/api';
import {createTool} from '@mastra/core/tools';
import {z} from 'zod';

// Mock dependencies
jest.mock('@mastra/core/tools');
jest.mock('../../shared/api');

describe('CommercetoolsTool', () => {
  const mockCommercetoolsAPI = new CommercetoolsAPI({
    type: 'client_credentials',
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    authUrl: 'authUrl',
    projectKey: 'projectKey',
    apiUrl: 'apiUrl',
  }) as jest.Mocked<CommercetoolsAPI>;

  const testMethod = 'testMethod';
  const testDescription = 'Test Description';
  const testSchema = z.object({
    param1: z.string().describe('Parameter 1'),
    param2: z.number().optional().describe('Parameter 2'),
  });
  const toolFormat = 'json';

  beforeEach(() => {
    (createTool as jest.Mock).mockClear();
    mockCommercetoolsAPI.run.mockClear();
  });

  it('should create a Mastra tool with correct id, description, and inputSchema', () => {
    CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    );

    expect(createTool).toHaveBeenCalledTimes(1);
    const toolArgs = (createTool as jest.Mock).mock.calls[0][0];
    expect(toolArgs.id).toBe(testMethod);
    expect(toolArgs.description).toBe(testDescription);
    expect(toolArgs.inputSchema).toBe(testSchema);
  });

  it('should call commercetoolsAPI.run with correct arguments when execute is called', async () => {
    const mastraToolConfig = CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema,
      toolFormat
    ) as any;

    const context = {param1: 'testValue'};
    const apiReturnValue = 'API Result';
    mockCommercetoolsAPI.run.mockResolvedValue(apiReturnValue);

    const result = await mastraToolConfig.execute({context});

    expect(mockCommercetoolsAPI.run).toHaveBeenCalledTimes(1);
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(testMethod, context);
    expect(result).toHaveProperty('result');
    expect(typeof result.result).toBe('string');
  });

  it('should correctly handle execute with optional parameters', async () => {
    const mastraToolConfig = CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema,
      toolFormat
    ) as any;

    const context = {param1: 'testValue', param2: 123};
    const apiReturnValue = 'API Result with optional';
    mockCommercetoolsAPI.run.mockResolvedValue(apiReturnValue);

    const result = await mastraToolConfig.execute({context});
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(testMethod, context);
    expect(result).toHaveProperty('result');
  });

  it('should have outputSchema defined as object with result string property', () => {
    const mastraToolConfig = CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    ) as any;

    expect(mastraToolConfig.outputSchema).toBeDefined();
    // Verify it's a Zod schema
    expect(mastraToolConfig.outputSchema._def).toBeDefined();
  });
});

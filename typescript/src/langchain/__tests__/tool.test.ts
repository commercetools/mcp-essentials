import CommercetoolsTool from '../tool';
import CommercetoolsAPI from '../../shared/api';
import {DynamicStructuredTool} from '@langchain/core/tools';
import {z} from 'zod';

// Mock dependencies
jest.mock('../../shared/api');

jest.mock('@langchain/core/tools', () => {
  const originalModule = jest.requireActual('@langchain/core/tools');
  // This jest.fn() will become the mocked DynamicStructuredTool
  const localMockDSTConstructor = jest.fn((args) => ({
    name: args.name,
    description: args.description,
    schema: args.schema,
    func: args.func,
  }));
  return {
    ...originalModule,
    DynamicStructuredTool: localMockDSTConstructor,
  };
});

describe('CommercetoolsTool (Langchain)', () => {
  let mockCommercetoolsAPI: jest.Mocked<CommercetoolsAPI>;

  const testMethod = 'lcTestMethod';
  const testDescription = 'Langchain Test Description';
  const testSchema = z.object({
    lcParam1: z.string().describe('LC Parameter 1'),
    lcParam2: z.boolean().optional().describe('LC Parameter 2'),
  });

  beforeEach(() => {
    mockCommercetoolsAPI = new CommercetoolsAPI({
      type: 'client_credentials',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      authUrl: 'authUrl',
      projectKey: 'projectKey',
      apiUrl: 'apiUrl',
    }) as jest.Mocked<CommercetoolsAPI>;
    mockCommercetoolsAPI.run = jest.fn();

    // Clear the mock using the imported (and now mocked) DynamicStructuredTool
    (DynamicStructuredTool as unknown as jest.Mock).mockClear();
  });

  it('should create a DynamicStructuredTool with correct name, description, and schema', () => {
    CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema
    );

    // Assert against the imported (and now mocked) DynamicStructuredTool
    expect(DynamicStructuredTool as unknown as jest.Mock).toHaveBeenCalledTimes(
      1
    );
    const toolArgs = (DynamicStructuredTool as unknown as jest.Mock).mock
      .calls[0][0];
    expect(toolArgs.name).toBe(testMethod);
    expect(toolArgs.description).toBe(testDescription);
    expect(toolArgs.schema).toBe(testSchema);
  });

  it('should call commercetoolsAPI.run and transform the result when func is called', async () => {
    CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema,
      'json'
    );
    // Access the mock's call arguments through the imported DynamicStructuredTool
    const toolConstructorArgs = (DynamicStructuredTool as unknown as jest.Mock)
      .mock.calls[0][0];
    const funcToTest = toolConstructorArgs.func;

    const executeArgs = {lcParam1: 'lcTestValue'};
    const apiResultObject = {success: true, data: 'some data'};
    mockCommercetoolsAPI.run.mockResolvedValue(apiResultObject as any);

    const result = await funcToTest(executeArgs);

    expect(mockCommercetoolsAPI.run).toHaveBeenCalledTimes(1);
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(
      testMethod,
      executeArgs
    );
    expect(result).toBe(
      `{"LC TEST METHOD RESULT":${JSON.stringify(apiResultObject)}}`
    );
  });

  it('should handle func with optional parameters and transform result', async () => {
    CommercetoolsTool(
      mockCommercetoolsAPI,
      testMethod,
      testDescription,
      testSchema,
      'json'
    );
    const toolConstructorArgs = (DynamicStructuredTool as unknown as jest.Mock)
      .mock.calls[0][0];
    const funcToTest = toolConstructorArgs.func;

    const executeArgs = {lcParam1: 'lcTestValue', lcParam2: true};
    const apiResultObject = {message: 'done'};
    mockCommercetoolsAPI.run.mockResolvedValue(apiResultObject as any);

    const result = await funcToTest(executeArgs);
    expect(mockCommercetoolsAPI.run).toHaveBeenCalledWith(
      testMethod,
      executeArgs
    );
    expect(result).toBe(
      `{"LC TEST METHOD RESULT":${JSON.stringify(apiResultObject)}}`
    );
  });
});

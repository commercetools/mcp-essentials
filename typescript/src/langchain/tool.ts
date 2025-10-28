import {z} from 'zod';
import {DynamicStructuredTool} from '@langchain/core/tools';
import {CallbackManagerForToolRun} from '@langchain/core/callbacks/manager';
import {RunnableConfig} from '@langchain/core/runnables';
import CommercetoolsAPI from '../shared/api';
import {transformToolOutput} from '../modelcontextprotocol/transform';

export default function CommercetoolsTool(
  commercetoolsAPI: CommercetoolsAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, {[x: string]: any}>
): DynamicStructuredTool {
  return new DynamicStructuredTool({
    name: method,
    description: description,
    schema: schema,
    func: async (
      arg: z.output<typeof schema>,
      _runManager?: CallbackManagerForToolRun,
      _config?: RunnableConfig
    ): Promise<string> => {
      const result = await commercetoolsAPI.run(method, arg);
      return transformToolOutput({
        title: `${method} result`,
        data: {data: result},
      });
    },
  });
}

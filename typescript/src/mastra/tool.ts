import {createTool} from '@mastra/core/tools';
import {z} from 'zod';
import CommercetoolsAPI from '../shared/api';
import {transformToolOutput} from '../modelcontextprotocol/transform';

export default function CommercetoolsTool(
  commercetoolsAPI: CommercetoolsAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, {[x: string]: any}>,
  toolOutputFormat?: 'json' | 'tabular'
) {
  return createTool({
    id: method,
    description,
    inputSchema: schema,
    outputSchema: z.object({result: z.string()}),
    execute: async ({context}) => {
      const result = await commercetoolsAPI.run(method, context);
      return {
        result: transformToolOutput({
          title: `${method} result`,
          data: result,
          format: toolOutputFormat,
        }),
      };
    },
  });
}

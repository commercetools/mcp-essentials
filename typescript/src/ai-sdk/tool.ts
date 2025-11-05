import type {Tool} from 'ai';
import {tool} from 'ai';
import {z} from 'zod';
import CommercetoolsAPI from '../shared/api';
import {transformToolOutput} from '../modelcontextprotocol/transform';

export default function CommercetoolsTool(
  commercetoolsAPI: CommercetoolsAPI,
  method: string,
  description: string,
  schema: z.ZodObject<any, any, any, any, {[x: string]: any}>,
  toolOutputFormat?: 'json' | 'tabular'
): Tool {
  return tool({
    description: description,
    parameters: schema,
    execute: async (arg: z.output<typeof schema>) => {
      const result = await commercetoolsAPI.run(method, arg);
      return transformToolOutput({
        title: `${method} result`,
        data: result,
        format: toolOutputFormat,
      });
    },
  });
}

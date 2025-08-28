import {z} from 'zod';

export const listAvailableToolsParameters = (resources: string[]) =>
  z.object({
    resourceType: z
      .enum(resources as [string, ...string[]])
      .describe('The type of resource to list available tools for'),
  });

export const injectToolsParameters = z.object({
  toolMethods: z.array(z.string()).describe('The tools to inject'),
});

export const executeToolParameters = z.object({
  toolMethod: z.string().describe('The tool method to execute'),
  arguments: z
    .record(z.any())
    .describe('The arguments to pass to the tool method'),
});

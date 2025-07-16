import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import CommercetoolsAPI from '../shared/api';
import {
  isToolAllowed,
  processConfigurationDefaults,
} from '../shared/configuration';
import { contextToTools } from '../shared/tools';
import type { Configuration } from '../types/configuration';

interface ThoughtData {
  originalQuery: string;
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
  registerTools?: string[];
  alreadyRegisteredTools?: string[];
}

class CommercetoolsAgentEssentials extends McpServer {
  private _commercetools: CommercetoolsAPI;
  private thoughtHistory: ThoughtData[] = [];
  private branches: Record<string, ThoughtData[]> = {};
  private disableThoughtLogging: boolean;
  private processedConfiguration: Configuration;

  constructor({
    clientId,
    clientSecret,
    authUrl,
    projectKey,
    apiUrl,
    configuration,
  }: {
    clientId: string;
    clientSecret: string;
    authUrl: string;
    projectKey: string;
    apiUrl: string;
    configuration: Configuration;
  }) {
    super({
      name: 'Commercetools',
      version: '0.4.0',
    }, {
      capabilities: {
        tools: {
          listChanged: true,
        },
      },
    });

    this.disableThoughtLogging = (process.env.DISABLE_THOUGHT_LOGGING || "").toLowerCase() === "true";

    // Process configuration to apply smart defaults
    this.processedConfiguration = processConfigurationDefaults(configuration);

    this._commercetools = new CommercetoolsAPI(
      clientId,
      clientSecret,
      authUrl,
      projectKey,
      apiUrl,
      this.processedConfiguration.context
    );

    // Zod schema for tool arguments
    const thoughtSchema = z.object({
      thought: z.string().describe("Your current thinking step about Commercetools operations"),
      nextThoughtNeeded: z.boolean().describe("Whether another thought step is needed"),
      thoughtNumber: z.number().int().min(1).describe("Current thought number"),
      totalThoughts: z.number().int().min(1).describe("Estimated total thoughts needed"),
      isRevision: z.boolean().optional().describe("Whether this revises previous thinking"),
      revisesThought: z.number().int().min(1).optional().describe("Which thought is being reconsidered"),
      branchFromThought: z.number().int().min(1).optional().describe("Branching point thought number"),
      branchId: z.string().optional().describe("Branch identifier"),
      needsMoreThoughts: z.boolean().optional().describe("If more thoughts are needed"),
      registerTools: z.array(z.string()).optional().describe("Tools to register"),
      alreadyRegisteredTools: z.array(z.string()).optional().describe("Tools that are already registered"),
      originalQuery: z.string().optional().describe("The original user query"),
    });

    // Register the sequential thinking tool using zod schema
    this.tool(
      'commercetools_reflective_planner',
      `Use this tool to identify the operation needed in a commercetools project. A detailed tool for dynamic and reflective problem-solving through thoughts for Commercetools operations.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- You need to execute a command or a query to a commercetools project, BUT you don't know which tools to use

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous thoughts
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative approaches

This tool DOES NOT call the tools, it only prepares the MCP server to call the tools.
Once all thoughts are done, you can use the recently registered tools to finish the operation.
`,
      thoughtSchema.shape,
      async (arg, extra) => {
        const result = await this.processThought(arg as ThoughtData);
        const parsedResult = JSON.parse(result);
        const isComplete = !parsedResult.nextThoughtNeeded;
        return {
          content: [
            {
              type: 'text' as const,
              text: String(result),
            },
          ],
          isError: isComplete, // Mark as error when planning is complete to force attention
        };
      }
    );
  }

  private formatThought(thoughtData: ThoughtData): string {
    const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId } = thoughtData;

    let prefix = '';
    let context = '';

    if (isRevision) {
      prefix = '🔄 Revision';
      context = ` (revising thought ${revisesThought})`;
    } else if (branchFromThought) {
      prefix = '🌿 Branch';
      context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
    } else {
      prefix = '💭 Thought';
      context = '';
    }

    const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
    const border = '─'.repeat(Math.max(header.length, thought.length) + 4);

    return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`;
  }

  private registerToolIfNeeded(toolName: string): boolean {
    console.error(`Registering tool: ${toolName}`);
    const allTools = contextToTools(this.processedConfiguration.context);
    const tool = allTools.find((t: any) => t.method === toolName);

    if (!tool || !isToolAllowed(tool, this.processedConfiguration)) {
      return false;
    }

    // try to register the tool, if already registered, return true
    try {

      // Register the tool dynamically (no need to check if already registered)
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: any) => {
          const result = await this._commercetools.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("already registered")) {
        return true;
      }
      console.error(`Error registering tool: ${toolName}`, error);
      return false;
    }

    return true;
  }

  private async processThought(input: ThoughtData): Promise<string> {
    try {
      // input is already validated by zod
      const validatedInput = input;

      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      this.thoughtHistory.push(validatedInput);

      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      if (!this.disableThoughtLogging) {
        const formattedThought = this.formatThought(validatedInput);
        console.error(formattedThought);
      }
      const registerTools = validatedInput.registerTools

      let toolRegistrationResult = null;

      if (registerTools && registerTools.length > 0) {
        registerTools.forEach((tool) => {
          const success = this.registerToolIfNeeded(tool);
          toolRegistrationResult = {
            requestedTool: tool,
            success,
            message: success ? `Tool '${tool}' registered successfully` : `Tool '${tool}' not available or not allowed`
          };
        });
      }

      if (!validatedInput.nextThoughtNeeded) {
        const alreadyRegisteredTools = validatedInput.alreadyRegisteredTools || [];
        const registeredToolNames = validatedInput?.registerTools || []
        const toolNames = [...new Set([...alreadyRegisteredTools, ...registeredToolNames])]
        const message = `STOP: The 'commercetools_reflective_planner' has finished preparing the tools. Before proceeding with the commercetools operation, you MUST ask the user to confirm their original query: "${validatedInput.originalQuery}".`
        return JSON.stringify({
          originalQuery: validatedInput.originalQuery,
          thoughtNumber: validatedInput.thoughtNumber,
          totalThoughts: validatedInput.totalThoughts,
          nextThoughtNeeded: validatedInput.nextThoughtNeeded,
          alreadyRegisteredTools: toolNames,
          message: message,
          nextAction: "Ask user for confirmation before executing any commercetools operations",
          requiresUserConfirmation: true
        })
      }

      return JSON.stringify({
        originalQuery: validatedInput.originalQuery,
        thoughtNumber: validatedInput.thoughtNumber,
        totalThoughts: validatedInput.totalThoughts,
        nextThoughtNeeded: validatedInput.nextThoughtNeeded,
        alreadyRegisteredTools: [...(validatedInput.alreadyRegisteredTools ?? []), ...(validatedInput.registerTools ?? [])],
        branches: Object.keys(this.branches),
        thoughtHistoryLength: this.thoughtHistory.length,
        toolRegistrationResult,
        availableCommercetools: {
          dynamicToolRegistration: "Now please pass 'registerTools' in your thought to register specific tools",
          availableTools: contextToTools(this.processedConfiguration.context)
            .filter((tool: any) => isToolAllowed(tool, this.processedConfiguration))
            .map((tool: any) => tool.method)
        },
        nextAction: "Continue thinking"

      }, null, 2);
    } catch (error) {
      return JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        status: 'failed'
      }, null, 2);
    }
  }
}

export default CommercetoolsAgentEssentials;

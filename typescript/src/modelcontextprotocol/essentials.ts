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
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
  toolsToRegister?: string[];
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
      toolsToRegister: z.array(z.string()).optional().describe("Tools to register"),
    });

    // Register the sequential thinking tool using zod schema
    this.tool(
      'commercetools_reflective_planner',
      `Use this tool to identify the operation needed in a commercetools project. A detailed tool for dynamic and reflective problem-solving through thoughts for Commercetools operations.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex Commercetools problems into steps
- Planning and design with room for revision
- Analysis of product, cart, order, customer management workflows
- Problems where the full scope might not be clear initially
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous thoughts
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative approaches
- Not every thought needs to build linearly - you can branch or backtrack
- Generates a solution hypothesis for Commercetools operations
- Verifies the hypothesis based on the Chain of Thought steps
- Repeats the process until satisfied
- Provides a correct answer for Commercetools implementation

Parameters explained:
- thought: Your current thinking step about Commercetools operations
- next_thought_needed: True if you need more thinking, even if at what seemed like the end
- thought_number: Current number in sequence (can go beyond initial total if needed)
- total_thoughts: Current estimate of thoughts needed (can be adjusted up/down)
- is_revision: A boolean indicating if this thought revises previous thinking
- revises_thought: If is_revision is true, which thought number is being reconsidered
- branch_from_thought: If branching, which thought number is the branching point
- branch_id: Identifier for the current branch (if any)
- needs_more_thoughts: If reaching end but realizing more thoughts needed.

Once all thoughts are done, you can use the recently registered tools to finish the operation.
`,
      thoughtSchema.shape,
      async (arg, extra) => {
        const result = await this.processThought(arg as ThoughtData);
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
      const toolsToRegister = validatedInput.toolsToRegister

      let toolRegistrationResult = null;

      if (toolsToRegister && toolsToRegister.length > 0) {
        toolsToRegister.forEach((tool) => {
          const success = this.registerToolIfNeeded(tool);
          toolRegistrationResult = {
            requestedTool: tool,
            success,
            message: success ? `Tool '${tool}' registered successfully` : `Tool '${tool}' not available or not allowed`
          };
        });
      }

      const registeredToolNames = validatedInput?.toolsToRegister?.join(", ") || "";
      if (!validatedInput.nextThoughtNeeded && registeredToolNames) {
        const message = `Now everything is ready in the configured MCP server. Please try again answering the user's query.`
        return JSON.stringify({
          thoughtNumber: validatedInput.thoughtNumber,
          totalThoughts: validatedInput.totalThoughts,
          nextThoughtNeeded: validatedInput.nextThoughtNeeded,
          toolsToRegister: validatedInput.toolsToRegister,
          message: message,
        })
      }

      return JSON.stringify({
        thoughtNumber: validatedInput.thoughtNumber,
        totalThoughts: validatedInput.totalThoughts,
        nextThoughtNeeded: validatedInput.nextThoughtNeeded,
        toolsToRegister: validatedInput.toolsToRegister,
        branches: Object.keys(this.branches),
        thoughtHistoryLength: this.thoughtHistory.length,
        toolRegistrationResult,
        availableCommercetools: {
          message: "Commercetools API ready for operations",
          contextSupported: "Full Commercetools context available for product, cart, order, customer management",
          dynamicToolRegistration: "Now please pass 'toolsToRegister' in your thought to request specific tools",
          availableTools: contextToTools(this.processedConfiguration.context)
            .filter((tool: any) => isToolAllowed(tool, this.processedConfiguration))
            .map((tool: any) => tool.method)
        }
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

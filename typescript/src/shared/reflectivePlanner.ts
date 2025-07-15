import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Configuration } from '../types/configuration';
import { contextToTools } from './tools';
import { isToolAllowed, processConfigurationDefaults } from './configuration';
import CommercetoolsAPI from './api';

export const reflectivePlannerSchema = z.object({
    thought: z.string().describe('Your current thinking step about Commercetools operations'),
    nextThoughtNeeded: z.boolean().describe('Whether another thought step is needed'),
    thoughtNumber: z.number().int().min(1).describe('Current thought number'),
    totalThoughts: z.number().int().min(1).describe('Estimated total thoughts needed'),
    isRevision: z.boolean().optional().describe('Whether this revises previous thinking'),
    revisesThought: z.number().int().min(1).optional().describe('Which thought is being reconsidered'),
    branchFromThought: z.number().int().min(1).optional().describe('Branching point thought number'),
    branchId: z.string().optional().describe('Branch identifier'),
    needsMoreThoughts: z.boolean().optional().describe('If more thoughts are needed'),
    toolsToRegister: z.array(z.string()).optional().describe('Tools to register'),
});

export interface ThoughtData {
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

export function registerReflectivePlannerTool(
    server: McpServer,
    commercetoolsApi: CommercetoolsAPI,
    configuration: Configuration,
    processThought: (input: ThoughtData) => Promise<string>
) {
    server.tool(
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
        reflectivePlannerSchema.shape,
        async (arg, extra) => {
            const result = await processThought(arg as ThoughtData);
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

import {
  createReviewParameters,
  readReviewParameters,
  updateReviewParameters,
} from './parameters';
import {
  readReviewPrompt,
  createReviewPrompt,
  updateReviewPrompt,
} from './prompts';
import {Tool} from '../../types/tools';
import {Context} from '../../types/configuration';

const tools: Record<string, Tool> = {
  read_review: {
    name: 'Read Review',
    method: 'read_review',
    parameters: readReviewParameters,
    description: readReviewPrompt,
    actions: {
      review: {
        read: true,
      },
    },
  },
  create_review: {
    name: 'Create Review',
    method: 'create_review',
    parameters: createReviewParameters,
    description: createReviewPrompt,
    actions: {
      review: {
        create: true,
      },
    },
  },
  update_review: {
    name: 'Update Review',
    method: 'update_review',
    parameters: updateReviewParameters,
    description: updateReviewPrompt,
    actions: {
      review: {
        update: true,
      },
    },
  },
};

export const contextToReviewTools = (context?: Context) => {
  if (context?.isAdmin) {
    return [tools.read_review, tools.create_review, tools.update_review];
  }
  return [];
};

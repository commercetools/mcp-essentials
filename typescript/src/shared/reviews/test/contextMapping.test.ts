import {contextToReviewFunctionMapping} from '../functions';
import * as admin from '../admin.functions';

describe('Review Context Mapping', () => {
  test('should return admin functions when isAdmin is true', () => {
    const context = {isAdmin: true};
    const mapping = contextToReviewFunctionMapping(context);

    expect(mapping).toEqual({
      read_review: admin.readReview,
      create_review: admin.createReview,
      update_review: admin.updateReview,
    });
  });

  test('should return admin functions as fallback when no context is provided', () => {
    const mapping = contextToReviewFunctionMapping();
    expect(mapping).toEqual({
      read_review: admin.readReview,
      create_review: admin.createReview,
      update_review: admin.updateReview,
    });
  });

  test('should return admin functions as fallback when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToReviewFunctionMapping(context);
    expect(mapping).toEqual({
      read_review: admin.readReview,
      create_review: admin.createReview,
      update_review: admin.updateReview,
    });
  });

  test('should return admin functions as fallback when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToReviewFunctionMapping(context);
    expect(mapping).toEqual({
      read_review: admin.readReview,
      create_review: admin.createReview,
      update_review: admin.updateReview,
    });
  });
});

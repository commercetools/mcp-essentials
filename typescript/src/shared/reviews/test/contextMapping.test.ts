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

  test('should return empty object when no context is provided', () => {
    const mapping = contextToReviewFunctionMapping();
    expect(mapping).toEqual({});
  });

  test('should return empty object when isAdmin is false', () => {
    const context = {isAdmin: false};
    const mapping = contextToReviewFunctionMapping(context);
    expect(mapping).toEqual({});
  });

  test('should return empty object when context does not include isAdmin', () => {
    const context = {customerId: '123'};
    const mapping = contextToReviewFunctionMapping(context);
    expect(mapping).toEqual({});
  });
});

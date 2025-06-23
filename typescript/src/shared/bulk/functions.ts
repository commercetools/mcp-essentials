import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {bulkCreate, bulkUpdate} from './base.functions';

// Context mapping function for cart functions
export const contextToBulkFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  if (context?.isAdmin) {
    return {
      bulk_create: bulkCreate,
      bulk_update: bulkUpdate,
    };
  }
  return {};
};

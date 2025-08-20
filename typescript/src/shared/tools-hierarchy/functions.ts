import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {injectTools, listAvailableTools} from './tools-hierarchy.functions';

// Context mapping function for cart functions
export const contextToToolsHierarchyFunctionMapping = (
  context?: Context
): Record<
  string,
  (
    apiRoot: ApiRoot,
    context: CommercetoolsFuncContext,
    params: any
  ) => Promise<any>
> => {
  return {
    list_available_tools: listAvailableTools,
    inject_tools: injectTools,
  };
};

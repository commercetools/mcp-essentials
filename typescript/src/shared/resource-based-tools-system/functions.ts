import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import {
  injectTools,
  listAvailableTools,
} from './resource-based-tools.functions';

// Context mapping function for resource-based tool functions
export const contextToResourceBasedToolSystemFunctionMapping = (
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

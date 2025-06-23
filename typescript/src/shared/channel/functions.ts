import {ApiRoot} from '@commercetools/platform-sdk';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import * as admin from './admin.functions';

export const contextToChannelFunctionMapping = (
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
      read_channel: admin.readChannel,
      create_channel: admin.createChannel,
      update_channel: admin.updateChannel,
    };
  }

  return {};
};

// Re-exports for backward compatibility
export const readChannel = admin.readChannel;
export const createChannel = admin.createChannel;
export const updateChannel = admin.updateChannel;

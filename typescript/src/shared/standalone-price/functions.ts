import {z} from 'zod';
import {
  readStandalonePriceParameters,
  createStandalonePriceParameters,
  updateStandalonePriceParameters,
} from './parameters';
import {
  ApiRoot,
  StandalonePriceDraft,
  StandalonePriceUpdateAction,
} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';
import {CommercetoolsFuncContext, Context} from '../../types/configuration';
import * as admin from './admin.functions';

export const contextToStandalonePriceFunctionMapping = (
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
      read_standalone_price: admin.readStandalonePrice,
      create_standalone_price: admin.createStandalonePrice,
      update_standalone_price: admin.updateStandalonePrice,
    };
  }

  return {};
};

// Re-exports for backward compatibility
export const readStandalonePrice = admin.readStandalonePrice;
export const createStandalonePrice = admin.createStandalonePrice;
export const updateStandalonePrice = admin.updateStandalonePrice;

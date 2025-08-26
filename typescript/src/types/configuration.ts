import {StreamableHTTPServerTransportOptions} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  AuthConfig,
  CommercetoolsAgentEssentials,
} from '../modelcontextprotocol';
import {AvailableNamespaces} from './tools';
import {Express} from 'express';

// Actions restrict the subset of API calls that can be made. They should
// be used in conjunction with Restricted API Keys. Setting a permission to false
// prevents the related "tool" from being considered.
export type Permission = 'create' | 'update' | 'read';

export type Actions = {
  [K in AvailableNamespaces]?: {
    [K in Permission]?: boolean;
  };
} & {
  balance?: {
    read?: boolean;
  };
};

// Context are settings that are applied to all requests made by the integration.
export type Context = {
  // Account is a Connected Account ID. If set, the integration will
  // make requests for this Account.
  customerId?: string;
  storeKey?: string;
  distributionChannelId?: string;
  supplyChannelId?: string;
  isAdmin?: boolean;
  cartId?: string;
  businessUnitKey?: string;
};

export type CommercetoolsFuncContext = Context & {
  projectKey: string;
};

// Configuration provides various settings and options for the integration
// to tune and manage how it behaves.
export type Configuration = {
  actions?: Actions;
  context?: Context;
};

type IWithServerInstance = {
  authConfig?: AuthConfig;
  configuration?: Configuration;
  server: () => Promise<CommercetoolsAgentEssentials>;
  stateless?: boolean;
  streamableHttpOptions: StreamableHTTPServerTransportOptions;
  app?: Express;
};

type IWithServerConfig = {
  authConfig: AuthConfig;
  configuration: Configuration;
  server?: undefined;
  stateless?: boolean;
  streamableHttpOptions: StreamableHTTPServerTransportOptions;
  app?: Express;
};

export type IStreamServerOptions = IWithServerInstance | IWithServerConfig;

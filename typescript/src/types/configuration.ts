import {StreamableHTTPServerTransportOptions} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {Client} from '@commercetools/ts-client';
import {
  AuthConfig,
  CommercetoolsAgentEssentials,
} from '../modelcontextprotocol';
import {AvailableNamespaces, Tool} from './tools';
import {IncomingMessage, ServerResponse} from 'node:http';

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
  dynamicToolLoadingThreshold?: number;
  sessionId?: string;
  mode?: 'stateless' | 'stateful';
  logging?: boolean;
  toolOutputFormat?: 'json' | 'tabular';
};

export type CommercetoolsFuncContext = Context & {
  projectKey: string;
};

// Configuration provides various settings and options for the integration
// to tune and manage how it behaves.
export type Configuration = {
  customTools?: Array<Tool>;
  actions?: Actions;
  context?: Context;
};

type IRequest = {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
} & IncomingMessage;

type IResponse = {
  headersSent: boolean;
  status: (code: number) => IResponse;
  json: (data: unknown) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
} & ServerResponse<IncomingMessage>;
export interface IApp {
  use: (middleware: any) => void;
  post: (
    path: string,
    handler: (req: IRequest, res: IResponse) => void
  ) => void;
  get: (path: string, handler: (req: IRequest, res: IResponse) => void) => void;
  listen: (port: number, cb?: () => void) => void;
}

type IWithServerInstance = {
  authConfig?: AuthConfig;
  configuration?: Configuration;
  server: (sessionId?: string) => Promise<CommercetoolsAgentEssentials>;
  stateless?: boolean;
  streamableHttpOptions: StreamableHTTPServerTransportOptions;
  app?: IApp;
};

type IWithServerConfig = {
  authConfig: AuthConfig;
  configuration: Configuration;
  server?: undefined;
  stateless?: boolean;
  streamableHttpOptions: StreamableHTTPServerTransportOptions;
  app?: IApp;
};

export type IStreamServerOptions = IWithServerInstance | IWithServerConfig;

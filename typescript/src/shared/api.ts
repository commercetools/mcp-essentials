import {
  Client,
  ClientBuilder,
  MethodType,
  HttpMiddlewareOptions,
  TokenInfo,
  ClientRequest,
} from '@commercetools/ts-client';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import {contextToFunctionMapping} from './functions';
import {CommercetoolsFuncContext, Context} from '../types/configuration';
import {
  AuthConfig,
  ClientCredentialsAuth,
  ExistingTokenAuth,
  Introspect,
} from '../types/auth';
import pkg from '../../package.json';

class CommercetoolsAPI {
  private client: Client | undefined;
  private authConfig: AuthConfig;
  private context: Context;
  public apiRoot: ApiRoot;

  constructor(authConfig: AuthConfig, context?: Context) {
    this.context = context!;
    this.authConfig = authConfig;
    this.client = this.createClient();

    if (!this.client) {
      throw new Error('Failed to create client');
    }

    this.apiRoot = createApiBuilderFromCtpClient(this.client);
  }

  private createClient(): Client | never {
    const {authUrl, projectKey, apiUrl} = this.authConfig;
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: apiUrl,
    };

    const client = new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withConcurrentModificationMiddleware()
      .withCorrelationIdMiddleware()
      .withUserAgentMiddleware({
        libraryName: 'mcp-essentials',
        libraryVersion: pkg.version,
      })
      .withLoggerMiddleware({
        loggerFn: ({headers}) => {
          const {sessionId, mode} = this.context;
          // eslint-disable-next-line
          this.context.logging &&
            console.error(
              JSON.stringify({
                mode,
                ...(mode == 'stateful' && {sessionId}),
                correlationId: `${headers?.['x-correlation-id']}`,
              })
            );
        },
      });

    if (this.authConfig.type === 'client_credentials') {
      return client
        .withClientCredentialsFlow({
          host: authUrl,
          projectKey: projectKey,
          credentials: {
            clientId: this.authConfig.clientId,
            clientSecret: this.authConfig.clientSecret,
          },
        })
        .build();
    }

    if (this.authConfig.type === 'auth_token') {
      const authorizationHeader = `Bearer ${this.authConfig.accessToken}`;
      return client
        .withExistingTokenFlow(authorizationHeader, {force: true})
        .build();
    }

    this.handleUnrecognizedAuthConfig(this.authConfig);
  }

  private handleUnrecognizedAuthConfig(authConfig: AuthConfig): never {
    throw new Error(`Unrecognized auth type: ${JSON.stringify(authConfig)}`);
  }

  private async getToken(): Promise<string> {
    const authToken = (this.authConfig as ExistingTokenAuth).accessToken;
    if (authToken) return Promise.resolve(authToken);

    const {clientId, clientSecret} = this.authConfig as ClientCredentialsAuth;
    const req: ClientRequest = {
      uri: `/oauth/token`,
      method: 'POST' as MethodType,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
      body: `grant_type=client_credentials`,
    };

    const tokenObject = await this.getAuthClient().execute<TokenInfo>(req);
    return tokenObject.body!.access_token;
  }

  private getAuthClient(): Client {
    return new ClientBuilder()
      .withUserAgentMiddleware({
        libraryName: 'mcp-essentials',
        libraryVersion: pkg.version,
      })
      .withHttpMiddleware({
        host: this.authConfig.authUrl,
        stringBodyContentTypes: ['application/x-www-form-urlencoded'],
        httpClient: fetch,
      })
      .build();
  }

  async introspect(): Promise<Array<string>> {
    const token = await this.getToken();
    const {clientId, clientSecret} = this.authConfig as ClientCredentialsAuth;

    const req: ClientRequest = {
      uri: `/oauth/introspect`,
      method: 'POST' as MethodType,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
      body: `token=${token}`,
    };

    const res = await this.getAuthClient().execute<Introspect>(req);

    // check if token is active/valid
    if (!res.body?.active) {
      throw new Error(
        'Inactive or invalid auth token, please provide a valid token'
      );
    }

    return res.body?.scope.split(' ').map((scope) => scope.split(':')[0]) || [];
  }

  async run(
    method: string,
    arg: any,
    execute?: (args: Record<string, unknown>, api: ApiRoot) => Promise<string>
  ) {
    // handle custom tool execution
    if (execute && typeof execute == 'function') {
      return JSON.stringify(await execute(arg, this.apiRoot));
    }

    // handle core tool execution
    const functionMap = contextToFunctionMapping(this.context) as Record<
      string,
      any
    >;
    const func = functionMap[method];

    if (!func) {
      throw new Error('Invalid method ' + method);
    }

    const output = JSON.stringify(
      await func(
        this.apiRoot,
        {
          projectKey: this.authConfig.projectKey,
          ...this.context,
        } as CommercetoolsFuncContext,
        arg
      )
    );

    return output;
  }
}

export default CommercetoolsAPI;

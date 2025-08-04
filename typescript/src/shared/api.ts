import {
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import {contextToFunctionMapping} from './functions';
import {CommercetoolsFuncContext, Context} from '../types/configuration';
import {AuthConfig} from '../types/auth';
class CommercetoolsAPI {
  private client: Client | undefined;
  public apiRoot: ApiRoot;

  constructor(
    private authConfig: AuthConfig,
    private context?: Context
  ) {
    this.client = this.createClient();

    if (!this.client) {
      throw new Error('Failed to create client');
    }

    this.apiRoot = createApiBuilderFromCtpClient(this.client);
  }

  private createClient(): Client | undefined {
    const {authUrl, projectKey, apiUrl} = this.authConfig;
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: apiUrl,
    };

    if (this.authConfig.type === 'client_credentials') {
      return new ClientBuilder()
        .withHttpMiddleware(httpMiddlewareOptions)
        .withConcurrentModificationMiddleware()
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
      return new ClientBuilder()
        .withHttpMiddleware(httpMiddlewareOptions)
        .withConcurrentModificationMiddleware()
        .withExistingTokenFlow(this.authConfig.accessToken, {force: true})
        .build();
    }

    this.handleUnrecognizedAuthConfig(this.authConfig);
  }

  private handleUnrecognizedAuthConfig(authConfig: never) {
    throw new Error(`Unrecognized auth type: ${JSON.stringify(authConfig)}`);
  }

  async run(method: string, arg: any) {
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

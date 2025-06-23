import {
  AuthMiddlewareOptions,
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
class CommercetoolsAPI {
  private authMiddlewareOptions: AuthMiddlewareOptions;
  private httpMiddlewareOptions: HttpMiddlewareOptions;
  private client: Client;
  public apiRoot: ApiRoot;
  private context?: Context;

  constructor(
    clientId: string,
    clientSecret: string,
    authUrl: string,
    projectKey: string,
    apiUrl: string,
    context?: Context
  ) {
    this.authMiddlewareOptions = {
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      host: authUrl,
      projectKey: projectKey,
    };
    this.httpMiddlewareOptions = {
      host: apiUrl,
    };
    this.client = new ClientBuilder()
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withConcurrentModificationMiddleware()
      .withClientCredentialsFlow(this.authMiddlewareOptions)
      .build();
    this.apiRoot = createApiBuilderFromCtpClient(this.client);
    this.context = context;
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
          projectKey: this.authMiddlewareOptions.projectKey,
          ...this.context,
        } as CommercetoolsFuncContext,
        arg
      )
    );

    return output;
  }
}

export default CommercetoolsAPI;

import {randomUUID} from 'node:crypto';
import express from 'express';
import {
  AuthConfig,
  CommercetoolsAgentEssentials,
  Configuration,
} from '../modelcontextprotocol';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {isInitializeRequest} from '@modelcontextprotocol/sdk/types.js';
import {IApp, IStreamServerOptions} from '../types/configuration';
import {ExistingTokenAuth as E} from '../types/auth';

export default class CommercetoolsAgentEssentialsStreamable {
  private app: IApp;
  private authConfig: AuthConfig;
  private server: () => Promise<CommercetoolsAgentEssentials>;
  private transports: {[sessionId: string]: StreamableHTTPServerTransport} = {};
  private stateless: boolean;

  private configuration: Configuration;

  constructor({
    authConfig,
    configuration,

    stateless = true,
    streamableHttpOptions,
    server,
    app,
  }: IStreamServerOptions) {
    this.server = server!;
    this.authConfig = authConfig!;
    this.configuration = configuration!;
    this.stateless = stateless;

    // initialize express app
    this.app = app ?? express();
    this.app.use(express.json());

    /**
     * streambale endpoint
     */
    this.app.post('/mcp', async (req, res) => {
      try {
        let transport: StreamableHTTPServerTransport;
        const authHeader = req.headers.authorization as string | undefined;
        const token = authHeader?.split(' ')[1] as string;
        const serverInstance = await this.getServer();
        /**
         * if token already exists in the config,
         * use it else use header provided token
         */
        this.authConfig = {
          ...this.authConfig,
          // prioritize Authorization header Token
          accessToken: token || (this.authConfig as E)?.accessToken,
        } as E;

        if (stateless) {
          transport = new StreamableHTTPServerTransport({
            ...streamableHttpOptions,
            sessionIdGenerator: undefined,
          });

          // if stateless then close each transport and server after use
          res.on('close', async () => {
            // close the transport and server
            await transport.close();
            await serverInstance.close();
          });

          // connect server to the transport
          await serverInstance.connect(transport);
        } else {
          const sessionId = req.headers['mcp-session-id'] as string | undefined;
          if (sessionId && this.transports[sessionId]) {
            transport = this.transports[sessionId];
          } else if (!sessionId && isInitializeRequest(req.body)) {
            const generator =
              streamableHttpOptions.sessionIdGenerator &&
              typeof streamableHttpOptions.sessionIdGenerator == 'function'
                ? streamableHttpOptions.sessionIdGenerator
                : randomUUID;

            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: generator,
              onsessioninitialized: async (sessionId) => {
                // Store the transport by session ID
                this.transports[sessionId] = transport;

                // connect server to the transport
                await serverInstance.connect(transport);
              },
            });

            // Clean up transport when closed
            transport.onclose = () => {
              if (transport.sessionId) {
                delete this.transports[transport.sessionId];
              }
            };
          } else {
            return res.status(400).json({
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
              },
              id: null,
            });
          }
        }

        // finally handle requests
        await transport.handleRequest(req, res, req.body);
      } catch (err: unknown) {
        // handle error
        console.error('Error handling request', err);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });

    /**
     * sse endpoint
     *
     * TODO:
     * decide on how to handle SSE requests
     */
    this.app.get('/mcp', async (req, res) => {
      /* noop */
    });
  }

  // eslint-disable-next-line require-await
  private async getServer(id?: string): Promise<CommercetoolsAgentEssentials> {
    if (this.server) return this.server();
    return CommercetoolsAgentEssentials.create({
      authConfig: this.authConfig,
      configuration: {
        ...this.configuration,
        context: {
          ...this.configuration.context,
          mode: this.stateless ? 'stateless' : 'stateful',
          sessionId: id,
        },
      },
    });
  }

  listen(port: number, cb?: () => void) {
    this.app.listen(port, cb);
  }
}

import {randomUUID} from 'node:crypto';
import express, {Express, Request, Response} from 'express';
import {
  CommercetoolsAgentEssentials,
  Configuration,
} from '../modelcontextprotocol';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {isInitializeRequest} from '@modelcontextprotocol/sdk/types.js';
import {StreamServerOptions} from '../types/configuration';

export default class CommercetoolsAgentEssentialsStreamable {
  private app: Express;
  private server: CommercetoolsAgentEssentials;
  private transports: {[sessionId: string]: StreamableHTTPServerTransport} = {};

  private clientId: string;
  private clientSecret: string;
  private authUrl: string;
  private projectKey: string;
  private apiUrl: string;
  private configuration: Configuration;

  constructor({
    clientId,
    clientSecret,
    authUrl,
    projectKey,
    apiUrl,
    configuration,

    stateless,
    streamableHttpOptions,
    server,
    app,
  }: StreamServerOptions) {
    this.server = server!;

    this.clientId = clientId!;
    this.clientSecret = clientSecret!;
    this.authUrl = authUrl!;
    this.projectKey = projectKey!;
    this.apiUrl = apiUrl!;
    this.configuration = configuration!;

    // initialize express app
    this.app = app ?? express();
    this.app.use(express.json());

    /**
     * streambale endpoint
     */
    this.app.post('/mcp', async (req: Request, res: Response) => {
      try {
        let transport: StreamableHTTPServerTransport;

        // if stateless then close each transport and server after use
        if (stateless) {
          transport = new StreamableHTTPServerTransport({
            ...streamableHttpOptions,
            sessionIdGenerator: undefined,
          });
          res.on('close', async () => {
            // close the transport and server
            await transport.close();
            await (await this.getServer()).close();
          });

          // connect server to the transport
          await (await this.getServer()).connect(transport);
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
              onsessioninitialized: (sessionId) => {
                // Store the transport by session ID
                this.transports[sessionId] = transport;
              },
            });

            // Clean up transport when closed
            transport.onclose = () => {
              if (transport.sessionId) {
                delete this.transports[transport.sessionId];
              }
            };

            // connect server to the transport
            await (await this.getServer()).connect(transport);
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
    this.app.get('/mcp', async (req: Request, res: Response) => {
      /* noop */
    });
  }

  // eslint-disable-next-line require-await
  private async getServer(): Promise<CommercetoolsAgentEssentials> {
    if (this.server) return this.server;
    return CommercetoolsAgentEssentials.create({
      authConfig: {
        type: 'client_credentials',
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        authUrl: this.authUrl,
        projectKey: this.projectKey,
        apiUrl: this.apiUrl,
      },
      configuration: this.configuration,
    });
  }

  listen(port: number, cb?: () => void) {
    this.app.listen(port, cb);
  }
}

import { ACCEPTED_TOOLS, parseArgs } from '../index';
import {
  CommercetoolsAgentEssentials,
  Configuration,
  AvailableNamespaces,
} from '@commercetools/agent-essentials/modelcontextprotocol';

// Mock the CommercetoolsAgentEssentials and transport
jest.mock('@commercetools/agent-essentials/modelcontextprotocol');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('parseArgs function', () => {
  describe('success cases', () => {
    it('should parse all arguments correctly', () => {
      const args = [
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      const { options, env } = parseArgs(args);
      expect(options.tools).toEqual(['all']);
      expect(env.clientId).toBe('test_client_id');
      expect(env.clientSecret).toBe('test_client_secret');
      expect(env.authUrl).toBe('https://auth.commercetools.com');
      expect(env.projectKey).toBe('test_project');
      expect(env.apiUrl).toBe('https://api.commercetools.com');
    });

    it('should parse all.read tool correctly', () => {
      const args = [
        '--tools=all.read',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      const { options } = parseArgs(args);
      expect(options.tools).toEqual(['all.read']);
    });

    it('should parse tools argument correctly', () => {
      const args = [
        '--tools=products.read',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      const { options } = parseArgs(args);
      expect(options.tools).toEqual(['products.read']);
    });

    it('should accept all.read as a valid tool without throwing validation error', () => {
      const args = [
        '--tools=all.read',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];

      expect(() => parseArgs(args)).not.toThrow();
      const { options } = parseArgs(args);
      expect(options.tools).toEqual(['all.read']);
    });

    it('should accept all.read in combination with other tools', () => {
      const args = [
        '--tools=all.read,products.create',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];

      expect(() => parseArgs(args)).not.toThrow();
      const { options } = parseArgs(args);
      expect(options.tools).toEqual(['all.read', 'products.create']);
    });

    it('should use environment variables when arguments are not provided', () => {
      process.env.CLIENT_ID = 'env_client_id';
      process.env.CLIENT_SECRET = 'env_client_secret';
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = ['--tools=all'];
      const { env } = parseArgs(args);
      expect(env.clientId).toBe('env_client_id');
      expect(env.clientSecret).toBe('env_client_secret');
      expect(env.authUrl).toBe('https://auth.commercetools.com');
      expect(env.projectKey).toBe('env_project');
      expect(env.apiUrl).toBe('https://api.commercetools.com');

      // Clean up
      delete process.env.CLIENT_ID;
      delete process.env.CLIENT_SECRET;
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    });

    it('should prefer command line arguments over environment variables', () => {
      process.env.CLIENT_ID = 'env_client_id';
      process.env.CLIENT_SECRET = 'env_client_secret';
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = [
        '--tools=all',
        '--clientId=arg_client_id',
        '--clientSecret=arg_client_secret',
        '--authUrl=https://auth-arg.commercetools.com',
        '--projectKey=arg_project',
        '--apiUrl=https://api-arg.commercetools.com',
      ];
      const { env } = parseArgs(args);
      expect(env.clientId).toBe('arg_client_id');
      expect(env.clientSecret).toBe('arg_client_secret');
      expect(env.authUrl).toBe('https://auth-arg.commercetools.com');
      expect(env.projectKey).toBe('arg_project');
      expect(env.apiUrl).toBe('https://api-arg.commercetools.com');

      // Clean up
      delete process.env.CLIENT_ID;
      delete process.env.CLIENT_SECRET;
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    });

    it('should parse customerId and isAdmin arguments correctly', () => {
      const args = [
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
        '--customerId=xxx',
        '--businessUnitKey=yyy',
        '--isAdmin=true',
      ];
      const { options } = parseArgs(args);
      expect(options.customerId).toBe('xxx');
      expect(options.isAdmin).toBe(true);
      expect(options.businessUnitKey).toBe('yyy');
    });

    it('should correctly parse isAdmin as boolean', () => {
      const args = [
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
        '--isAdmin=false',
      ];
      const { options } = parseArgs(args);
      expect(options.isAdmin).toBe(false);
    });

    it.each([
      {
        authType: undefined,
        expectedAuthType: 'client_credentials',
        requiredArgs: ['--clientId=test_client_id', '--clientSecret=test_client_secret'],
        optionalArgs: [],
      },
      {
        authType: 'client_credentials',
        expectedAuthType: 'client_credentials',
        requiredArgs: ['--clientId=test_client_id', '--clientSecret=test_client_secret'],
        optionalArgs: [],
      },
      {
        authType: 'auth_token',
        expectedAuthType: 'auth_token',
        requiredArgs: ['--accessToken=test_access_token'],
        optionalArgs: [],
      },
    ])('should parse authType=$authType correctly', ({ authType, expectedAuthType, requiredArgs, optionalArgs }) => {
      const args = [
        '--tools=all',
        authType ? `--authType=${authType}` : '',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
        ...requiredArgs,
        ...optionalArgs,
      ];
      const { env } = parseArgs(args);
      expect(env.authType).toBe(expectedAuthType);
    })

    it.each([
      {
        authType: undefined,
        envKeys: ['CLIENT_ID', 'CLIENT_SECRET'],
        envValues: ['test_client_id', 'test_client_secret'],
      },
      {
        authType: 'client_credentials',
        envKeys: ['CLIENT_ID', 'CLIENT_SECRET'],
        envValues: ['test_client_id', 'test_client_secret'],
      },
      {
        authType: 'auth_token',
        envKeys: ['ACCESS_TOKEN'],
        envValues: ['test_access_token'],
      }
    ])('should use environment variable $authType when authType argument is not provided', ({ authType = 'client_credentials', envKeys, envValues }) => {
      process.env.AUTH_TYPE = authType;
      envKeys.forEach((key, index) => {
        process.env[key] = envValues[index];
      });
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = ['--tools=all'];
      const { env } = parseArgs(args);

      expect(env.authType).toBe(authType);

      // Clean up
      delete process.env.AUTH_TYPE;
      envKeys.forEach((key) => {
        delete process.env[key];
      });
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    })

    it('should prefer command line authType over environment variable', () => {
      process.env.AUTH_TYPE = 'auth_token';
      process.env.ACCESS_TOKEN = 'env_access_token';
      process.env.AUTH_URL = 'https://auth.commercetools.com';
      process.env.PROJECT_KEY = 'env_project';
      process.env.API_URL = 'https://api.commercetools.com';

      const args = [
        '--tools=all',
        '--authType=client_credentials',
        '--clientId=arg_client_id',
        '--clientSecret=arg_client_secret',
        '--authUrl=https://auth-arg.commercetools.com',
        '--projectKey=arg_project',
        '--apiUrl=https://api-arg.commercetools.com',
      ];
      const { env } = parseArgs(args);
      expect(env.authType).toBe('client_credentials');

      // Clean up
      delete process.env.AUTH_TYPE;
      delete process.env.ACCESS_TOKEN;
      delete process.env.AUTH_URL;
      delete process.env.PROJECT_KEY;
      delete process.env.API_URL;
    });

    describe('authType validation', () => {
      describe.each([
        {
          authType: 'client_credentials',
          missingCredential: 'clientId',
          args: ['--clientSecret=test_client_secret'],
          expectedError: 'CLIENT_ID and CLIENT_SECRET are required for client_credentials auth type.'
        },
        {
          authType: 'client_credentials',
          missingCredential: 'clientSecret',
          args: ['--clientId=test_client_id'],
          expectedError: 'CLIENT_ID and CLIENT_SECRET are required for client_credentials auth type.'
        },
        {
          authType: 'client_credentials',
          missingCredential: 'both',
          args: [],
          expectedError: 'CLIENT_ID and CLIENT_SECRET are required for client_credentials auth type.'
        },
        {
          authType: 'auth_token',
          missingCredential: 'accessToken',
          args: [],
          expectedError: 'ACCESS_TOKEN is required for auth_token auth type.'
        }
      ])('$authType with missing $missingCredential', ({ authType, args, expectedError }) => {
        it(`should throw an error when authType=${authType} but required credentials are missing`, () => {
          const testArgs = [
            '--tools=all',
            `--authType=${authType}`,
            ...args,
            '--authUrl=https://auth.commercetools.com',
            '--projectKey=test_project',
            '--apiUrl=https://api.commercetools.com',
          ];
          expect(() => parseArgs(testArgs)).toThrow(expectedError);
        });
      });

      it('should throw an error for unsupported authType value', () => {
        const args = [
          '--tools=all',
          '--authType=unsupported_type',
          '--clientId=test_client_id',
          '--clientSecret=test_client_secret',
          '--authUrl=https://auth.commercetools.com',
          '--projectKey=test_project',
          '--apiUrl=https://api.commercetools.com',
        ];
        expect(() => parseArgs(args)).toThrow(
          'Invalid auth type: unsupported_type. Supported types are: client_credentials, auth_token'
        );
      });
    });
  });

  describe('configuration building integration tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should build configuration with only read operations for all.read', () => {
      // Mock the CommercetoolsAgentEssentials constructor
      const mockCommercetoolsAgentEssentials = jest.mocked(
        CommercetoolsAgentEssentials
      );
      let capturedConfiguration: Configuration;

      mockCommercetoolsAgentEssentials.mockImplementation((options: any) => {
        capturedConfiguration = options.configuration;
        return {
          connect: jest.fn(),
        } as any;
      });

      // Set up process.argv to simulate command line args
      const originalArgv = process.argv;
      process.argv = [
        'node',
        'index.js',
        '--tools=all.read',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
        '--isAdmin=true',
      ];

      // Import and run main function
      const { main } = require('../index');
      return main().then(() => {
        // Verify that only read operations are enabled
        expect(capturedConfiguration.actions).toBeDefined();
        if (capturedConfiguration.actions) {
          Object.keys(capturedConfiguration.actions).forEach((namespace) => {
            const namespaceActions =
              capturedConfiguration.actions![namespace as AvailableNamespaces];
            if (namespaceActions) {
              expect(namespaceActions.read).toBe(true);
              expect(namespaceActions.create).toBeUndefined();
              expect(namespaceActions.update).toBeUndefined();
            }
          });

          // Verify all expected read operations are present
          const expectedReadNamespaces = ACCEPTED_TOOLS.filter((tool) =>
            tool.endsWith('.read')
          ).map((tool) => tool.split('.')[0]);
          const uniqueExpectedNamespaces = [...new Set(expectedReadNamespaces)];

          uniqueExpectedNamespaces.forEach((namespace) => {
            const namespaceActions =
              capturedConfiguration.actions![namespace as AvailableNamespaces];
            expect(namespaceActions).toBeDefined();
            if (namespaceActions) {
              expect(namespaceActions.read).toBe(true);
            }
          });
        }

        // Restore original argv
        process.argv = originalArgv;
      });
    });
  });

  describe('error cases', () => {
    it('should throw an error if tools argument is not provided', () => {
      const args = [
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'The --tools arguments must be provided.'
      );
    });

    it('should throw an error if an invalid tool is provided', () => {
      const args = [
        '--tools=invalid.tool',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'Invalid tool: invalid.tool. Accepted tools are: business-unit.read, business-unit.create, business-unit.update, products.read, products.create, products.update, project.read, product-search.read, category.read, category.create, category.update, channel.read, channel.create, channel.update, product-selection.read, product-selection.create, product-selection.update, order.read, order.create, order.update, cart.read, cart.create, cart.update, customer.create, customer.read, customer.update, customer-group.read, customer-group.create, customer-group.update, quote.read, quote.create, quote.update, quote-request.read, quote-request.create, quote-request.update, staged-quote.read, staged-quote.create, staged-quote.update, standalone-price.read, standalone-price.create, standalone-price.update, product-discount.read, product-discount.create, product-discount.update, cart-discount.read, cart-discount.create, cart-discount.update, discount-code.read, discount-code.create, discount-code.update, product-type.read, product-type.create, product-type.update, bulk.create, bulk.update, inventory.read, inventory.create, inventory.update, store.read, store.create, store.update'
      );
    });

    it('should throw an error if required credentials are missing', () => {
      const args = ['--tools=all'];
      expect(() => parseArgs(args)).toThrow(
        'commercetools credentials missing. Please provide all required credentials either via arguments or environment variables (AUTH_URL, PROJECT_KEY, API_URL).'
      );
    });

    it('should throw an error if an invalid argument is provided', () => {
      const args = [
        '--invalid-arg=value',
        '--tools=all',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'Invalid argument: invalid-arg. Accepted arguments are: tools, authType, clientId, clientSecret, accessToken, authUrl, projectKey, apiUrl'
      );
    });

    it('should not throw validation error for all.read when mixed with invalid tools', () => {
      const args = [
        '--tools=all.read,invalid.tool',
        '--clientId=test_client_id',
        '--clientSecret=test_client_secret',
        '--authUrl=https://auth.commercetools.com',
        '--projectKey=test_project',
        '--apiUrl=https://api.commercetools.com',
      ];
      expect(() => parseArgs(args)).toThrow(
        'Invalid tool: invalid.tool. Accepted tools are:'
      );
    });
  });
});

#!/usr/bin/env node

import {
  Configuration,
  AvailableNamespaces,
  CommercetoolsAgentEssentials,
  CommercetoolsAgentEssentialsStreamable,
} from '@commercetools/agent-essentials/modelcontextprotocol';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { red, yellow, green } from 'colors';

type Options = {
  tools?: string[];
  customerId?: string;
  cartId?: string;
  isAdmin?: boolean;
  storeKey?: string;
  businessUnitKey?: string;
};

type EnvVars = {
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  projectKey?: string;
  apiUrl?: string;

  remote?: boolean;
  stateless?: boolean;
  port?: number;
};

const HIDDEN_ARGS = ['customerId', 'isAdmin', 'storeKey', 'businessUnitKey'];

const PUBLIC_ARGS = [
  'tools',
  'clientId',
  'clientSecret',
  'authUrl',
  'projectKey',
  'apiUrl',
];

const ACCEPTED_ARGS = [...PUBLIC_ARGS, ...HIDDEN_ARGS];

export const ACCEPTED_TOOLS = [
  'business-unit.read',
  'business-unit.create',
  'business-unit.update',
  'products.read',
  'products.create',
  'products.update',
  'project.read',
  'product-search.read',
  'category.read',
  'category.create',
  'category.update',
  'channel.read',
  'channel.create',
  'channel.update',
  'product-selection.read',
  'product-selection.create',
  'product-selection.update',
  'order.read',
  'order.create',
  'order.update',
  'cart.read',
  'cart.create',
  'cart.update',
  'customer.create',
  'customer.read',
  'customer.update',
  'customer-group.read',
  'customer-group.create',
  'customer-group.update',
  'quote.read',
  'quote.create',
  'quote.update',
  'quote-request.read',
  'quote-request.create',
  'quote-request.update',
  'staged-quote.read',
  'staged-quote.create',
  'staged-quote.update',
  'standalone-price.read',
  'standalone-price.create',
  'standalone-price.update',
  'product-discount.read',
  'product-discount.create',
  'product-discount.update',
  'cart-discount.read',
  'cart-discount.create',
  'cart-discount.update',
  'discount-code.read',
  'discount-code.create',
  'discount-code.update',
  'product-type.read',
  'product-type.create',
  'product-type.update',
  'bulk.create',
  'bulk.update',
  'inventory.read',
  'inventory.create',
  'inventory.update',
  'store.read',
  'store.create',
  'store.update',
];

export function parseArgs(args: string[]): { options: Options; env: EnvVars } {
  const options: Options = {};
  const env: EnvVars = {};

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key == 'tools') {
        options.tools = value.split(',');
      } else if (key == 'clientId') {
        env.clientId = value;
      } else if (key == 'clientSecret') {
        env.clientSecret = value;
      } else if (key == 'authUrl') {
        env.authUrl = value;
      } else if (key == 'projectKey') {
        env.projectKey = value;
      } else if (key == 'apiUrl') {
        env.apiUrl = value;
      } else if (key == 'remote') {
        env.remote = value == 'true';
      } else if (key == 'stateless') {
        env.stateless = value == 'true';
      } else if (key == 'port') {
        env.port = Number(value);
      } else if (key == 'customerId') {
        options.customerId = value;
      } else if (key == 'isAdmin') {
        options.isAdmin = value === 'true';
      } else if (key == 'cartId') {
        options.cartId = value;
      } else if (key == 'storeKey') {
        options.storeKey = value;
      } else if (key == 'businessUnitKey') {
        options.businessUnitKey = value;
      } else {
        throw new Error(
          `Invalid argument: ${key}. Accepted arguments are: ${PUBLIC_ARGS.join(
            ', '
          )}`
        );
      }
    }
  });

  // Check if required tools arguments is present
  if (!options.tools) {
    if (!process.env.TOOLS) {
      throw new Error('The --tools arguments must be provided.');
    }
    options.tools = process.env.TOOLS.split(',');
  }

  // Validate tools against accepted enum values
  options.tools.forEach((tool: string) => {
    if (tool == 'all' || tool == 'all.read') {
      return;
    }
    if (!ACCEPTED_TOOLS.includes(tool.trim())) {
      throw new Error(
        `Invalid tool: ${tool}. Accepted tools are: ${ACCEPTED_TOOLS.join(
          ', '
        )}`
      );
    }
  });

  // Check for commercetools env vars
  env.clientId = env.clientId || process.env.CLIENT_ID;
  env.clientSecret = env.clientSecret || process.env.CLIENT_SECRET;
  env.authUrl = env.authUrl || process.env.AUTH_URL;
  env.projectKey = env.projectKey || process.env.PROJECT_KEY;
  env.apiUrl = env.apiUrl || process.env.API_URL;

  env.remote = env.remote || process.env.REMOTE == 'true';
  env.stateless = env.stateless || process.env.STATELESS == 'true';
  env.port = env.port || Number(process.env.PORT);

  options.businessUnitKey =
    options.businessUnitKey || process.env.BUSINESS_UNIT_KEY;
  options.storeKey = options.storeKey || process.env.STORE_KEY;
  options.customerId = options.customerId || process.env.CUSTOMER_ID;
  options.isAdmin = options.isAdmin || process.env.IS_ADMIN === 'true';
  options.cartId = options.cartId || process.env.CART_ID;

  // Validate required commercetools credentials
  if (
    !env.clientId ||
    !env.clientSecret ||
    !env.authUrl ||
    !env.projectKey ||
    !env.apiUrl
  ) {
    throw new Error(
      'commercetools credentials missing. Please provide all required credentials either via arguments or environment variables (CLIENT_ID, CLIENT_SECRET, AUTH_URL, PROJECT_KEY, API_URL).'
    );
  }

  return { options, env };
}

function handleError(error: any) {
  console.error(red('\n🚨  Error initializing commercetools MCP server:\n'));
  console.error(yellow(`   ${error.message}\n`));
}

export async function main() {
  require('dotenv').config();
  const { options, env } = parseArgs(process.argv.slice(2));

  // Create the CommercetoolsAgentEssentials instance
  const selectedTools = options.tools!;
  const configuration: Configuration = {
    actions: {},
    context: {
      customerId: options.customerId,
      isAdmin: options.isAdmin,
      cartId: options.cartId,
      storeKey: options.storeKey,
      businessUnitKey: options.businessUnitKey,
    },
  };

  if (selectedTools[0] === 'all') {
    ACCEPTED_TOOLS.forEach((tool) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');

      configuration.actions[namespace as AvailableNamespaces] = {
        ...configuration.actions[namespace as AvailableNamespaces],
        [action]: true,
      };
    });
  } else if (selectedTools[0] === 'all.read') {
    ACCEPTED_TOOLS.forEach((tool) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');
      if (action === 'read') {
        configuration.actions[namespace as AvailableNamespaces] = {
          ...configuration.actions[namespace as AvailableNamespaces],
          [action]: true,
        };
      }
    });
  } else {
    selectedTools.forEach((tool: any) => {
      if (!configuration.actions) {
        configuration.actions = {};
      }
      const [namespace, action] = tool.split('.');
      configuration.actions[namespace as AvailableNamespaces] = {
        ...(configuration.actions[namespace as AvailableNamespaces] || {}),
        [action]: true,
      };
    });
  }

  const server = new CommercetoolsAgentEssentials({
    clientId: env.clientId!,
    clientSecret: env.clientSecret!,
    authUrl: env.authUrl!,
    projectKey: env.projectKey!,
    apiUrl: env.apiUrl!,
    configuration: configuration,
  });

  if (env.remote) {
    const streamServer = new CommercetoolsAgentEssentialsStreamable({
      server,
      stateless: env.stateless,
      streamableHttpOptions: {
        sessionIdGenerator: undefined,
      },
    });

    const port = env.port || 3000;
    streamServer.listen(port, function () {
      console.log(`running on port`, port);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  console.error(green('MCP server is running...'));
}

if (require.main === module) {
  main().catch((error) => {
    handleError(error);
  });
}

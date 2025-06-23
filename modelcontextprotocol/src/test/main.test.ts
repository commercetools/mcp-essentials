import {main} from '../index';
import {CommercetoolsAgentToolkit} from '@commercetools-demo/ct-agent-toolkit/modelcontextprotocol';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';

jest.mock('@commercetools-demo/ct-agent-toolkit/modelcontextprotocol');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('main function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server with tools=all correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=all',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {
          products: {read: true, create: true, update: true},
          project: {read: true},
          'product-search': {read: true},
          category: {read: true, create: true, update: true},
          'product-selection': {read: true, create: true, update: true},
          order: {read: true, create: true, update: true},
          cart: {read: true, create: true, update: true},
          customer: {read: true, create: true, update: true},
          'customer-group': {read: true, create: true, update: true},
          quote: {read: true, create: true, update: true},
          'quote-request': {read: true, create: true, update: true},
          'staged-quote': {read: true, create: true, update: true},
          'standalone-price': {read: true, create: true, update: true},
          'product-discount': {read: true, create: true, update: true},
          'cart-discount': {read: true, create: true, update: true},
          'discount-code': {read: true, create: true, update: true},
          'product-type': {read: true, create: true, update: true},
          inventory: {read: true, create: true, update: true},
          channel: {read: true, create: true, update: true},
          store: {read: true, create: true, update: true},
          bulk: {create: true, update: true},
          'business-unit': {read: true, create: true, update: true},
        },
        context: {
          isAdmin: true,
          storeKey: undefined,
          cartId: undefined,
          customerId: undefined,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {products: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {products: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (products.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {products: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (project.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=project.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {project: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-search.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-search.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-search': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {category: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {category: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (category.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=category.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {category: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-selection': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-selection': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-selection.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-selection.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-selection': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {order: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {order: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (order.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=order.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {order: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.read tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {cart: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.create tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {cart: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with cart.update tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {cart: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (customer.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {customer: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (customer.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {customer: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (customer.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {customer: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with customer-group.read tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer-group.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'customer-group': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with customer-group.create tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer-group.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'customer-group': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with customer-group.update tool correctly', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=customer-group.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'customer-group': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (standalone-price.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=standalone-price.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'standalone-price': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (standalone-price.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=standalone-price.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'standalone-price': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (standalone-price.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=standalone-price.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'standalone-price': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-discount.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-discount.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-discount': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-discount.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-discount.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-discount': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (product-discount.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=product-discount.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'product-discount': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (cart-discount.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart-discount.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'cart-discount': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (cart-discount.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart-discount.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'cart-discount': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (cart-discount.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=cart-discount.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'cart-discount': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (discount-code.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=discount-code.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'discount-code': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (discount-code.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=discount-code.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'discount-code': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (discount-code.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=discount-code.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'discount-code': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (bulk.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=bulk.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {bulk: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (bulk.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=bulk.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {bulk: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (inventory.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=inventory.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {inventory: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (inventory.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=inventory.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {inventory: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (inventory.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=inventory.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {inventory: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (store.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=store.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {store: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (store.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=store.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {store: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (store.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=store.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {store: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (quote.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=quote.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {quote: {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (quote.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=quote.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {quote: {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (quote.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=quote.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {quote: {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (staged-quote.read)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=staged-quote.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'staged-quote': {read: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (staged-quote.create)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=staged-quote.create',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'staged-quote': {create: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with specific tools correctly (staged-quote.update)', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=staged-quote.update',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--isAdmin=true',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {'staged-quote': {update: true}},
        context: {
          isAdmin: true,
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should initialize the server with customerId and multiple allowed tools', async () => {
    process.argv = [
      'node',
      'index.js',
      '--tools=products.read,order.read,cart.read',
      '--clientId=test_client_id',
      '--clientSecret=test_client_secret',
      '--authUrl=https://auth.commercetools.com',
      '--projectKey=test_project',
      '--apiUrl=https://api.commercetools.com',
      '--customerId=xxx',
      '--isAdmin=true',
      '--businessUnitKey=yyy',
    ];

    await main();

    expect(CommercetoolsAgentToolkit).toHaveBeenCalledWith({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      authUrl: 'https://auth.commercetools.com',
      projectKey: 'test_project',
      apiUrl: 'https://api.commercetools.com',
      configuration: {
        actions: {
          products: {read: true},
          order: {read: true},
          cart: {read: true},
        },
        context: {
          customerId: 'xxx',
          isAdmin: true,
          businessUnitKey: 'yyy',
        },
      },
    });

    expect(StdioServerTransport).toHaveBeenCalled();
  });
});

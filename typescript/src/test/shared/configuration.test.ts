import {z} from 'zod';
import {isToolAllowed} from '../../shared/configuration';
import {processConfigurationDefaults} from '../../shared/configuration';
import {Configuration} from '../../types/configuration';

describe('isToolAllowed', () => {
  it('should return true if all permissions are allowed', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {
          read: true,
        },
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(true);
  });

  it('should return false if any permission is denied', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {
          read: false,
        },
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(false);
  });

  it('should return false if permission is missing', () => {
    const tool = {
      method: 'test',
      name: 'Test',
      description: 'Test',
      parameters: z.object({
        foo: z.string(),
      }),
      actions: {
        products: {
          read: true,
        },
      },
    };

    const configuration = {
      actions: {
        products: {},
      },
    };

    expect(isToolAllowed(tool, configuration)).toBe(false);
  });
});

describe('processConfigurationDefaults', () => {
  it('should set isAdmin to true when no context is provided', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      isAdmin: true,
    });
  });

  it('should set isAdmin to true when context exists but no specific context keys are provided', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        cartId: 'some-cart-id',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      cartId: 'some-cart-id',
      isAdmin: true,
    });
  });

  it('should not modify context when customerId is provided', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        customerId: 'customer-123',
        cartId: 'cart-456',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      customerId: 'customer-123',
      cartId: 'cart-456',
    });
  });

  it('should not modify context when storeKey is provided', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        storeKey: 'store-123',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      storeKey: 'store-123',
    });
  });

  it('should not modify context when businessUnitKey is provided', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        businessUnitKey: 'bu-123',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      businessUnitKey: 'bu-123',
    });
  });

  it('should not modify context when isAdmin is already explicitly set to false', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        isAdmin: false,
        cartId: 'cart-123',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      isAdmin: false,
      cartId: 'cart-123',
    });
  });

  it('should not modify context when isAdmin is already explicitly set to true', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true},
      },
      context: {
        isAdmin: true,
        cartId: 'cart-123',
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.context).toEqual({
      isAdmin: true,
      cartId: 'cart-123',
    });
  });

  it('should preserve all other configuration properties', () => {
    const configuration: Configuration = {
      actions: {
        products: {read: true, create: true},
        cart: {read: true},
      },
    };

    const result = processConfigurationDefaults(configuration);

    expect(result.actions).toEqual({
      products: {read: true, create: true},
      cart: {read: true},
    });
    expect(result.context).toEqual({
      isAdmin: true,
    });
  });
});

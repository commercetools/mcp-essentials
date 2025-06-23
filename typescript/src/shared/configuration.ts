import {Configuration, Permission, Context} from '../types/configuration';
import {AvailableNamespaces, Tool} from '../types/tools';

export const isToolAllowed = (
  tool: Tool,
  configuration: Configuration
): boolean => {
  return Object.keys(tool.actions).every((resource) => {
    // For each resource.permission pair, check the configuration.
    const permissions = tool.actions[resource];

    return Object.keys(permissions).every((permission) => {
      return (
        configuration?.actions?.[resource as AvailableNamespaces]?.[
          permission as Permission
        ] === true
      );
    });
  });
};

/**
 * Processes configuration to apply smart defaults for context.
 * If no specific context (customerId, storeKey, businessUnitKey) is provided,
 * defaults to isAdmin: true to ensure maximum tool availability.
 *
 * @param configuration - The input configuration
 * @returns Configuration with processed context defaults
 */
export const processConfigurationDefaults = (
  configuration: Configuration
): Configuration => {
  // If no context is provided at all, create one with isAdmin: true
  if (!configuration.context) {
    return {
      ...configuration,
      context: {
        isAdmin: true,
      },
    };
  }

  // Check if any specific context keys are provided
  const hasSpecificContext =
    configuration.context.customerId ||
    configuration.context.storeKey ||
    configuration.context.businessUnitKey;

  // Only apply default isAdmin if:
  // 1. No specific context is provided AND
  // 2. isAdmin is not explicitly set (undefined)
  if (!hasSpecificContext && configuration.context.isAdmin === undefined) {
    return {
      ...configuration,
      context: {
        ...configuration.context,
        isAdmin: true,
      },
    };
  }

  // Return configuration as-is in all other cases:
  // - Specific context is provided, OR
  // - isAdmin is already explicitly set (true or false)
  return configuration;
};

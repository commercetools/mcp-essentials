import {z} from 'zod';

// Parameters for reading extensions
export const readExtensionParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the extension to retrieve'),

  // Optional key for getting by key
  key: z.string().optional().describe('The key of the extension to retrieve'),

  // List parameters (used when neither id nor key is provided)
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Number of results requested. Default: 20, Minimum: 1, Maximum: 500'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe('Number of elements skipped. Default: 0, Maximum: 10000'),
  sort: z
    .array(z.string())
    .optional()
    .describe('Sort criteria for the results. Example: ["createdAt desc"]'),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings. Example: ["key=\\"my-extension\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["destination", "triggers"]'
    ),
});

// Common schema for Authorization Header Authentication
const authorizationHeaderAuthentication = z.object({
  headerValue: z.string().describe('Header value for authorization'),
  type: z.literal('AuthorizationHeader'),
});

// Common schema for Azure Functions Authentication
const azureFunctionsAuthentication = z.object({
  key: z.string().optional().describe('Function key for authentication'),
  type: z.literal('AzureFunctions'),
});

// HTTP destination schema
const httpDestination = z.object({
  type: z.literal('HTTP'),
  url: z.string().url().describe('URL of the HTTP endpoint'),
  authentication: z
    .union([authorizationHeaderAuthentication, azureFunctionsAuthentication])
    .optional()
    .describe('Authentication configuration for the HTTP endpoint'),
});

// AWS Lambda destination schema
const awsLambdaDestination = z.object({
  type: z.literal('AWSLambda'),
  arn: z.string().describe('ARN of the AWS Lambda function'),
  accessKey: z.string().describe('AWS access key'),
  accessSecret: z.string().describe('AWS access secret'),
  region: z.string().describe('AWS region'),
});

// Google Cloud Function destination schema
const googleCloudFunctionDestination = z.object({
  type: z.literal('GoogleCloudFunction'),
  url: z.string().url().describe('URL of the Google Cloud Function'),
  region: z.string().describe('Google Cloud region'),
});

// Extension trigger schema
const extensionTrigger = z.object({
  resourceTypeId: z
    .enum([
      'cart',
      'order',
      'payment',
      'payment-method',
      'customer',
      'customer-group',
      'quote-request',
      'staged-quote',
      'quote',
      'business-unit',
      'shopping-list',
    ])
    .describe('Resource type that triggers the extension'),
  actions: z
    .array(z.enum(['Create', 'Update']))
    .describe('Actions that trigger the extension'),
  condition: z
    .string()
    .optional()
    .describe('Conditional predicate for triggering'),
});

// Parameters for creating an extension
export const createExtensionParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the extension'),
  destination: z
    .union([
      httpDestination,
      awsLambdaDestination,
      googleCloudFunctionDestination,
    ])
    .describe('Destination configuration for the extension'),
  triggers: z
    .array(extensionTrigger)
    .describe('Triggers that activate the extension'),
  timeoutInMs: z
    .number()
    .int()
    .min(1)
    .max(10000)
    .optional()
    .describe(
      'Maximum time in milliseconds for the extension to respond. Default: 2000, Max: 10000'
    ),
});

// Parameters for updating an extension
export const updateExtensionParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the extension to update'),
  key: z.string().optional().describe('The key of the extension to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the extension on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Destination action
        z.object({
          action: z.literal('changeDestination'),
          destination: z
            .union([
              httpDestination,
              awsLambdaDestination,
              googleCloudFunctionDestination,
            ])
            .describe('New destination configuration'),
        }),
        // Add Trigger action
        z.object({
          action: z.literal('addTrigger'),
          trigger: extensionTrigger.describe('Trigger to add'),
        }),
        // Remove Trigger action
        z.object({
          action: z.literal('removeTrigger'),
          trigger: extensionTrigger.describe('Trigger to remove'),
        }),
        // Change Triggers action
        z.object({
          action: z.literal('changeTriggers'),
          triggers: z
            .array(extensionTrigger)
            .describe('New triggers configuration'),
        }),
        // Set Key action
        z.object({
          action: z.literal('setKey'),
          key: z
            .string()
            .min(2)
            .max(256)
            .regex(/^[A-Za-z0-9_-]+$/)
            .optional()
            .describe('New key for the extension'),
        }),
        // Set TimeoutInMs action
        z.object({
          action: z.literal('setTimeoutInMs'),
          timeoutInMs: z
            .number()
            .int()
            .min(1)
            .max(10000)
            .optional()
            .describe('New timeout value in milliseconds'),
        }),
      ])
    )
    .describe('Update actions to be performed on the extension'),
});

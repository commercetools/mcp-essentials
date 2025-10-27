import {z} from 'zod';

// Parameters for reading subscriptions
export const readSubscriptionParameters = z.object({
  // Optional ID for getting by ID
  id: z.string().optional().describe('The ID of the subscription to retrieve'),

  // Optional key for getting by key
  key: z
    .string()
    .optional()
    .describe('The key of the subscription to retrieve'),

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
      'Query predicates specified as strings. Example: ["key=\\"my-subscription\\""]'
    ),

  // Common parameters
  expand: z
    .array(z.string())
    .optional()
    .describe(
      'An array of reference paths to expand. Example: ["changes", "messages"]'
    ),
});

// Common schema for SQS destination
const sqsDestination = z.object({
  type: z.literal('SQS'),
  queueUrl: z.string().describe('URL of the SQS queue'),
  region: z.string().describe('AWS region where the queue is located'),
  accessKey: z
    .string()
    .optional()
    .describe('AWS access key for authentication'),
  accessSecret: z
    .string()
    .optional()
    .describe('AWS access secret for authentication'),
});

// Common schema for SNS destination
const snsDestination = z.object({
  type: z.literal('SNS'),
  topicArn: z.string().describe('ARN of the SNS topic'),
  accessKey: z
    .string()
    .optional()
    .describe('AWS access key for authentication'),
  accessSecret: z
    .string()
    .optional()
    .describe('AWS access secret for authentication'),
});

// Common schema for Google Cloud Pub/Sub destination
const googleCloudPubSubDestination = z.object({
  type: z.literal('GoogleCloudPubSub'),
  projectId: z.string().describe('Google Cloud project ID'),
  topic: z.string().describe('Pub/Sub topic name'),
});

// Common schema for Azure Event Grid destination
const azureEventGridDestination = z.object({
  type: z.literal('AzureEventGrid'),
  uri: z.string().url().describe('URI of the Event Grid topic'),
  accessKey: z.string().optional().describe('Azure Event Grid access key'),
});

// Common schema for Azure Service Bus destination
const azureServiceBusDestination = z.object({
  type: z.literal('AzureServiceBus'),
  connectionString: z.string().describe('Azure Service Bus connection string'),
});

// Common schema for RabbitMQ destination
const rabbitMQDestination = z.object({
  type: z.literal('RabbitMQ'),
  uri: z.string().describe('RabbitMQ URI'),
});

// Common schema for Message Queue destination (deprecated, use specific queue types instead)
const messageQueueDestination = z.object({
  type: z.literal('MessageQueue'),
  uri: z.string().describe('Message queue URI'),
});

// Common schema for SQS changes subscription
const sqsDestinationWithAuthentication = z.object({
  type: z.literal('SQS'),
  queueUrl: z.string().describe('URL of the SQS queue'),
  region: z.string().describe('AWS region where the queue is located'),
  accessKey: z.string().describe('AWS access key for authentication'),
  accessSecret: z.string().describe('AWS access secret for authentication'),
});

// Subscription destination union type
const subscriptionDestination = z.union([
  sqsDestination,
  snsDestination,
  googleCloudPubSubDestination,
  azureEventGridDestination,
  azureServiceBusDestination,
  rabbitMQDestination,
  messageQueueDestination,
  sqsDestinationWithAuthentication,
]);

// Subscription message type
const subscriptionMessageType = z.object({
  resourceTypeId: z
    .enum([
      'business-unit',
      'cart',
      'category',
      'customer',
      'customer-group',
      'order',
      'payment',
      'product',
      'quote',
      'quote-request',
      'review',
      'staged-quote',
      'store',
    ])
    .describe('Resource type of the subscription'),
  types: z
    .array(z.string())
    .optional()
    .describe(
      'Message types to subscribe to. If not provided, all message types will be subscribed to.'
    ),
});

// Parameters for creating a subscription
export const createSubscriptionParameters = z.object({
  key: z
    .string()
    .min(2)
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional()
    .describe('User-defined unique identifier for the subscription'),
  destination: subscriptionDestination.describe(
    'Destination where the messages should be sent'
  ),
  changes: z
    .array(
      z.object({
        resourceTypeId: z
          .enum([
            'cart',
            'category',
            'customer',
            'customer-group',
            'customer-email-token',
            'discount-code',
            'inventory-entry',
            'key-value-document',
            'order',
            'order-edit',
            'payment',
            'product',
            'product-price',
            'quote',
            'quote-request',
            'review',
            'staged-quote',
          ])
          .describe('Resource type for change subscription'),
      })
    )
    .optional()
    .describe('Array of resource types for change subscriptions'),
  messages: z
    .array(subscriptionMessageType)
    .optional()
    .describe(
      'Array of message subscriptions for specific resource types and message types'
    ),
  format: z
    .union([
      z.object({
        type: z.literal('Platform'),
      }),
      z.object({
        type: z.literal('CloudEvents'),
        cloudEventsVersion: z
          .string()
          .describe('CloudEvents version (optional)'),
      }),
    ])
    .optional()
    .describe('Format of the subscription message'),
});

// Parameters for updating a subscription
export const updateSubscriptionParameters = z.object({
  // Identifier options (one must be provided)
  id: z.string().optional().describe('The ID of the subscription to update'),
  key: z.string().optional().describe('The key of the subscription to update'),

  // Common required parameters
  version: z
    .number()
    .int()
    .describe(
      'Expected version of the subscription on which the changes should be applied'
    ),

  // Actions to perform
  actions: z
    .array(
      z.union([
        // Change Destination action
        z.object({
          action: z.literal('changeDestination'),
          destination: subscriptionDestination.describe(
            'New destination configuration'
          ),
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
            .describe('New key for the subscription'),
        }),
        // Set Changes action
        z.object({
          action: z.literal('setChanges'),
          changes: z
            .array(
              z.object({
                resourceTypeId: z
                  .enum([
                    'cart',
                    'category',
                    'customer',
                    'customer-group',
                    'customer-email-token',
                    'discount-code',
                    'inventory-entry',
                    'key-value-document',
                    'order',
                    'order-edit',
                    'payment',
                    'product',
                    'product-price',
                    'quote',
                    'quote-request',
                    'review',
                    'staged-quote',
                  ])
                  .describe('Resource type for change subscription'),
              })
            )
            .describe('New changes configuration'),
        }),
        // Set Messages action
        z.object({
          action: z.literal('setMessages'),
          messages: z
            .array(subscriptionMessageType)
            .describe('New messages configuration'),
        }),
        // Set Messages action
        z.object({
          action: z.literal('setMessageFormat'),
          format: z
            .object({
              type: z.enum(['Platform', 'CloudEvents']),
              cloudEventsVersion: z
                .string()
                .optional()
                .describe('CloudEvents version (optional)'),
            })
            .describe('New message format configuration'),
        }),
      ])
    )
    .describe('Update actions to be performed on the subscription'),
});

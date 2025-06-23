import {z} from 'zod';

export const readChannelParameters = z.object({
  id: z.string().describe('The ID of the channel to fetch').optional(),
  key: z.string().describe('The key of the channel to fetch').optional(),
  where: z
    .array(z.string())
    .optional()
    .describe(
      'Query predicates specified as strings for filtering channels. Example: ["roles contains any \\"InventorySupply\\",\\"ProductDistribution\\""]'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'A limit on the number of objects to be returned. Limit can range between 1 and 500, and the default is 20.'
    ),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The number of items to skip before starting to collect the result set.'
    ),
  sort: z
    .array(z.string())
    .optional()
    .describe(
      'Sort criteria for the results. Example: ["name.en asc", "createdAt desc"]'
    ),
  expand: z
    .array(z.string())
    .optional()
    .describe('An array of field paths to expand. Example: ["custom.type"]'),
});

const channelRoleEnum = z.enum([
  'InventorySupply',
  'ProductDistribution',
  'OrderExport',
  'OrderImport',
  'Primary',
]);

export const createChannelParameters = z.object({
  key: z
    .string()
    .min(1)
    .max(256)
    .describe('User-defined unique identifier for the Channel.'),
  roles: z
    .array(channelRoleEnum)
    .min(1)
    .describe('Roles of the Channel. At least one role is required.'),
  name: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized name of the Channel.'),
  description: z
    .record(z.string(), z.string())
    .optional()
    .describe('Localized description of the Channel.'),
  address: z
    .object({})
    .passthrough()
    .optional()
    .describe('Address where the Channel is located.'),
  geoLocation: z
    .object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional()
    .describe('GeoJSON Point encoding the geo location of the Channel.'),
  custom: z
    .object({
      type: z.object({
        id: z.string(),
        typeId: z.literal('type'),
      }),
      fields: z.record(z.string(), z.any()),
    })
    .optional()
    .describe('Custom fields for the Channel.'),
});

export const updateChannelParameters = z.object({
  id: z.string().describe('The ID of the channel to update').optional(),
  key: z.string().describe('The key of the channel to update').optional(),
  version: z.number().int().describe('The current version of the channel'),
  actions: z.array(
    z
      .object({
        action: z.string().describe('The name of the update action to perform'),
      })
      .and(z.record(z.string(), z.any()).optional())
      .describe(
        'Array of update actions to perform on the channel. Each action should have an "action" field and other fields specific to that action type.'
      )
  ),
});

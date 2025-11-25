import {z} from 'zod';

// Generated schemas for channel
// DO NOT EDIT - This file is auto-generated

// Base Channel schema
export const channelSchema = z
  .object({
    id: z.string(),
    version: z.number(),
    createdAt: z.string(),
    lastModifiedAt: z.string(),
    lastModifiedBy: z.any().optional(),
    createdBy: z.any().optional(),
    key: z.string(),
    roles: z.array(z.any()),
    name: z.any().optional(),
    description: z.any().optional(),
    address: z.any().optional(),
    reviewRatingStatistics: z.any().optional(),
    custom: z.any().optional(),
    geoLocation: z.any().optional(),
  })
  .strict();

// Paged ChannelPagedQueryResponse schema
export const channelPagedSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    count: z.number(),
    total: z.number().optional(),
    results: z.array(z.any()),
  })
  .strict();

export const readChannelOutputSchema = channelSchema || channelPagedSchema;
export const createChannelOutputSchema = channelSchema;
export const updateChannelOutputSchema = channelSchema;

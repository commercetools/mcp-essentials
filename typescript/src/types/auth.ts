import {z} from 'zod';

// Base authentication config with common fields
interface BaseAuthConfig {
  authUrl: string;
  projectKey: string;
  apiUrl: string;
}

// Client credentials flow - for API Client authentication
export interface ClientCredentialsAuth extends BaseAuthConfig {
  type: 'client_credentials';
  clientId: string;
  clientSecret: string;
}

// Password flow - for customer authentication with Me endpoints
export interface PasswordAuth extends BaseAuthConfig {
  type: 'password';
  clientId: string;
  clientSecret: string;
  username: string; // customer email
  password: string;
}

// Anonymous session flow - for guest checkout
export interface AnonymousSessionAuth extends BaseAuthConfig {
  type: 'anonymous_session';
  clientId: string;
  clientSecret: string;
}

// Existing token flow - for using pre-existing tokens
export interface ExistingTokenAuth extends BaseAuthConfig {
  type: 'auth_token';
  accessToken: string;
}

export type AuthConfig =
  | ClientCredentialsAuth
  | PasswordAuth
  | AnonymousSessionAuth
  | ExistingTokenAuth;

export const clientCredentialsAuthSchema = z.object({
  type: z.literal('client_credentials'),
  clientId: z.string(),
  clientSecret: z.string(),
  authUrl: z.string().url(),
  projectKey: z.string(),
  apiUrl: z.string().url(),
});

export const passwordAuthSchema = z.object({
  type: z.literal('password'),
  clientId: z.string(),
  clientSecret: z.string(),
  username: z.string().email(),
  password: z.string(),
  authUrl: z.string().url(),
  projectKey: z.string(),
  apiUrl: z.string().url(),
});

export const anonymousSessionAuthSchema = z.object({
  type: z.literal('anonymous_session'),
  clientId: z.string(),
  clientSecret: z.string(),
  authUrl: z.string().url(),
  projectKey: z.string(),
  apiUrl: z.string().url(),
});

export const existingTokenAuthSchema = z.object({
  type: z.literal('auth_token'),
  accessToken: z.string(),
  authUrl: z.string().url(),
  projectKey: z.string(),
  apiUrl: z.string().url(),
});

export const authConfigSchema = z.union([
  clientCredentialsAuthSchema,
  passwordAuthSchema,
  anonymousSessionAuthSchema,
  existingTokenAuthSchema,
]);

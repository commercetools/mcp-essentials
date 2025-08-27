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

// Existing token flow - for using pre-existing tokens
export interface ExistingTokenAuth extends BaseAuthConfig {
  type: 'auth_token';
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
}

export interface Introspect {
  active: boolean;
  scope: string;
  exp: bigint;
  client_id: string;
}

export type AuthConfig = ClientCredentialsAuth | ExistingTokenAuth;

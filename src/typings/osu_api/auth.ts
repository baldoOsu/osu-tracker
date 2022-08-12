export interface OAuthCreds {
  clientId: number,
  clientSecret: string,
  grant_type: 'client_credentials',
  scope: 'public'
}

export interface OAuthResponse {
  access_token: string,
  expires_in: number,
  token_type: 'Bearer'
}
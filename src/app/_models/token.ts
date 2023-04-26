export interface Token {
  [prop: string]: any;

  token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refreshToken?: string;
}

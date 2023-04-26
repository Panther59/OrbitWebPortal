export class User {
  [prop: string]: any;

  id?: number | string | null;
  name?: string;
  initial?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
  roles?: any[];
  permissions?: any[];
}

export interface Token {
  [prop: string]: any;

  token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refreshToken?: string;
}

export interface UserTokenRequest {
  googleToken: string;
  email?: string;
}

import { base64, capitalize, currentTimestamp, timeLeft } from 'app/_services';

export interface Token {
  [prop: string]: any;

  token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refreshToken?: string;
}

export abstract class BaseToken {
  constructor(protected attributes: Token) {}

  get token(): string {
    return this.attributes.token;
  }

  get refresh_token(): string | void {
    return this.attributes.refreshToken;
  }

  get token_type(): string {
    return this.attributes.token_type ?? 'bearer';
  }

  get exp(): number | void {
    return this.attributes.exp;
  }

  valid(): boolean {
    return this.hasAccessToken() && !this.isExpired();
  }

  getBearerToken(): string {
    return this.token
      ? [capitalize(this.token_type), this.token].join(' ').trim()
      : '';
  }

  needRefresh(): boolean {
    return this.exp !== undefined && this.exp >= 0;
  }

  getRefreshTime(): number {
    return timeLeft((this.exp ?? 0) - 5);
  }

  private hasAccessToken(): boolean {
    return !!this.token;
  }

  private isExpired(): boolean {
    return this.exp !== undefined && this.exp - currentTimestamp() <= 0;
  }
}

export class SimpleToken extends BaseToken {}

export class JwtToken extends SimpleToken {
  private _payload?: { exp?: number | void };

  static is(accessToken: string): boolean {
    try {
      const [_header] = accessToken.split('.');
      const header = JSON.parse(base64.decode(_header));

      return header.typ.toUpperCase().includes('JWT');
    } catch (e) {
      return false;
    }
  }

  get exp(): number | void {
    return this.payload?.exp;
  }

  private get payload(): { exp?: number | void } {
    if (!this.token) {
      return {};
    }

    if (this._payload) {
      return this._payload;
    }

    const [, payload] = this.token.split('.');
    const data = JSON.parse(base64.decode(payload));
    if (!data.exp) {
      data.exp = this.attributes.exp;
    }

    return (this._payload = data);
  }
}

import { Injectable } from '@angular/core';
import { SimpleToken, JwtToken, BaseToken } from '../_models/token';
import { Token } from 'app/_models';

@Injectable({
  providedIn: 'root',
})
export class TokenFactory {
  create(attributes: Token): BaseToken | undefined {
    if (!attributes.token) {
      return undefined;
    }

    if (JwtToken.is(attributes.token)) {
      return new JwtToken(attributes);
    }

    return new SimpleToken(attributes);
  }
}

import { base64, currentTimestamp, JwtToken } from '@core/authentication';

describe('Token', () => {
  describe('JwtToken', () => {
    function generateToken(params: any, typ = 'JWT') {
      return [
        base64.encode(JSON.stringify({ typ, alg: 'HS256' })),
        base64.encode(JSON.stringify(params)),
        base64.encode('ng-matero'),
      ].join('.');
    }

    const exp = currentTimestamp() + 3600;
    const token = new JwtToken({
      token: generateToken({ exp }, 'at+JWT'),
      token_type: 'Bearer',
    });

    it('test token is JWT', () => {
      expect(JwtToken.is(token.token)).toBeTrue();
    });

    it('test bearer token', function () {
      expect(token.getBearerToken()).toBe(`Bearer ${token.token}`);
    });

    it('test payload has exp attribute', () => {
      expect(token.exp).toEqual(exp);
    });

    it('test payload does not has exp attribute', () => {
      expect(token.exp).toEqual(exp);
    });

    it('test does not has exp attribute', () => {
      const token = new JwtToken({ token: generateToken({}), token_type: 'Bearer' });

      expect(token.exp).toBeUndefined();
    });
  });
});

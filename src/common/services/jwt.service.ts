import { Injectable } from '@nestjs/common';
import { JWT_CONSTANTS } from '@src/common/constants/jwt.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  secret = JWT_CONSTANTS.secret;
  signOptions = { expiresIn: '24h' };

  sign(payload: any) {
    return jwt.sign(payload, this.secret, {
      expiresIn: '24h',
    });
  }
  verify(token: string) {
    return this.decode(token);
  }
  decode(token: string) {
    return jwt.verify(token, this.secret, {
      ignoreExpiration: false,
    });
  }
}

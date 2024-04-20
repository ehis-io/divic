import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/user/models/user';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, pass: string) {
    const user = await this.authenticationService.validateUser({
      email,
      pass,
    });
    const { password, ...result } = user;

    return result;
  }
}

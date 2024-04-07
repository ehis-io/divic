import { Inject, Module } from '@nestjs/common';

import { UserService } from 'src/user/services/user.service';

import { UserModule } from 'src/user/user.module';
import { AuthenticationService } from './services/authentication.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from 'src/config/prisma.service';
import { AuthenticationResolver } from './resolver/authentication.resolver';
import { PassportModule } from '@nestjs/passport';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    CacheModule.register(),
    HttpModule.register({}),
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
  ],

  providers: [
    AuthenticationService,
    UserService,
    PrismaService,
    AuthenticationResolver,
  ],

  exports: [PassportModule],
})
export class AuthenticationModule {}

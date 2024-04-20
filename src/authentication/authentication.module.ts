import { Inject, Module } from '@nestjs/common';

import { UserService } from 'src/user/services/user.service';

import { UserModule } from 'src/user/user.module';
import { AuthenticationService } from './services/authentication.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './interface/constant';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from 'src/config/prisma.service';
import { AuthenticationResolver } from './resolver/authentication.resolver';
import { PassportModule } from '@nestjs/passport';

import { HttpModule } from '@nestjs/axios';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    CacheModule.register(),
    HttpModule.register({}),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
  ],

  providers: [
    AuthenticationService,
    LocalStrategy,
    UserService,
    PrismaService,
    AuthenticationResolver,
    JwtStrategy,
  ],

  // exports: [PassportModule],
})
export class AuthenticationModule {}

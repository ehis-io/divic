import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtService } from '@nestjs/jwt';

import { GraphQLModule } from '@nestjs/graphql';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ENV } from './interfaces/env.interface';
import { join } from 'path';
const ENV_VARIABLES = process.env as any as ENV;

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      formatError: (err) => ({
        message: err.message,
        status: err.extensions.code,
      }),
      playground: ENV_VARIABLES.NODE_ENV !== 'production',
      driver: ApolloDriver,

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        validationSchema: Joi.object({
          GRAPHQL_PLAYGROUND: Joi.number(),
        }),
      }),
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}

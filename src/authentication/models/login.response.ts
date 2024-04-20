import { Optional } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/models/user';

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field()
  @IsOptional()
  biometricKey: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

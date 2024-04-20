import { Optional } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { LoginResponse } from './login.response';

@ObjectType()
export class Auth {
  @Field(() => String)
  email: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

import { Optional } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class Auth {
  @Field(() => String)
  email: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  @Optional()
  refreshToken: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

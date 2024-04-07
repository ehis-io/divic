import { Optional } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateUser {
  @Field()
  email: string;

  @Field()
  password: string;
}

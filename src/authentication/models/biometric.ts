import { Optional } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Challenge {
  @Field(() => String)
  challenge: string;
}

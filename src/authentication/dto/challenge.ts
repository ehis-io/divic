import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Challenge {
  @Field()
  challenge: string;

  @Field()
  userId: string;
}

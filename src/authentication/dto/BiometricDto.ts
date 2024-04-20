import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BiometricDto {
  @Field()
  email: string;

  @Field()
  signedChallenge: string;

  @Field()
  challenge: string;
}

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyDTO {
  @Field()
  challenge: string;

  @Field()
  publicKey: string;

  @Field()
  attestation: string;
}

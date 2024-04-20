import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class RegisterBiometric {
  @Field()
  challenge: string;

  @Field()
  publicKey: string;

  @Field()
  @Optional()
  attestation?: string;
}

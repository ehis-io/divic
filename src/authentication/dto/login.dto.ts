import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class Login {
  @Field()
  email: string;

  @Field()
  password: string;
}

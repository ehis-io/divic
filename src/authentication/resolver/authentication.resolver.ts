import { User } from 'src/user/models/user';
import { Login } from '../dto/login.dto';
import { AuthenticationService } from '../services/authentication.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from '../models/auth';
import { UseGuards } from '@nestjs/common';
import { GqlJWTAuthGuard } from '../guards/gql.jwt.auth.guard';
import { GetUser } from '../decorator/user.decorator';
import { Challenge } from '../models/biometric';

@Resolver(() => Auth)
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Mutation(() => Auth)
  async logIn(@Args('logIn') login: Login): Promise<{}> {
    return this.authenticationService.loginWithPassword(login);
  }

  @Mutation(() => Challenge)
  @UseGuards(GqlJWTAuthGuard)
  async logInWithBiometrics(
    @Args('id') id: string,
    @GetUser() user: User,
  ): Promise<{}> {
    return this.authenticationService.getChallenge();
  }

  @Query(() => Auth)
  @UseGuards(GqlJWTAuthGuard)
  async register(
    @Args('publicKey') publicKey: string,
    @GetUser()
    user: User,
  ) {
    return this.authenticationService.register(publicKey, user);
  }

  // @Mutation(() => Auth)
  // async passwordlessLogin(@Args('') login): Promise<{}> {
  //   return this.authenticationService.loginWithPassword(login);
  // }
}
